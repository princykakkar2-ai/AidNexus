def detect_priority(title, description):
    text = f"{title} {description}".lower()

    high_priority_words = [
        "emergency",
        "accident",
        "danger",
        "critical",
        "fire",
        "flood",
        "unsafe",
        "death"
    ]

    medium_priority_words = [
        "broken",
        "leakage",
        "damage",
        "problem",
        "blocked",
        "overflow"
    ]

    for word in high_priority_words:
        if word in text:
            return "High"

    for word in medium_priority_words:
        if word in text:
            return "Medium"

    return "Low"