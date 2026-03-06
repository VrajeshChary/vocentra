from backend.utils.logger import logger

class ScriptBuilder:
    @staticmethod
    def build(transcript: str, frame_results: list) -> dict:
        """
        Builds a high-fidelity Semantic Video Script structure that can be 
        interpreted by video generation models (e.g. Veo-3).
        """
        logger.info("Generating High-Fidelity Semantic Video Script...")
        
        # 1. Determine aggregate scene context (simplification)
        scene_pool = [fr["captions"] for fr in frame_results]
        common_scene = "classroom/studio" if "explain" in transcript.lower() else "general setting"
        
        # 2. Extract unique objects and actions
        all_objects = list(set([o for fr in frame_results for o in fr["objects"]]))
        all_actions = list(set([a for fr in frame_results for a in fr["actions"]]))
        
        # 3. Construct detailed timeline
        timeline = []
        for i, res in enumerate(frame_results):
            # Calculate timestamp (Phase 6: 1 frame/2s)
            from configs.config import settings
            seconds = i * settings.FRAME_EXTRACTION_INTERVAL_SEC
            timestamp = f"{int(seconds // 60):02d}:{int(seconds % 60):02d}"

            
            # Context-aware speech segment (windowed)
            word_count = len(transcript.split())
            words_per_frame = max(1, word_count // len(frame_results))
            speech_segment = " ".join(transcript.split()[i*words_per_frame : (i+1)*words_per_frame])

            timeline.append({
                "timestamp": timestamp,
                "speech": speech_segment,
                "objects": res["objects"],
                "actions": res["actions"],
                "visual_text": res["ocr"],
                "visual_context": res["captions"]
            })

        return {
            "metadata": {
                "source": "Vocentra Multimodal Engine",
                "version": "2.0-scalable"
            },
            "scene": common_scene,
            "characters": ["presenter"],
            "global_context": {
                "total_objects": all_objects,
                "primary_actions": all_actions
            },
            "timeline": timeline
        }

