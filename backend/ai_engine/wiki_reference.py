import wikipediaapi

def get_wikipedia_reference(topic):
    wiki = wikipediaapi.Wikipedia(
        language='en',
        extract_format=wikipediaapi.ExtractFormat.WIKI,
        user_agent='Vocentra/1.0'
    )
    
    page = wiki.page(topic)
    
    if page.exists():
        # Get first 500 characters only — simpler language
        reference = page.summary[:500]
        print(f"Reference fetched from Wikipedia for: {topic}")
        return reference
    else:
        print(f"No Wikipedia page found for: {topic}")
        return None

if __name__ == "__main__":
    ref = get_wikipedia_reference("photosynthesis")
    print("\nReference:")
    print(ref)