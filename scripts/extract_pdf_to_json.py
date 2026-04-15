import sys
import subprocess
import time
import json
import uuid
import os

# Install requirements if missing
try:
    import fitz  # type: ignore
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF", "deep-translator"])
    import fitz  # type: ignore

try:
    from deep_translator import GoogleTranslator  # type: ignore
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "deep-translator"])
    from deep_translator import GoogleTranslator  # type: ignore

PDF_PATH = '/Users/sehopark/Desktop/Karen-Dic2/dictionary-_karen-to-english_unknown_source.pdf'
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), 'karen_extracted.json')

def extract_entries(pdf_path):
    print(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    entries = []
    
    current_karen: "str | None" = None
    current_english: str = ""
    
    for page_num in range(len(doc)):
        text = doc[page_num].get_text()
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Lines starting with '=' typically signify the Karen word in this PDF
            if line.startswith('='):
                if current_karen and current_english:
                    entries.append({"karen": current_karen, "english": current_english.strip()})
                current_karen = line[1:] # Remove '='
                current_english = ""
            else:
                if current_karen:
                    current_english = str(current_english) + " " + line

    if current_karen and current_english:
        entries.append({"karen": current_karen, "english": current_english.strip()})
        
    return entries

def translate_and_save(entries):
    translator = GoogleTranslator(source='en', target='ko')
    final_data = []
    total = len(entries)
    
    print(f"Found {total} word entries. Beginning translation...")
    
    for i, entry in enumerate(entries):
        karen_word = entry['karen']
        english_def = entry['english']
        
        try:
            # Translating the definition
            korean_def = translator.translate(english_def)
        except Exception as e:
            print(f"Translation error on word '{karen_word}': {e}")
            korean_def = english_def # fallback to English
            time.sleep(2) # Give API a break
            
        final_data.append({
            "id": str(uuid.uuid4()),
            "karen": karen_word,
            "pronunciation": "",
            "korean": korean_def,
            "partOfSpeech": "", # Can be updated if needed
            "level": 1,
            "exampleKaren": "",
            "exampleKorean": english_def # Keep original English def as a reference
        })
        
        # Save progress every 50 words
        if (i + 1) % 50 == 0:
            print(f"[{i + 1}/{total}] Translated so far. Saving progress...")
            with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
                json.dump(final_data, f, ensure_ascii=False, indent=2)
                
        # Delay to prevent IP blocking
        time.sleep(0.3)
        
    # Final save
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    print(f"All done! Translations saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    extracted = extract_entries(PDF_PATH)
    translate_and_save(extracted)
