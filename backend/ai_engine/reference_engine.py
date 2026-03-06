import wikipediaapi
import wikipedia
import spacy

nlp = spacy.load("en_core_web_sm")

wiki_api = wikipediaapi.Wikipedia(
    language="en",
    extract_format=wikipediaapi.ExtractFormat.WIKI,
    user_agent="Vocentra/1.0"
)


def clean_topic(topic):
    topic = topic.lower()

    remove_words = [
        "concept",
        "process",
        "working",
        "explanation",
        "system"
    ]

    for w in remove_words:
        topic = topic.replace(w, "")

    return topic.strip()


def get_wikipedia_reference(topic):
    page = wiki_api.page(topic)

    if page.exists():
        print(f"Reference found on Wikipedia for: {topic}")
        return page.summary[:1500], "Wikipedia"

    return None, None


def search_wikipedia(topic):
    try:
        results = wikipedia.search(topic)

        if len(results) > 0:
            best = results[0]

            page = wiki_api.page(best)

            if page.exists():
                print(f"Reference found via search: {best}")
                return page.summary[:1500], "Wikipedia Search"

    except Exception:
        pass

    return None, None


def extract_topic_keyword(topic):
    doc = nlp(topic)

    for chunk in doc.noun_chunks:
        return chunk.text

    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"]:
            return token.text

    return topic


def get_best_reference(topic, transcript):

    print(f"Finding reference for: {topic}")

    # 1 Exact topic
    ref, src = get_wikipedia_reference(topic)
    if ref:
        return ref, src

    # 2 Cleaned topic
    cleaned = clean_topic(topic)
    if cleaned != topic:
        ref, src = get_wikipedia_reference(cleaned)
        if ref:
            return ref, src

    # 3 Keyword extraction
    keyword = extract_topic_keyword(topic)
    ref, src = get_wikipedia_reference(keyword)
    if ref:
        return ref, src

    # 4 Wikipedia search
    ref, src = search_wikipedia(topic)
    if ref:
        return ref, src

    # 5 Final fallback (generic reference)
    print("No Wikipedia reference found. Using generic fallback.")

    fallback = f"""
    {topic} is a technical concept. 
    The explanation should describe its definition, working principle,
    and key components involved in the system.
    """

    return fallback, "Fallback Reference"