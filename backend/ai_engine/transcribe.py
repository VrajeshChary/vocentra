import whisper
import os

model = None

def load_model():
    global model
    if model is None:
        print("Loading Whisper model...")
        model = whisper.load_model("base")
    return model


def transcribe_audio(audio_path="audio/audio.wav"):

    if not os.path.exists(audio_path):
        print("No audio detected")
        return None

    m = load_model()

    print("Transcribing audio...")
    result = m.transcribe(audio_path)

    transcript = result["text"]

    print("\nTranscript:")
    print(transcript)

    return transcript