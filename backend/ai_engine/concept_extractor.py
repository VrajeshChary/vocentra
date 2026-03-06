from sklearn.feature_extraction.text import TfidfVectorizer
import spacy
import re

nlp = spacy.load("en_core_web_sm")


def filter_nouns(text):
    """
    Extract meaningful nouns and remove numbers / junk
    """

    doc = nlp(text)

    words = []

    for token in doc:

        if token.pos_ in ["NOUN", "PROPN"]:

            word = token.lemma_.lower()

            # remove numbers
            if re.search(r'\d', word):
                continue

            # remove very short tokens
            if len(word) < 3:
                continue

            words.append(word)

    return " ".join(words)


def extract_concepts(reference_text, student_text, top_n=20):

    ref_filtered = filter_nouns(reference_text)
    stu_filtered = filter_nouns(student_text)

    texts = [ref_filtered, stu_filtered]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1,1),   # FIXED
        max_features=200
    )

    tfidf_matrix = vectorizer.fit_transform(texts)

    feature_names = vectorizer.get_feature_names_out()

    ref_scores = tfidf_matrix[0].toarray()[0]

    word_scores = dict(zip(feature_names, ref_scores))

    sorted_words = sorted(
        word_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    concepts = []

    for word, score in sorted_words[:top_n]:
        concepts.append(word)

    return set(concepts)


def calculate_concept_score(reference_text, student_text):

    ref_concepts = extract_concepts(reference_text, student_text)

    student_concepts = extract_concepts(student_text, reference_text)

    matched = ref_concepts.intersection(student_concepts)

    missing = ref_concepts - student_concepts

    hallucinated = student_concepts - ref_concepts

    score = len(matched) / max(len(ref_concepts), 1)

    print("\n========== CONCEPT ANALYSIS ==========")

    print("\nExpected Concepts:")
    print(ref_concepts)

    print("\nStudent Concepts:")
    print(student_concepts)

    print("\nMatched Concepts:")
    print(matched)

    print("\nMissing Concepts:")
    print(missing)

    print("\nHallucinated Concepts:")
    print(hallucinated)

    print("\nConcept Score:", round(score, 2))

    print("======================================")

    return round(score, 2)