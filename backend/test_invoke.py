import json
from agents.graph import graph_app

initial_state = {
    "tool_id": "af-langgraph",
    "tool_name": "LangGraph",
    "category": "agent_frameworks.csv",
    "schema_fields": ["id", "name", "category", "subcategory", "vendor", "website", "documentation", "github_url", "logo", "description", "open_source", "license", "pricing_model", "release_year", "latest_version", "github_stars", "community_score", "enterprise_adoption_score", "enterprise_readiness_score", "latency_score", "performance_score", "scalability_score", "security_score", "governance_score", "observability_score", "cost_efficiency_score", "developer_experience_score", "deployment_complexity_score", "ecosystem_maturity_score", "integration_score", "maintenance_score", "benchmark_score", "overall_rating", "best_for", "supported_clouds", "gpu_requirement", "multi_modal_support", "rag_support", "agent_support", "fine_tuning_support", "api_available", "self_hosting_support", "vector_search_support", "streaming_support", "compliance", "sla_support", "pricing_notes", "enterprise_clients", "top_competitors", "tags", "ai_trust_score", "production_reliability_score", "last_updated"],
    "raw_search_context": "",
    "source_urls": [],
    "extracted_data": {},
    "validation_passed": False,
    "recall_count": 0,
    "final_status": ""
}

try:
    final_state = graph_app.invoke(initial_state)
    print("FINISHED")
    print(json.dumps(final_state, indent=2))
except Exception as e:
    print(f"EXCEPTION: {e}")
