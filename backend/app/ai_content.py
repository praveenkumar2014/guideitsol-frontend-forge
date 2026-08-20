"""AI-powered content generation for GUIDESOFT courses.

Uses OpenAI API (or compatible) to generate:
- Course outlines and syllabi
- Lesson plans with learning objectives
- Quiz questions and assessments
- Video course scripts
- Blog articles and marketing content

Requires OPENAI_API_KEY in environment.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Any

import httpx


OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


@dataclass
class ContentRequest:
    content_type: str  # "course_outline", "lesson_plan", "quiz", "video_script", "blog_post"
    topic: str
    level: str = "intermediate"
    duration_minutes: int = 60
    num_items: int = 10
    extra_context: str = ""


@dataclass
class GeneratedContent:
    content_type: str
    topic: str
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)


PROMPTS = {
    "course_outline": """Create a comprehensive course outline for: {topic}
Level: {level}
Duration: {duration_minutes} minutes total
Include: module titles, learning objectives, prerequisites, tools covered.
Return as structured JSON with keys: title, description, modules (array of {{title, objectives[], duration_min}}).""",

    "lesson_plan": """Create a detailed lesson plan for teaching: {topic}
Level: {level}
Duration: {duration_minutes} minutes
Include: learning objectives, agenda, key concepts, hands-on exercises, assessment criteria.
Return as structured JSON with keys: title, objectives[], agenda[], concepts[], exercises[], assessment[].""",

    "quiz": """Generate {num_items} quiz questions for: {topic}
Level: {level}
Mix of multiple choice, true/false, and short answer.
Return as JSON array of {{type, question, options[], correct_answer, explanation}}.""",

    "video_script": """Write a video course script for: {topic}
Level: {level}
Target duration: {duration_minutes} minutes
Include: intro hook, section transitions, speaker notes, on-screen text suggestions, outro.
Return as JSON with keys: title, intro, sections[], outro, total_duration_estimate.""",

    "blog_post": """Write an SEO-optimized blog post about: {topic}
Target: {level} learners
Include: engaging title, meta description, headings (H2/H3), key takeaways, CTA.
Return as JSON with keys: title, meta_description, content (markdown), tags[].""",
}


async def _call_openai(prompt: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        return json.dumps({"error": "OPENAI_API_KEY not configured. Set it in backend/.env"})

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{OPENAI_API_BASE}/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": OPENAI_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 4000,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def generate_content(request: ContentRequest) -> GeneratedContent:
    template = PROMPTS.get(request.content_type)
    if not template:
        raise ValueError(f"Unknown content type: {request.content_type}")

    prompt = template.format(
        topic=request.topic,
        level=request.level,
        duration_minutes=request.duration_minutes,
        num_items=request.num_items,
    )

    raw_content = await _call_openai(prompt)

    return GeneratedContent(
        content_type=request.content_type,
        topic=request.topic,
        content=raw_content,
        metadata={
            "model": OPENAI_MODEL,
            "level": request.level,
            "duration_minutes": request.duration_minutes,
        },
    )


# Batch generation for course creation workflow
async def generate_full_course(topic: str, level: str = "intermediate") -> dict[str, Any]:
    """Generate a complete course package: outline + lessons + quizzes + video scripts."""
    outline_req = ContentRequest(content_type="course_outline", topic=topic, level=level)
    outline = await generate_content(outline_req)

    results = {
        "outline": json.loads(outline.content) if _is_json(outline.content) else outline.content,
        "lessons": [],
        "quizzes": [],
        "video_scripts": [],
    }

    # Generate quiz for the topic
    quiz_req = ContentRequest(content_type="quiz", topic=topic, level=level, num_items=15)
    quiz = await generate_content(quiz_req)
    results["quizzes"] = json.loads(quiz.content) if _is_json(quiz.content) else quiz.content

    # Generate video script
    script_req = ContentRequest(content_type="video_script", topic=topic, level=level, duration_minutes=45)
    script = await generate_content(script_req)
    results["video_scripts"] = json.loads(script.content) if _is_json(script.content) else script.content

    return results


def _is_json(text: str) -> bool:
    try:
        json.loads(text)
        return True
    except (json.JSONDecodeError, TypeError):
        return False
