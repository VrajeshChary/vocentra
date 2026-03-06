import json
import os
import numpy as np

TRAINING_DATA_FILE = "training_data.json"

# Default weights
DEFAULT_WEIGHTS = {
    "similarity": 0.50,
    "concept": 0.25,
    "keyword": 0.25
}

def load_training_data():
    if os.path.exists(TRAINING_DATA_FILE):
        with open(TRAINING_DATA_FILE, "r") as f:
            return json.load(f)
    return {"samples": [], "weights": DEFAULT_WEIGHTS}

def save_training_data(data):
    with open(TRAINING_DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)
    print("Training data saved.")

def record_feedback(similarity, concept_score, keyword_score, 
                   predicted_grade, actual_grade):
    data = load_training_data()
    
    sample = {
        "similarity": similarity,
        "concept_score": concept_score,
        "keyword_score": keyword_score,
        "predicted_grade": predicted_grade,
        "actual_grade": actual_grade
    }
    
    data["samples"].append(sample)
    print(f"Feedback recorded: predicted={predicted_grade} actual={actual_grade}")
    
    # Retrain if enough samples
    if len(data["samples"]) >= 3:
        data["weights"] = retrain(data["samples"])
    
    save_training_data(data)
    return data["weights"]

def retrain(samples):
    print("\nRetraining model with feedback...")
    
    grade_to_score = {
        "Excellent": 1.0,
        "Good": 0.75,
        "Partial": 0.50,
        "Poor": 0.25
    }
    
    similarities = []
    concepts = []
    keywords = []
    actuals = []
    
    for s in samples:
        similarities.append(s["similarity"])
        concepts.append(s["concept_score"])
        keywords.append(s["keyword_score"])
        actuals.append(grade_to_score.get(s["actual_grade"], 0.5))
    
    similarities = np.array(similarities)
    concepts = np.array(concepts)
    keywords = np.array(keywords)
    actuals = np.array(actuals)
    
    def safe_corr(a, b):
        if np.std(a) == 0 or np.std(b) == 0:
            return 0.33
        corr = np.corrcoef(a, b)[0, 1]
        return max(0.1, corr)  # minimum 0.1 to avoid collapse
    
    sim_corr = safe_corr(similarities, actuals)
    con_corr = safe_corr(concepts, actuals)
    key_corr = safe_corr(keywords, actuals)
    
    total = sim_corr + con_corr + key_corr
    
    weights = {
        "similarity": round(max(0.30, sim_corr / total), 3),
        "concept": round(max(0.20, con_corr / total), 3),
        "keyword": round(max(0.20, key_corr / total), 3)
    }
    
    # Normalize to sum to 1
    total_w = sum(weights.values())
    weights = {k: round(v / total_w, 3) for k, v in weights.items()}
    
    print(f"New weights learned: {weights}")
    return weights
    
    
    # Calculate how each feature correlates with actual grade
    similarities = []
    concepts = []
    keywords = []
    actuals = []
    
    for s in samples:
        similarities.append(s["similarity"])
        concepts.append(s["concept_score"])
        keywords.append(s["keyword_score"])
        actuals.append(grade_to_score.get(s["actual_grade"], 0.5))
    
    similarities = np.array(similarities)
    concepts = np.array(concepts)
    keywords = np.array(keywords)
    actuals = np.array(actuals)
    
    # Calculate correlation of each feature with actual grade
    def safe_corr(a, b):
        if np.std(a) == 0 or np.std(b) == 0:
            return 0.33
        return max(0, np.corrcoef(a, b)[0, 1])
    
    sim_corr = safe_corr(similarities, actuals)
    con_corr = safe_corr(concepts, actuals)
    key_corr = safe_corr(keywords, actuals)
    
    total = sim_corr + con_corr + key_corr
    
    if total == 0:
        weights = DEFAULT_WEIGHTS
    else:
        weights = {
            "similarity": round(sim_corr / total, 3),
            "concept": round(con_corr / total, 3),
            "keyword": round(key_corr / total, 3)
        }
    
    print(f"New weights learned: {weights}")
    return weights

def get_current_weights():
    data = load_training_data()
    return data.get("weights", DEFAULT_WEIGHTS)

def show_training_status():
    data = load_training_data()
    samples = data.get("samples", [])
    weights = data.get("weights", DEFAULT_WEIGHTS)
    
    print(f"\n=== TRAINING STATUS ===")
    print(f"Total feedback samples : {len(samples)}")
    print(f"Current weights        : {weights}")
    print(f"=======================\n")

if __name__ == "__main__":
    show_training_status()