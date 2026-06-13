from langgraph.graph import StateGraph, END
from .discovery_nodes import (
    market_scanner_node,
    parser_node,
    deduplicator_node,
    trigger_node,
)


def build_discovery_graph():
    workflow = StateGraph(dict)

    workflow.add_node("scanner", market_scanner_node)
    workflow.add_node("parser", parser_node)
    workflow.add_node("deduper", deduplicator_node)
    workflow.add_node("trigger", trigger_node)

    workflow.set_entry_point("scanner")

    workflow.add_edge("scanner", "parser")
    workflow.add_edge("parser", "deduper")
    workflow.add_edge("deduper", "trigger")
    workflow.add_edge("trigger", END)

    return workflow.compile()


discovery_app = build_discovery_graph()
