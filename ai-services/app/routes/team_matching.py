from fastapi import APIRouter
from pydantic import BaseModel

from app.services.team_matcher import match_teams
from app.services.skill_extractor import extract_required_skills

router = APIRouter()


class TeamMatchRequest(BaseModel):
    title: str
    description: str
    category: str


@router.post("/match-team")
async def match_team(request: TeamMatchRequest):

    required_skills = extract_required_skills(
        request.title,
        request.description
    )

    teams = await match_teams(
        required_skills,
        request.category
    )

    return {
        "category": request.category,
        "requiredSkills": required_skills,
        "recommendedTeams": teams
    }