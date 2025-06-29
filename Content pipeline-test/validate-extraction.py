#!/usr/bin/env python3
"""
Validates extraction improvements, especially fragment detection
"""

import json
import sys
from pathlib import Path

def validate_extraction(json_file):
    """Validate extracted JSON meets improvement criteria"""
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"🔍 Validating extraction: {json_file}")
    print("=" * 50)
    
    # Get questions
    questions = data.get('content', {}).get('teil2', {}).get('questions', [])
    total_questions = len(questions)
    
    print(f"Total questions extracted: {total_questions}")
    
    # Check for specific fragments that should be expanded
    fragment_tests = [
        ("FFsp", "Found FFsp as separate question"),
        ("Fibrinogen", "Found Fibrinogen as separate question"),
        ("Prothromplex", "Found Prothromplex as separate question"),
        ("sichere Todeszeichen", "Found sichere Todeszeichen"),
        ("Adhärenz", "Found Adhärenz question")
    ]
    
    found_fragments = []
    missing_fragments = []
    
    # Search for each fragment
    for fragment, description in fragment_tests:
        found = False
        for q in questions:
            question_text = q.get('question', '')
            if fragment.lower() in question_text.lower():
                found = True
                found_fragments.append(fragment)
                break
        
        if not found:
            missing_fragments.append(fragment)
    
    # Validation results
    print("\n✅ Found fragments:")
    for fragment in found_fragments:
        print(f"  - {fragment}")
    
    if missing_fragments:
        print("\n❌ Missing fragments:")
        for fragment in missing_fragments:
            print(f"  - {fragment}")
    
    # Check extraction metadata
    review_metadata = data.get('review_metadata', {})
    mentioned_topics = review_metadata.get('mentioned_topics', 0)
    extracted_questions = review_metadata.get('extracted_questions', 0)
    validation_status = review_metadata.get('validation_status', 'UNKNOWN')
    
    print(f"\n📊 Extraction Statistics:")
    print(f"  - Topics mentioned: {mentioned_topics}")
    print(f"  - Questions extracted: {extracted_questions}")
    print(f"  - Validation status: {validation_status}")
    
    # Success criteria
    success = True
    
    if total_questions < 35:
        print(f"\n⚠️  WARNING: Expected 35+ questions, found {total_questions}")
        success = False
    
    if len(missing_fragments) > 0:
        print(f"\n⚠️  WARNING: {len(missing_fragments)} fragments not properly extracted")
        success = False
    
    if validation_status != "VERIFIED":
        print(f"\n⚠️  WARNING: Validation status is not VERIFIED")
        success = False
    
    if extracted_questions < mentioned_topics:
        print(f"\n⚠️  WARNING: Extracted questions ({extracted_questions}) < mentioned topics ({mentioned_topics})")
        success = False
    
    # Final verdict
    print("\n" + "=" * 50)
    if success:
        print("✅ EXTRACTION VALIDATION: PASSED")
        print("All fragments detected and extraction complete!")
    else:
        print("❌ EXTRACTION VALIDATION: FAILED")
        print("See warnings above for details.")
    
    return success

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate-extraction.py <extracted_json_file>")
        sys.exit(1)
    
    json_file = Path(sys.argv[1])
    if not json_file.exists():
        print(f"Error: File {json_file} not found")
        sys.exit(1)
    
    success = validate_extraction(json_file)
    sys.exit(0 if success else 1)