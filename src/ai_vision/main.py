from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="AI Vision Service",
    version="1.0.0"
)

class AnalyzeRequest(BaseModel):
    camera_id: str
    image_url: str
    timestamp: datetime


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "ai-vision"
    }


@app.post("/api/v1/vision/analyze", status_code=202)
def analyze(req: AnalyzeRequest):
    return {
        "status": "received",
        "message": "Image queued for background analysis"
    }