import csv
import os

data_dir = r"f:\AI\AIToolsFrameworkModel\public\data"

data_to_inject = {
    "llm_models.csv": [
        {"id": "llm-o1", "name": "OpenAI o1", "category": "LLM Models", "subcategory": "Reasoning LLM", "vendor": "OpenAI", "description": "OpenAI's flagship reasoning model.", "open_source": "false", "pricing_model": "Pay-per-use", "release_year": "2024", "overall_rating": "95"},
        {"id": "llm-o3mini", "name": "OpenAI o3-mini", "category": "LLM Models", "subcategory": "Reasoning LLM", "vendor": "OpenAI", "description": "Fast and cost-effective reasoning model.", "open_source": "false", "pricing_model": "Pay-per-use", "release_year": "2025", "overall_rating": "94"},
        {"id": "llm-deepseek-r1", "name": "DeepSeek R1", "category": "LLM Models", "subcategory": "Open Source Reasoning", "vendor": "DeepSeek", "description": "Open-weights reasoning model matching o1 performance.", "open_source": "true", "pricing_model": "Free", "release_year": "2025", "overall_rating": "96"},
        {"id": "llm-qwen25-max", "name": "Qwen 2.5 Max", "category": "LLM Models", "subcategory": "Frontier LLM", "vendor": "Alibaba Cloud", "description": "Alibaba's largest and most capable model.", "open_source": "false", "pricing_model": "Pay-per-use", "release_year": "2025", "overall_rating": "90"}
    ],
    "embedding_models.csv": [
        {"id": "emb-text3large", "name": "text-embedding-3-large", "category": "Embedding Models", "subcategory": "Proprietary", "vendor": "OpenAI", "description": "Top tier proprietary embeddings."},
        {"id": "emb-nomic", "name": "Nomic Embed Text", "category": "Embedding Models", "subcategory": "Open Source", "vendor": "Nomic AI", "description": "Industry leading open-source local embeddings."},
        {"id": "emb-bgem3", "name": "BGE-M3", "category": "Embedding Models", "subcategory": "Open Source", "vendor": "BAAI", "description": "Top multilingual open source embedding model."},
        {"id": "emb-voyage", "name": "Voyage AI", "category": "Embedding Models", "subcategory": "Proprietary", "vendor": "Voyage", "description": "Domain-specific advanced retrieval embeddings."}
    ],
    "multimodal_models.csv": [
        {"id": "multi-llama32-vision", "name": "Llama 3.2 Vision", "category": "Multimodal Models", "subcategory": "Open Source", "vendor": "Meta AI", "description": "Native multimodal understanding."},
        {"id": "multi-pixtral", "name": "Pixtral Large", "category": "Multimodal Models", "subcategory": "Open Source", "vendor": "Mistral AI", "description": "Mistral's large vision-language model."},
        {"id": "multi-qwen25-vl", "name": "Qwen2.5-VL", "category": "Multimodal Models", "subcategory": "Open Source", "vendor": "Alibaba Cloud", "description": "Exceptional open-source vision model for UI and documents."}
    ],
    "ai_ide_tools.csv": [
        {"id": "ide-cursor", "name": "Cursor", "category": "AI IDE", "subcategory": "Code Editor", "vendor": "Anysphere", "description": "The leading AI-first code editor."},
        {"id": "ide-windsurf", "name": "Windsurf", "category": "AI IDE", "subcategory": "Code Editor", "vendor": "Codeium", "description": "Agentic AI IDE with flow state capabilities."},
        {"id": "ide-copilot-workspace", "name": "Copilot Workspace", "category": "AI IDE", "subcategory": "Cloud IDE", "vendor": "GitHub", "description": "GitHub's task-centric AI developer environment."}
    ],
    "inference_engines.csv": [
        {"id": "inf-vllm", "name": "vLLM", "category": "Inference Engines", "subcategory": "High-Throughput", "vendor": "vLLM Team", "description": "High-throughput and memory-efficient LLM serving."},
        {"id": "inf-sglang", "name": "SGLang", "category": "Inference Engines", "subcategory": "High-Throughput", "vendor": "LMSYS", "description": "Fast serving engine optimized for complex structured generation."}
    ]
}

def inject_data():
    for filename, rows in data_to_inject.items():
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            print(f"Skipping {filename}, does not exist.")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader)
            
        with open(filepath, 'a', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            for row_dict in rows:
                new_row = []
                for col in header:
                    val = row_dict.get(col, "")
                    if not val and "score" in col:
                        val = "80"  # default score
                    elif not val and col == "github_stars":
                        val = "0"
                    elif not val and col in ["open_source", "multi_modal_support"]:
                        val = "false"
                    new_row.append(val)
                writer.writerow(new_row)
        print(f"Injected {len(rows)} records into {filename}.")

if __name__ == "__main__":
    inject_data()
