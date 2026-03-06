from training_model import get_current_weights


def evaluate(similarity, concept_score, keyword_score, visual_score):

    weights = {
        "similarity": 0.5,
        "concept": 0.25,
        "keyword": 0.15,
        "visual": 0.10
    }

    print("\nUsing weights:", weights)

    final_score = (
        similarity * weights["similarity"]
        + concept_score * weights["concept"]
        + keyword_score * weights["keyword"]
        + visual_score * weights["visual"]
    )

    final_score = round(final_score, 2)

    if final_score >= 0.75:
        grade = "Excellent"
    elif final_score >= 0.55:
        grade = "Good"
    elif final_score >= 0.35:
        grade = "Partial"
    else:
        grade = "Poor"

    return final_score, grade


def keyword_density_score(student_text, reference_text):

    student_words = set(student_text.lower().split())
    reference_words = set(reference_text.lower().split())

    if len(reference_words) == 0:
        return 0

    matched = student_words.intersection(reference_words)

    score = len(matched) / len(reference_words)

    print("Keyword Density Score :", round(score, 2))

    return round(score, 2)