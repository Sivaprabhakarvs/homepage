import os
import sys

try:
    from PIL import Image
    import pillow_avif
except ImportError:
    print("Required libraries are missing. Please install them by running:")
    print("pip install Pillow pillow-avif-plugin")
    sys.exit(1)

MAX_DIMENSION = 1200
QUALITY = 80
TARGET_DIRECTORIES = [
    os.path.join("assets", "images", "gallery"),
    os.path.join("assets", "images", "pencil_sketches"),
    os.path.join("assets", "images", "photographs")
]

def convert_to_avif():
    for directory in TARGET_DIRECTORIES:
        if not os.path.exists(directory):
            print(f"Directory not found: {directory}")
            continue
            
        for root, _, files in os.walk(directory):
            for file in files:
                file_lower = file.lower()
                if file_lower.endswith(('.jpg', '.jpeg', '.png')):
                    file_path = os.path.join(root, file)
                    avif_filename = os.path.splitext(file)[0] + '.avif'
                    avif_path = os.path.join(root, avif_filename)

                    if os.path.exists(avif_path):
                        continue

                    img = Image.open(file_path)
                    
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")

                    width, height = img.size
                    if max(width, height) > MAX_DIMENSION:
                        scale_factor = MAX_DIMENSION / max(width, height)
                        new_width = int(width * scale_factor)
                        new_height = int(height * scale_factor)
                        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

                    img.save(avif_path, format="AVIF", quality=QUALITY)
                    print(f"Converted: {file} -> {avif_filename}")

if __name__ == "__main__":
    convert_to_avif()