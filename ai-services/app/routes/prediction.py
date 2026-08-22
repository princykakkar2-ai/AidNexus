from fastapi import APIRouter
from pydantic import BaseModel

from app.services.categorizer import categorize_problem
from app.services.priority import detect_priority
from app.services.summarizer import generate_summary
from app.services.duplicate import check_duplicate

router = APIRouter()


class Problem(BaseModel):
    title: str
    description: str


existing_problems = [
    "Garbage has accumulated near the school",
    "Road has a large pothole near the market",
    "Street lights are not working"
]


@router.post("/analyze")
def analyze_problem(problem: Problem):

    category = categorize_problem(
        problem.title,
        problem.description
    )

    priority = detect_priority(
        problem.title,
        problem.description
    )

    summary = generate_summary(
        problem.title,
        problem.description
    )

    text = problem.title + " " + problem.description

    duplicate = check_duplicate(
        text,
        existing_problems
    )

    return {
        "category": category,
        "priority": priority,
        "summary": summary,
        "duplicate": duplicate
    }