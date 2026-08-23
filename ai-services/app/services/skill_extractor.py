SKILL_KEYWORDS = {
    "IoT": [
        "iot",
        "internet of things",
        "sensor",
        "smart device",
        "smart monitoring"
    ],
    "ML": [
        "machine learning",
        "ml",
        "prediction",
        "predictive",
        "classification"
    ],
    "Web": [
        "web",
        "website",
        "web application",
        "dashboard",
        "portal"
    ],
    "App Development": [
        "mobile app",
        "android app",
        "ios app",
        "mobile application"
    ],
    "Data Analysis": [
        "data analysis",
        "analytics",
        "data visualization",
        "statistics"
    ],
}


def extract_required_skills(title, description):

    text = f"{title} {description}".lower()

    required_skills = []

    for skill, keywords in SKILL_KEYWORDS.items():

        for keyword in keywords:

            if keyword in text:
                required_skills.append(skill)
                break

    return required_skills