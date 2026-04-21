import asyncio
import os
import base64
import uuid
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

OUT_DIR = "/app/generated_logos"
os.makedirs(OUT_DIR, exist_ok=True)

BASE_STYLE = (
    "Refined minimalist wordmark logo. "
    "Classical Viennese ball elegance meets modern minimalism. "
    "Serif typography similar to Playfair Display in warm deep gold (#D1A954) "
    "on a solid pure midnight dark navy background (#050810). "
    "Sophisticated, perfectly symmetrical, clean, premium event branding. "
    "Very thin delicate hairline strokes in gold. No gradients. No people. No photorealism. "
    "Flat vector-style illustration, crisp edges, square 1:1 format."
)

PROMPTS = [
    (
        "v4_wordmark_rathaus",
        BASE_STYLE
        + " Composition from top to bottom, centered: "
        "(1) the word 'WIENER' in small uppercase refined serif caps in silver color (#C0C0C0) with wide letter-spacing; "
        "(2) a thin horizontal gold hairline divider below it; "
        "(3) in the middle, a small, detailed but elegant GOLD SILHOUETTE of the Vienna City Hall (Wiener Rathaus) — "
        "the iconic neo-Gothic building with its tall central tower topped by the statue 'Rathausmann', "
        "flanked by two symmetric smaller towers. Only the silhouette outline, no color, no details inside, very refined. "
        "(4) a thin horizontal gold hairline divider below the Rathaus; "
        "(5) 'est. 2027' in elegant italic serif lowercase in gold, small size. "
        "Layout is vertical, strictly symmetrical, very generous whitespace around everything."
    ),
    (
        "v5_wordmark_clean",
        BASE_STYLE
        + " Composition from top to bottom, centered: "
        "(1) a tiny elegant gold art-deco fleur/ornament at the top; "
        "(2) the word 'WIENER' in small uppercase refined serif caps in silver color (#C0C0C0) with wide letter-spacing; "
        "(3) a thin horizontal gold hairline divider below it; "
        "(4) 'est. 2027' in elegant italic serif lowercase in gold, medium size, as the visual center; "
        "(5) a thin horizontal gold hairline divider below; "
        "(6) a tiny elegant gold art-deco fleur/ornament at the bottom mirroring the top. "
        "Layout is vertical, strictly symmetrical, very generous whitespace. No city silhouette, no building. "
        "A purely typographic monogram with subtle ornament framing."
    ),
]


async def main():
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY not set")

    for name, prompt in PROMPTS:
        print(f"\n=== Generating {name} ===")
        chat = LlmChat(
            api_key=api_key,
            session_id=f"logo-{name}-{uuid.uuid4()}",
            system_message="You generate high-quality, minimalist, symmetric vector-style logo illustrations.",
        )
        chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])

        msg = UserMessage(text=prompt)
        try:
            text, images = await chat.send_message_multimodal_response(msg)
            print(f"text: {text[:120] if text else ''}")
            if images:
                for i, img in enumerate(images):
                    fname = os.path.join(OUT_DIR, f"{name}_{i}.png")
                    with open(fname, "wb") as f:
                        f.write(base64.b64decode(img["data"]))
                    print(f"saved {fname}")
            else:
                print("no images returned")
        except Exception as e:
            print(f"error on {name}: {e}")


if __name__ == "__main__":
    asyncio.run(main())
