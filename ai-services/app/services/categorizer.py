categories = {
    "Environment": [
        "garbage", "waste", "pollution", "dustbin", "clean"
    ],

    "Infrastructure": [
        "road", "pothole", "bridge", "street", "traffic"
    ],

    "Healthcare": [
        "hospital", "doctor", "medicine", "health", "clinic"
    ],

    "Education": [
        "school", "teacher", "student", "college", "education"
    ],

    "Water": [
        "water", "pipeline", "leakage", "drainage", "sewage"
    ],

    "Public Safety": [
        "accident", "danger", "crime", "unsafe", "emergency"
    ]
}


def categorize_problem(title, description):
    text = f"{title} {description}".lower()

    scores = {}

    for category, keywords in categories.items():
        scores[category] = 0

        for keyword in keywords:
            if keyword in text:
                scores[category] += 1

    important_keywords = {
        "Infrastructure": ["road", "pothole", "bridge", "street"],
        "Environment": ["garbage", "waste", "pollution", "dustbin"],
        "Healthcare": ["hospital", "doctor", "medicine", "clinic"],
        "Education": ["school", "teacher", "student", "college"],
        "Water": ["water", "pipeline", "leakage", "drainage"],
        "Public Safety": ["crime", "emergency"]
    }

    for category, keywords in important_keywords.items():
        for keyword in keywords:
            if keyword in text:
                scores[category] += 2

    best_category = "Other"
    highest_score = 0

    for category, score in scores.items():
        if score > highest_score:
            highest_score = score
            best_category = category

    return best_category