import sys
import json
import base64
from processor import process_product_image

def main():
    """
    CLI interface for Next.js subprocess execution:
    Reads JSON from stdin: { "imageBase64": "...", "removeBg": true }
    Prints JSON to stdout: { "success": true, "processed_base64": ... }
    """
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"success": False, "error": "Empty input"}))
            sys.exit(1)

        payload = json.loads(raw_input)
        image_data = payload.get("imageBase64", "")

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        remove_bg = payload.get("removeBg", True)
        quality = payload.get("quality", 85)

        result = process_product_image(
            input_bytes=image_bytes,
            remove_bg=remove_bg,
            quality=quality,
        )

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
