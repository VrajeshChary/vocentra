from moviepy import VideoFileClip
import os

def extract_audio(video_path, output_path="audio/audio.wav"):
    os.makedirs("audio", exist_ok=True)
    
    video = VideoFileClip(video_path)
    
    # Check if video has audio
    if video.audio is None:
        print("No audio track found in video.")
        # Create empty audio file as signal
        open(output_path, 'w').close()
        video.close()
        return False
    
    video.audio.write_audiofile(output_path)
    print(f"Audio extracted successfully → {output_path}")
    video.close()
    return True