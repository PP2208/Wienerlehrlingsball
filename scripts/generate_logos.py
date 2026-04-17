import asyncio
import os
import base64
import uuid
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

OUT_DIR = "/app/generated_logos"
os.makedirs(OUT_DIR, exist_ok=True)

PROMPTS = [
    # Variant 1: Monogram emblem
    (
        "v1_monogram",
        "Elegant luxury monogram logo for 'Wiener Lehrlingsball 2027'. "
        "Intertwined serif capital letters 'W' and 'L' in deep gold (#D1A954) "
        "on a pure solid midnight dark navy background (#050810). "
        "Thin delicate gold flourishes and a subtle laurel-like art-deco frame around the monogram. "
        "Playfair Display style serif typography. "
        "Beneath the monogram, in very small refined serif caps: 'WIENER LEHRLINGSBALL · 2027'. "
        "Symmetrical, centered composition, minimal, luxurious, premium feel. "
        "Square 1:1 format, vector-style flat illustration, crisp lines, no gradients, no photorealism, no people."
    ),
    # Variant 2: Wordmark with ornament
    (
        "v2_wordmark",
        "Refined wordmark logo for 'Wiener Lehrlingsball 2027'. "
        "Classical Wiener-ball elegance meets modern minimalism. "
        "Serif typography (similar to Playfair Display) in warm gold (#D1A954) on solid midnight navy (#050810) background. "
        "Two lines: 'WIENER' small uppercase on top in silver (#C0C0C0), then 'Lehrlingsball' large in italic gold serif, "
        "and '2027' underneath in small gold numerals separated by a thin gold horizontal hairline. "
        "A single tiny gold ornamental fleur-de-lis or art-deco flourish centered above the word 'WIENER'. "
        "Sophisticated, symmetrical, clean, premium event branding. "
        "Square 1:1 format, vector style, no people, no photo, no gradients, no clutter."
    ),
    # Variant 3: Crest/seal
    (
        "v3_crest",
        "Elegant circular crest/seal logo for 'Wiener Lehrlingsball 2027'. "
        "A thin gold double-ring (#D1A954) on solid midnight dark navy (#050810). "
        "Inside the ring, stylized intertwined serif initials 'WL' in gold in the center. "
        "Around the inner ring, in small refined serif uppercase letters in silver (#C0C0C0): "
        "'WIENER LEHRLINGSBALL · ANNO 2027'. "
        "Two tiny art-deco star ornaments on left and right balancing the inscription. "
        "Very thin lines, elegant, symmetrical, luxurious, premium feel. "
        "Vector-style flat illustration, crisp edges, no gradients, no people, no photo, square 1:1."
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
