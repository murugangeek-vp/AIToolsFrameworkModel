import sys
import os
import json

# Setup sys path so we can import from agents
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.graph import graph_app

def test():
    # Mock an initial state exactly like a CSV row
    # Let's say we read this from public/data/cloud_ai_platforms.csv
    initial_state = {
        "tool_id": "test-cloud-1",
        "tool_name": "AWS Bedrock",
        "category": "cloud_ai_platforms.csv",
        "schema_fields": ["id", "name", "category", "pricing", "supported_models", "enterprise_features"],
        "raw_search_context": "",
        "source_urls": [],
        "extracted_data": {},
        "validation_passed": False,
        "recall_count": 0,
        "final_status": ""
    }
    
    print(f"Starting test for tool: {initial_state['tool_name']}")
    try:
        final_state = graph_app.invoke(initial_state)
        print("\n--- FINAL EXTRACTED DATA ---")
        print(json.dumps(final_state.get("extracted_data"), indent=2))
        print(f"\nValidation Passed: {final_state.get('validation_passed')}")
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test()
