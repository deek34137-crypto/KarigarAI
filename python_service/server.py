from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from typing import Optional
from processor import process_product_image

app = FastAPI(
    title="KarigarAI Image Studio Service",
    description="Python microservice providing rembg background removal, 1:1 e-commerce standardization, and compression for traditional artisan crafts.",
    version="1.0.0",
)

# Enable CORS for Next.js client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessRequest(BaseModel):
    imageBase64: str
    removeBg: Optional[bool] = True
    quality: Optional[int] = 85


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "KarigarAI Image Studio"}


@app.post("/process-image")
def process_image_endpoint(req: ProcessRequest):
    try:
        data = req.imageBase64
        if "," in data:
            data = data.split(",")[1]

        image_bytes = base64.b64decode(data)
        result = process_product_image(
            input_bytes=image_bytes,
            remove_bg=req.removeBg if req.removeBg is not None else True,
            quality=req.quality or 85,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/upload-and-process")
async def upload_and_process(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = process_product_image(input_bytes=contents, remove_bg=True)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
