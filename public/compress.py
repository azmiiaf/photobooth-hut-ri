import os
from PIL import Image

def convert_to_webp(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".png"):
            filepath = os.path.join(directory, filename)
            img = Image.open(filepath)
            
            # Save as webp
            new_filename = filename.replace(".png", ".webp")
            new_filepath = os.path.join(directory, new_filename)
            
            img.save(new_filepath, 'webp', optimize=True, quality=80)
            print(f"Converted {filename} to {new_filename}")

            # remove old png
            os.remove(filepath)

if __name__ == "__main__":
    convert_to_webp("c:/Users/azmi/photobooth17an/public/images")
