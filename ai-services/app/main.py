from fastapi import FastAPI

from app.routes.prediction import router
from app.routes.team_matching import router as team_router

app = FastAPI(title="SIH AI Service")

app.include_router(router)
app.include_router(team_router)


@app.get("/")
def home():
    return {
        "message": "SIH AI Service is running"
    }