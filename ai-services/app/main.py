from fastapi import FastAPI

from app.routes.prediction import router

app = FastAPI(title="SIH AI Service")

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "SIH AI Service is running"
    }