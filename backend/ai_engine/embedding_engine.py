from sentence_transformers import SentenceTransformer

model = None

def load_model():
    global model
    if model is None:
        print("Loading embedding model...")
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded.")
    return model

def generate_embedding(text):
    m = load_model()
    embedding = m.encode(text)
    return embedding

if __name__ == "__main__":
    test = "plants use sunlight to produce glucose and oxygen"
    emb = generate_embedding(test)
    print(f"\nEmbedding generated successfully!")
    print(f"Vector size: {len(emb)}")