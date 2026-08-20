"""Web scraping service for course data extraction.

Extracts course information from educational platforms for content research.
Uses httpx for async HTTP requests and basic HTML parsing.
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from typing import Any

import httpx


@dataclass
class ScrapedCourse:
    title: str
    description: str
    provider: str
    url: str
    duration: str = ""
    level: str = ""
    price: str = ""
    rating: float = 0.0
    enrolled: int = 0
    topics: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


async def scrape_url(url: str) -> dict[str, str]:
    """Fetch a URL and return basic page content."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return {"url": str(response.url), "content": response.text, "status": str(response.status_code)}


def extract_text_from_html(html: str) -> str:
    """Basic HTML to text extraction."""
    text = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:5000]  # Limit to first 5000 chars


async def research_course_topics(topic: str, num_results: int = 5) -> list[dict[str, str]]:
    """Search for course-related content on the web."""
    search_url = f"https://www.google.com/search?q={topic}+course+syllabus+curriculum"
    try:
        result = await scrape_url(search_url)
        text = extract_text_from_html(result["content"])
        return [{"topic": topic, "snippet": text[:500], "source": "web_search"}]
    except Exception as e:
        return [{"topic": topic, "snippet": f"Search unavailable: {str(e)}", "source": "error"}]
