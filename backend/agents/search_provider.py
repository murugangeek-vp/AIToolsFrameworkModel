from typing import List, Dict, Any
import os
from abc import ABC, abstractmethod
try:
    from langchain_community.utilities import DuckDuckGoSearchAPIWrapper
except Exception:
    DuckDuckGoSearchAPIWrapper = None
try:
    from duckduckgo_search import ddg
except Exception:
    ddg = None
try:
    from tavily import TavilyClient
except Exception:
    TavilyClient = None
class BaseSearchProvider(ABC):
    @abstractmethod
    def search(self, query: str, num_results: int = 3) -> List[Dict[str, Any]]:
        pass

class TavilyProvider(BaseSearchProvider):
    def __init__(self):
        api_key = os.environ.get("TAVILY_API_KEY")
        if TavilyClient is None:
            print("WARNING: tavily package not installed; TavilyProvider disabled.")
            self.client = None
            return

        if not api_key:
            print("WARNING: TAVILY_API_KEY is missing! Search will likely fail unless falling back.")
        self.client = TavilyClient(api_key=api_key) if api_key else None
        
    def search(self, query: str, num_results: int = 3) -> List[Dict[str, Any]]:
        if not self.client:
            return [{"link": "error", "snippet": "Tavily API key not found. Please set TAVILY_API_KEY."}]
            
        try:
            # include_raw_content=True enables deep web scraping of the target URLs
            response = self.client.search(query, search_depth="advanced", max_results=num_results, include_raw_content=True)
            results = []
            for r in response.get("results", []):
                content = r.get("raw_content") or r.get("content")
                results.append({
                    "link": r.get("url"),
                    "snippet": content
                })
            return results
        except Exception as e:
            print(f"Tavily search error: {e}")
            return []

class DuckDuckGoProvider(BaseSearchProvider):
    def __init__(self):
        # Prefer langchain wrapper if available; otherwise use duckduckgo_search.ddg
        if DuckDuckGoSearchAPIWrapper is not None:
            try:
                self.wrapper = DuckDuckGoSearchAPIWrapper()
            except Exception:
                self.wrapper = None
        else:
            self.wrapper = None
        
    def search(self, query: str, num_results: int = 3) -> List[Dict[str, Any]]:
        try:
            if self.wrapper is not None:
                results = self.wrapper.results(query, num_results)
                return results

            # Fallback to duckduckgo_search.ddg if available
            if ddg is not None:
                raw = ddg(query, max_results=num_results)
                out = []
                for r in raw:
                    out.append({
                        "link": r.get("href") or r.get("url"),
                        "snippet": r.get("body") or r.get("snippet") or r.get("title")
                    })
                return out

            raise RuntimeError("Could not import ddgs python package and no langchain wrapper available.")
        except Exception as e:
            print(f"DuckDuckGo search error: {e}")
            # Fallback mock data so the pipeline doesn't crash completely
            return [{
                "link": "https://example.com/mock", 
                "snippet": f"Mock data for {query}. Release year 2024. Version 1.0. This is a placeholder because the search provider failed."
            }]

class SearchFactory:
    @staticmethod
    def get_provider(provider_name: str = "tavily") -> BaseSearchProvider:
        if provider_name.lower() == "tavily":
            api_key = os.environ.get("TAVILY_API_KEY")
            if not api_key:
                print("SearchFactory: TAVILY_API_KEY missing. Automatically falling back to DuckDuckGo.")
                return DuckDuckGoProvider()
            return TavilyProvider()
        elif provider_name.lower() == "duckduckgo":
            return DuckDuckGoProvider()
        raise ValueError(f"Unknown search provider: {provider_name}")
