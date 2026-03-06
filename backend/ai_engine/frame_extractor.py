import cv2
import os
import shutil

def extract_frames(video_path, output_folder="frames", interval=30):
    # Clear old frames first
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)
    os.makedirs(output_folder)
    
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    saved_count = 0
    
    print(f"Extracting frames from {video_path}...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % interval == 0:
            frame_path = f"{output_folder}/frame_{saved_count}.jpg"
            cv2.imwrite(frame_path, frame)
            saved_count += 1
        
        frame_count += 1
    
    cap.release()
    print(f"Extracted {saved_count} frames → saved in {output_folder}/")
    return output_folder

if __name__ == "__main__":
    extract_frames("uploads/test_video.mp4")