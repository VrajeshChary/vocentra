import re

def clean_text(text):

    text = text.lower()

    fillers = ["uh", "um", "like", "you know"]

    for f in fillers:
        text = re.sub(rf"\b{f}\b", "", text)

    text = re.sub(r"[^\w\s]", "", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()