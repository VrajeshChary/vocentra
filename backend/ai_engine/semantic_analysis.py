from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(embedding1, embedding2):
    score = cosine_similarity([embedding1], [embedding2])
    return round(float(score[0][0]), 2)

if __name__ == "__main__":
    from embedding_engine import generate_embedding

    text1 = "plants use sunlight to produce glucose and oxygen"
    text2 = "photosynthesis converts sunlight into chemical energy and glucose"

    emb1 = generate_embedding(text1)
    emb2 = generate_embedding(text2)

    score = calculate_similarity(emb1, emb2)
    print(f"\nSimilarity Score: {score}")