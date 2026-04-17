from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import io
import csv
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ADMIN_USERNAME = os.environ['ADMIN_USERNAME']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class NewsletterCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = "coming_soon"


class NewsletterOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    source: str
    created_at: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


class ContactOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    message: str
    created_at: str


class AdminLogin(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(username: str) -> str:
    payload = {
        "sub": username,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nicht authentifiziert")
    token = auth_header[7:]
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Keine Administratorrechte")
        return {"username": payload["sub"], "role": payload["role"]}
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token abgelaufen")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültiges Token")


# ---------- Startup ----------
@app.on_event("startup")
async def startup_event():
    # Seed admin user (store bcrypt hash)
    existing = await db.admin_users.find_one({"username": ADMIN_USERNAME})
    hashed = hash_password(ADMIN_PASSWORD)
    if existing is None:
        await db.admin_users.insert_one({
            "username": ADMIN_USERNAME,
            "password_hash": hashed,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.admin_users.update_one(
            {"username": ADMIN_USERNAME},
            {"$set": {"password_hash": hashed}},
        )

    # Indexes
    try:
        await db.newsletter_subscribers.create_index("email", unique=True)
        await db.admin_users.create_index("username", unique=True)
    except Exception as e:
        logging.warning(f"Index creation warning: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ---------- Public endpoints ----------
@api_router.get("/")
async def root():
    return {"message": "Wiener Lehrlingsball 2027 API"}


@api_router.post("/newsletter", status_code=201)
async def subscribe_newsletter(payload: NewsletterCreate):
    email = payload.email.lower().strip()
    # Check duplicates gracefully
    existing = await db.newsletter_subscribers.find_one({"email": email}, {"_id": 0})
    if existing:
        return {"status": "already_subscribed", "message": "Du bist bereits für unseren Newsletter registriert."}

    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "source": payload.source or "coming_soon",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.newsletter_subscribers.insert_one(doc)
    return {"status": "subscribed", "message": "Wir informieren dich, sobald es Neuigkeiten gibt."}


@api_router.post("/contact", status_code=201)
async def submit_contact(payload: ContactCreate):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "message": payload.message.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)
    return {"status": "received", "message": "Wir informieren dich, sobald es Neuigkeiten gibt."}


# ---------- Admin endpoints ----------
@api_router.post("/admin/login", response_model=TokenOut)
async def admin_login(payload: AdminLogin):
    user = await db.admin_users.find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Ungültige Anmeldedaten")
    token = create_access_token(payload.username)
    return TokenOut(access_token=token)


@api_router.get("/admin/me")
async def admin_me(admin: dict = Depends(get_current_admin)):
    return admin


@api_router.get("/admin/newsletter", response_model=List[NewsletterOut])
async def admin_newsletter_list(admin: dict = Depends(get_current_admin)):
    items = await db.newsletter_subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return items


@api_router.get("/admin/contacts", response_model=List[ContactOut])
async def admin_contacts_list(admin: dict = Depends(get_current_admin)):
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    return items


@api_router.delete("/admin/newsletter/{entry_id}")
async def admin_newsletter_delete(entry_id: str, admin: dict = Depends(get_current_admin)):
    res = await db.newsletter_subscribers.delete_one({"id": entry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return {"status": "deleted"}


@api_router.delete("/admin/contacts/{entry_id}")
async def admin_contact_delete(entry_id: str, admin: dict = Depends(get_current_admin)):
    res = await db.contact_messages.delete_one({"id": entry_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return {"status": "deleted"}


def _csv_stream(rows: List[dict], fieldnames: List[str]) -> StreamingResponse:
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for r in rows:
        writer.writerow(r)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="export-{datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")}.csv"'},
    )


@api_router.get("/admin/newsletter/export")
async def admin_newsletter_export(admin: dict = Depends(get_current_admin)):
    items = await db.newsletter_subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    return _csv_stream(items, ["id", "email", "source", "created_at"])


@api_router.get("/admin/contacts/export")
async def admin_contacts_export(admin: dict = Depends(get_current_admin)):
    items = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    return _csv_stream(items, ["id", "name", "email", "message", "created_at"])


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
