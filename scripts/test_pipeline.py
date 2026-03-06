import requests
import time
import sys
import os

BASE_URL = "http://127.0.0.1:8000"
VIDEO_PATH = "test_video.mp4" # Ensure this exists in the jugraj folder
TOPIC = "CS224N Lecture AI"

def test_pipeline():
    print(f"Submitting {VIDEO_PATH} for analysis...")
    
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: {VIDEO_PATH} not found.")
        return

    with open(VIDEO_PATH, "rb") as f:
        files = {"file": (VIDEO_PATH, f, "video/mp4")}
        data = {"reference_answer": TOPIC}
        response = requests.post(f"{BASE_URL}/upload-video", files=files, data=data)

    if response.status_code != 200:
        print(f"Failed to upload: {response.text}")
        return

    job = response.json()
    job_id = job["job_id"]
    print(f"Job started: {job_id}")

    # Poll status
    while True:
        status_res = requests.get(f"{BASE_URL}/status/{job_id}")
        status_data = status_res.json()
        status = status_data["status"]
        print(f"Status: {status}")

        if status == "completed":
            break
        if status == "failed":
            print("Job failed.")
            return
        
        time.sleep(3)

    # Get results
    results_res = requests.get(f"{BASE_URL}/results/{job_id}")
    results = results_res.json()
    print("--- RESULTS ---")
    print(f"Transcript Snippet: {results['transcript'][:100]}...")
    print(f"Similarity Score: {results['similarity_score']}")
    print(f"Captions Generated: {len(results['captions'])}")
    print("Verification Successful!")

if __name__ == "__main__":
    test_pipeline()
