from difflib import SequenceMatcher


def check_duplicate(new_text, existing_problems):
    for problem in existing_problems:
        similarity = SequenceMatcher(
            None,
            new_text.lower(),
            problem.lower()
        ).ratio()

        if similarity >= 0.6:
            return True

    return False