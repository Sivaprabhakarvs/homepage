import os
import sys

try:
    from PIL import Image
    import pillow_avif
    from pillow_heif import register_heif_opener
except ImportError:
    print("Required libraries are missing. Install them using:")
    print("python -m pip install Pillow pillow-avif-plugin pillow-heif")
    sys.exit(1)

register_heif_opener()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MAX_DIMENSION = 1200
QUALITY = 80

TARGET_DIRECTORIES = [
    os.path.join(BASE_DIR, "assets", "images")
]

SUPPORTED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".heic", ".heif")


def convert_to_avif():
    total_found = 0
    total_converted = 0
    total_skipped = 0
    total_errors = 0

    for directory in TARGET_DIRECTORIES:
        if not os.path.exists(directory):
            print(f"Directory not found: {directory}")
            continue

        print(f"\nScanning directory: {directory}")

        for root, _, files in os.walk(directory):
            for file in files:
                file_lower = file.lower()
                file_path = os.path.join(root, file)

                if file_lower.endswith(SUPPORTED_EXTENSIONS):
                    total_found += 1
                    print(f"Found supported file: {file_path}")

                    avif_filename = os.path.splitext(file)[0] + ".avif"
                    avif_path = os.path.join(root, avif_filename)

                    if os.path.exists(avif_path):
                        print(f"Skipping (already exists): {avif_path}")
                        total_skipped += 1
                        continue

                    try:
                        with Image.open(file_path) as img:
                            img.load()

                            if img.mode in ("RGBA", "LA", "P"):
                                if img.mode == "P":
                                    img = img.convert("RGBA")
                                bg = Image.new("RGB", img.size, (255, 255, 255))
                                bg.paste(img, mask=img.split()[-1] if "A" in img.mode else None)
                                img = bg
                            elif img.mode != "RGB":
                                img = img.convert("RGB")

                            width, height = img.size

                            if max(width, height) > MAX_DIMENSION:
                                scale_factor = MAX_DIMENSION / max(width, height)
                                new_width = int(width * scale_factor)
                                new_height = int(height * scale_factor)
                                img = img.resize(
                                    (new_width, new_height),
                                    Image.Resampling.LANCZOS
                                )

                            img.save(avif_path, format="AVIF", quality=QUALITY)

                        print(f"Converted: {file_path} -> {avif_path}")
                        total_converted += 1

                    except Exception as e:
                        print(f"Error converting {file_path}: {e}")
                        total_errors += 1

    print("\nSummary")
    print(f"Total supported files found: {total_found}")
    print(f"Converted: {total_converted}")
    print(f"Skipped: {total_skipped}")
    print(f"Errors: {total_errors}")


if __name__ == "__main__":
    convert_to_avif()