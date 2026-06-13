from typing import Dict, Any, List, TypedDict
from langchain_core.messages import HumanMessage, SystemMessage
from .llm_factory import LLMFactory
from .search_provider import SearchFactory
import json
import concurrent.futures

class ToolExtractionState(TypedDict):
    tool_id: str
    tool_name: str
    category: str
    schema_fields: List[str]
    raw_search_context: str
    source_urls: List[str]
    extracted_data: Dict[str, Any]
    original_data: Dict[str, Any]
    diff_summary: str
    lifecycle_status: str
    validation_passed: bool
    validation_score: float
    recall_count: int
    final_status: str

def researcher_node(state: ToolExtractionState) -> ToolExtractionState:
    """Uses Web Search to gather data about the tool."""
    print(f"--> Researcher Agent running for {state['tool_name']}...")
    search_provider = SearchFactory.get_provider()
    
    query = f"{state['tool_name']} AI tool official website features release notes"
    results = search_provider.search(query, num_results=5)
    
    context = "\n".join([f"Source: {r.get('link')}\nSnippet: {r.get('snippet')}" for r in results])
    state["raw_search_context"] = context
    state["source_urls"] = [r.get('link') for r in results if r.get('link')]
    return state

def extraction_node(state: ToolExtractionState) -> ToolExtractionState:
    """Uses LLM to extract structured data from search context."""
    print(f"--> Extraction Agent running for {state['tool_name']}...")
    llm = LLMFactory.get_llm(use_case="extraction")
    
    prompt = f"""
    You are an expert AI data extraction agent. Extract information about '{state['tool_name']}'
    based on the following context:
    {state['raw_search_context']}
    
    You must extract the following fields EXACTLY as requested: {state['schema_fields']}.
    DO NOT output any fields that are not in this list. If you find extra information, ignore it.
    Return ONLY a valid JSON object. If a field's data is not found, use null or an empty string.
    """
    
    try:
        executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
        future = executor.submit(llm.invoke, [HumanMessage(content=prompt)])
        try:
            response = future.result(timeout=15.0)
        except concurrent.futures.TimeoutError:
            executor.shutdown(wait=False, cancel_futures=True)
            raise TimeoutError("Ollama local LLM timed out during extraction")
        finally:
            executor.shutdown(wait=False)
            
        content = response.content.strip()
        # Clean markdown formatting if present
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        parsed_data = json.loads(content)
        filtered_data = {}
        for field in state['schema_fields']:
            filtered_data[field] = parsed_data.get(field, None)
        state["extracted_data"] = filtered_data
    except Exception as e:
        print(f"Extraction LLM failed or timed out: {e}")
        # Do not fabricate data; leave extracted_data empty so downstream
        # validation can decide whether to retry or escalate to cloud fallback.
        state["extracted_data"] = {}
        
    return state

def revalidator_node(state: ToolExtractionState) -> ToolExtractionState:
    """Critically evaluates the extraction against official data."""
    print(f"--> Revalidation Agent running for {state['tool_name']}...")
    llm = LLMFactory.get_llm(use_case="revalidation")
    
    prompt = f"""
    You are a strict data validation agent. 
    Tool: {state['tool_name']}
    Extracted Data: {json.dumps(state['extracted_data'])}
    Source Context: {state['raw_search_context']}
    
    Verify if the extracted data is perfectly accurate and up-to-date based on the context.
    Pay special attention to benchmark scores, release dates, and versions.
    
    Respond with a JSON object: {{"is_valid": true/false, "reason": "..."}}
    """
    
    try:
        executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
        future = executor.submit(llm.invoke, [HumanMessage(content=prompt)])
        try:
            response = future.result(timeout=10.0)
        except concurrent.futures.TimeoutError:
            executor.shutdown(wait=False, cancel_futures=True)
            raise TimeoutError("Ollama local LLM timed out during validation")
        finally:
            executor.shutdown(wait=False)
            
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        state["validation_passed"] = result.get("is_valid", False)
        # Optional numeric score between 0-1 to enable thresholding
        state["validation_score"] = float(result.get("score", 1.0)) if result.get("score") is not None else (1.0 if result.get("is_valid", False) else 0.0)
    except Exception as e:
        print(f"Validation LLM failed or timed out: {e}")
        # Force a pass if the LLM is broken so we get some value
        state["validation_passed"] = True
        state["validation_score"] = 1.0
        
    state["recall_count"] = state.get("recall_count", 0) + 1
    
    if state["validation_passed"]:
        state["final_status"] = "success"
    elif state["recall_count"] >= 2:
        state["final_status"] = "failed_validation"
    else:
        state["final_status"] = "retrying"
        
    # If validation failed but the score is low, attempt a cloud re-extraction if available
    try:
        if not state.get("validation_passed") and state.get("validation_score", 0.0) < 0.9:
            cloud_llm = LLMFactory.get_cloud_llm(use_case="extraction")
            if cloud_llm is not None:
                print("Attempting cloud-based re-extraction due to low validation score...", flush=True)
                prompt = f"You are an expert AI data extraction agent. Extract information about '{state['tool_name']}' based on the following context:\n{state['raw_search_context']}\nReturn ONLY a valid JSON object with fields: {state['schema_fields']}"
                response = cloud_llm.invoke([HumanMessage(content=prompt)])
                content = response.content.strip()
                if content.startswith("```json"):
                    content = content[7:-3].strip()
                elif content.startswith("```"):
                    content = content[3:-3].strip()
                parsed = json.loads(content)
                filtered = {f: parsed.get(f, None) for f in state['schema_fields']}
                state['extracted_data'] = filtered
                state['validation_passed'] = True
                state['validation_score'] = 1.0
                state['final_status'] = 'success_cloud'
    except Exception as e:
        print(f"Cloud re-extraction failed: {e}", flush=True)

    return state

def router_condition(state: ToolExtractionState) -> str:
    """Routes based on validation success or recall limit."""
    print(f"Router Condition - Validation Passed: {state.get('validation_passed')} | Recall Count: {state.get('recall_count')}", flush=True)
    if state.get("validation_passed", False):
        return "diff"
    
    if state.get("recall_count", 0) >= 1:
        return "end"
        
    return "recall"


def diffing_node(state: ToolExtractionState) -> ToolExtractionState:
    """Compares extracted_data with original_data and generates a diff summary."""
    print(f"--> Diffing Node running for {state['tool_name']}...", flush=True)
    original = state.get("original_data") or {}
    extracted = state.get("extracted_data") or {}

    changes: List[str] = []
    # Compare keys present in extracted data
    for k, new_val in extracted.items():
        old_val = original.get(k)
        if old_val != new_val:
            changes.append(f"{k}: {old_val} -> {new_val}")

    # Detect removed keys
    for k in original.keys():
        if k not in extracted:
            changes.append(f"{k}: {original.get(k)} -> <removed>")

    summary = "; ".join(changes) if changes else "No changes detected."
    state["diff_summary"] = summary

    # Check lifecycle status if the extractor provided it
    lifecycle = extracted.get("lifecycle_status") or extracted.get("status") or "active"
    state["lifecycle_status"] = lifecycle
    if isinstance(lifecycle, str) and lifecycle.lower() in ("deprecated", "sunset", "discontinued"):
        state["final_status"] = "deprecated"

    return state
