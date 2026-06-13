from langgraph.graph import StateGraph, END
from .agent_nodes import (
    ToolExtractionState,
    researcher_node,
    extraction_node,
    revalidator_node,
    router_condition,
    diffing_node
)

def build_extraction_graph():
    workflow = StateGraph(ToolExtractionState)
    
    workflow.add_node("researcher", researcher_node)
    workflow.add_node("extractor", extraction_node)
    workflow.add_node("revalidator", revalidator_node)
    workflow.add_node("diffing", diffing_node)
    
    workflow.set_entry_point("researcher")
    
    workflow.add_edge("researcher", "extractor")
    workflow.add_edge("extractor", "revalidator")
    
    workflow.add_conditional_edges(
        "revalidator",
        router_condition,
        {
            "diff": "diffing",
            "recall": "researcher" # Go back to research for more info if invalid
        }
    )

    # After diffing, go to final END
    workflow.add_edge("diffing", END)
    
    return workflow.compile()

graph_app = build_extraction_graph()
