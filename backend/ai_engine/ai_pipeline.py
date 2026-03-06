from video_processor import extract_audio
from transcribe import transcribe_audio
from text_cleaner import clean_text
from embedding_engine import generate_embedding
from semantic_analysis import calculate_similarity
from concept_extractor import calculate_concept_score
from evaluation import evaluate, keyword_density_score
from reference_engine import get_best_reference
from frame_extractor import extract_frames
from visual_analyzer import analyze_frames, generate_visual_transcript


def run_analysis(video_path, user_topic):

    print("\n=== VOCENTRA ANALYSIS ===\n")

    # STEP 1
    print("Step 1: Extracting audio...")
    extract_audio(video_path)

    # STEP 2
    print("Step 2: Converting speech to text...")
    transcript = transcribe_audio()

    # STEP 3
    print("Step 3: Extracting video frames...")
    extract_frames(video_path)

    # STEP 4
    print("Step 4: Analysing visual context...")
    visual_context, visual_scores, visual_relevance = analyze_frames(
    topic=user_topic,
    transcript=transcript
)

    # STEP 5
    print("Step 5: Building combined context...")

    if transcript is None:
        print("No audio — generating visual transcript...")
        visual_transcript = generate_visual_transcript(topic=user_topic)

        combined_context = visual_transcript
        transcript_display = visual_transcript

    else:

        cleaned = clean_text(transcript)

        final_transcript = cleaned + " " + visual_context

        combined_context = final_transcript
        transcript_display = final_transcript

    # STEP 6
    print("Step 6: Finding best reference...")
    reference, ref_source = get_best_reference(user_topic, transcript_display)

    # STEP 7
    print("Step 7: Calculating semantic similarity...")
    emb1 = generate_embedding(combined_context)
    emb2 = generate_embedding(reference)

    similarity = calculate_similarity(emb1, emb2)

    # STEP 8
    print("Step 8: Matching concepts...")
    concept_score = calculate_concept_score(reference, combined_context)

    # STEP 9
    print("Step 9: Keyword density scoring...")
    keyword_score = keyword_density_score(combined_context, reference)

    # STEP 10
    print("Step 10: Generating final score...")
    final_score, grade = evaluate(
    similarity,
    concept_score,
    keyword_score,
    visual_relevance
)

    # RESULT
    print("\n========== VOCENTRA RESULT ==========")

    print(f"Video             : {video_path}")
    print(f"Topic             : {user_topic}")
    print(f"Reference From    : {ref_source}")
    print(f"Visual Context    : {visual_context}")
    print(f"Visual Relevance  : {visual_relevance}")

    print(f"Transcript        : {transcript_display[:200]}...")

    print(f"Similarity        : {similarity}")
    print(f"Concept Score     : {concept_score}")
    print(f"Keyword Score     : {keyword_score}")

    print(f"Final Score       : {final_score}")
    print(f"Grade             : {grade}")

    print("======================================")

    # TEACHER FEEDBACK
    print("\n--- TEACHER FEEDBACK (press Enter to skip) ---")

    actual = input(
        "Enter actual grade (Excellent/Good/Partial/Poor) or press Enter to skip: "
    ).strip()

    if actual in ["Excellent", "Good", "Partial", "Poor"]:

        from training_model import record_feedback

        new_weights = record_feedback(
            similarity,
            concept_score,
            keyword_score,
            grade,
            actual
        )

        print(f"Model updated with new weights: {new_weights}")

    else:
        print("No feedback recorded.")


if __name__ == "__main__":

    print("=== VOCENTRA - Video Semantic Evaluator ===\n")

    video = input("Enter video filename (from uploads folder): ").strip()

    topic = input("Enter topic to evaluate against: ").strip()

    run_analysis(f"uploads/{video}", topic)