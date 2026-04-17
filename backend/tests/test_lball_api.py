"""Backend API tests for Wiener Lehrlingsball 2027"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


@pytest.fixture(scope="module")
def admin_token():
    res = requests.post(f"{BASE_URL}/api/admin/login", json={"username": "admin", "password": "PPAdmin"})
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# -- Newsletter tests --
class TestNewsletter:
    TEST_EMAIL = "test_lball_auto@example.com"

    def test_subscribe_valid(self):
        res = requests.post(f"{BASE_URL}/api/newsletter", json={"email": self.TEST_EMAIL})
        assert res.status_code == 201
        data = res.json()
        assert data["status"] in ("subscribed", "already_subscribed")

    def test_subscribe_duplicate_returns_already_subscribed(self):
        requests.post(f"{BASE_URL}/api/newsletter", json={"email": self.TEST_EMAIL})
        res = requests.post(f"{BASE_URL}/api/newsletter", json={"email": self.TEST_EMAIL})
        assert res.status_code == 201
        assert res.json()["status"] == "already_subscribed"

    def test_subscribe_invalid_email(self):
        res = requests.post(f"{BASE_URL}/api/newsletter", json={"email": "not-an-email"})
        assert res.status_code == 422

    def test_subscribe_with_source(self):
        res = requests.post(f"{BASE_URL}/api/newsletter", json={"email": "test_tickets_src@example.com", "source": "tickets"})
        assert res.status_code == 201


# -- Contact tests --
class TestContact:
    def test_submit_contact_valid(self):
        res = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test User",
            "email": "contact_test@example.com",
            "message": "Test message for testing"
        })
        assert res.status_code == 201
        data = res.json()
        assert data["status"] == "received"

    def test_submit_contact_invalid_email(self):
        res = requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Test",
            "email": "bad-email",
            "message": "Test"
        })
        assert res.status_code == 422

    def test_submit_contact_missing_name(self):
        res = requests.post(f"{BASE_URL}/api/contact", json={
            "email": "test@example.com",
            "message": "Test"
        })
        assert res.status_code == 422


# -- Admin Auth tests --
class TestAdminAuth:
    def test_login_success(self):
        res = requests.post(f"{BASE_URL}/api/admin/login", json={"username": "admin", "password": "PPAdmin"})
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self):
        res = requests.post(f"{BASE_URL}/api/admin/login", json={"username": "admin", "password": "wrong"})
        assert res.status_code == 401

    def test_me_with_token(self, auth_headers):
        res = requests.get(f"{BASE_URL}/api/admin/me", headers=auth_headers)
        assert res.status_code == 200
        data = res.json()
        assert data["username"] == "admin"
        assert data["role"] == "admin"

    def test_me_without_token(self):
        res = requests.get(f"{BASE_URL}/api/admin/me")
        assert res.status_code == 401


# -- Admin data access tests --
class TestAdminData:
    def test_newsletter_list_with_auth(self, auth_headers):
        res = requests.get(f"{BASE_URL}/api/admin/newsletter", headers=auth_headers)
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_newsletter_list_without_auth(self):
        res = requests.get(f"{BASE_URL}/api/admin/newsletter")
        assert res.status_code == 401

    def test_contacts_list_with_auth(self, auth_headers):
        res = requests.get(f"{BASE_URL}/api/admin/contacts", headers=auth_headers)
        assert res.status_code == 200
        assert isinstance(res.json(), list)

    def test_contacts_list_without_auth(self):
        res = requests.get(f"{BASE_URL}/api/admin/contacts")
        assert res.status_code == 401

    def test_newsletter_export_csv(self, auth_headers):
        res = requests.get(f"{BASE_URL}/api/admin/newsletter/export", headers=auth_headers)
        assert res.status_code == 200
        assert "text/csv" in res.headers.get("content-type", "")

    def test_contacts_export_csv(self, auth_headers):
        res = requests.get(f"{BASE_URL}/api/admin/contacts/export", headers=auth_headers)
        assert res.status_code == 200
        assert "text/csv" in res.headers.get("content-type", "")

    def test_delete_newsletter_entry(self, auth_headers):
        # Create a subscriber first
        email = "test_delete_nl@example.com"
        requests.post(f"{BASE_URL}/api/newsletter", json={"email": email})
        # Get all to find it
        nl = requests.get(f"{BASE_URL}/api/admin/newsletter", headers=auth_headers).json()
        entry = next((x for x in nl if x["email"] == email), None)
        if entry is None:
            pytest.skip("Could not find test subscriber to delete")
        res = requests.delete(f"{BASE_URL}/api/admin/newsletter/{entry['id']}", headers=auth_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "deleted"

    def test_delete_contact_entry(self, auth_headers):
        # Create contact first
        requests.post(f"{BASE_URL}/api/contact", json={
            "name": "Delete Me",
            "email": "delete_contact@example.com",
            "message": "Please delete"
        })
        contacts = requests.get(f"{BASE_URL}/api/admin/contacts", headers=auth_headers).json()
        entry = next((x for x in contacts if x["email"] == "delete_contact@example.com"), None)
        if entry is None:
            pytest.skip("Could not find test contact to delete")
        res = requests.delete(f"{BASE_URL}/api/admin/contacts/{entry['id']}", headers=auth_headers)
        assert res.status_code == 200
        assert res.json()["status"] == "deleted"
