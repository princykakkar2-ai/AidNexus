import httpx


async def match_teams(required_skills, category):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            "http://localhost:5000/api/teams"
        )

        response.raise_for_status()

        data = response.json()

    teams = data["data"]

    results = []

    required = set(
        skill.lower() for skill in required_skills
    )

    for team in teams:

        if not team["available"]:
            continue

        team_skills = set(
            skill.lower() for skill in team["skills"]
        )

        skill_match = len(
            team_skills.intersection(required)
        )

        if required:
            skill_score = (
                skill_match / len(required)
            ) * 70
        else:
            skill_score = 0

        category_score = (
            20
            if category in team["categories"]
            else 0
        )

        availability_score = 10

        total_score = (
            skill_score
            + category_score
            + availability_score
        )

        results.append({
            "team": team["name"],
            "university": team["university"],
            "score": round(total_score),
            "matchedSkills": list(
                team_skills.intersection(required)
            )
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results[:3]