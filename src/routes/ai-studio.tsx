import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  Copy,
  Download,
  FileText,
  HelpCircle,
  LayoutList,
  Loader2,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";

export const Route = createFileRoute("/ai-studio")({
  head: () => ({
    meta: [
      { title: `AI Content Studio | ${site.name}` },
      {
        name: "description",
        content: "AI-powered course content generation for GUIDESOFT administrators.",
      },
    ],
  }),
  component: AIStudio,
});

const API_BASE = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  import.meta.env.PUBLIC_API_BASE_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

const CONTENT_TYPES = [
  { value: "course_outline", label: "Course Outline", icon: LayoutList },
  { value: "lesson_plan", label: "Lesson Plan", icon: BookOpen },
  { value: "quiz", label: "Quiz Questions", icon: HelpCircle },
  { value: "video_script", label: "Video Script", icon: Video },
  { value: "blog_post", label: "Blog Post", icon: FileText },
];

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

function AIStudio() {
  const [activeTab, setActiveTab] = useState<"generate" | "full-course" | "research">("generate");

  // Generate content state
  const [contentType, setContentType] = useState("course_outline");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [duration, setDuration] = useState(60);
  const [numItems, setNumItems] = useState(10);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Full course state
  const [courseTopic, setCourseTopic] = useState("");
  const [courseLevel, setCourseLevel] = useState("intermediate");
  const [courseResult, setCourseResult] = useState<Record<string, unknown> | null>(null);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);

  // Research state
  const [researchTopic, setResearchTopic] = useState("");
  const [researchResults, setResearchResults] = useState<Array<Record<string, string>>>([]);
  const [isResearching, setIsResearching] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setIsGenerating(true);
    setGeneratedContent("");
    try {
      const res = await fetch(`${API_BASE}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          topic: topic.trim(),
          level,
          duration_minutes: duration,
          num_items: numItems,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Generation failed" }));
        throw new Error(err.detail || "Generation failed");
      }
      const data = await res.json();
      setGeneratedContent(
        typeof data.content === "string" ? data.content : JSON.stringify(data.content, null, 2),
      );
      toast.success(`${contentType.replace(/_/g, " ")} generated successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFullCourse = async () => {
    if (!courseTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setIsGeneratingCourse(true);
    setCourseResult(null);
    try {
      const params = new URLSearchParams({ topic: courseTopic.trim(), level: courseLevel });
      const res = await fetch(`${API_BASE}/api/ai/generate-course?${params.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Generation failed" }));
        throw new Error(err.detail || "Generation failed");
      }
      const data = await res.json();
      setCourseResult(data);
      toast.success("Full course package generated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handleResearch = async () => {
    if (!researchTopic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    setIsResearching(true);
    setResearchResults([]);
    try {
      const params = new URLSearchParams({ topic: researchTopic.trim(), num_results: "5" });
      const res = await fetch(`${API_BASE}/api/ai/research?${params.toString()}`);
      if (!res.ok) throw new Error("Research failed");
      const data = await res.json();
      setResearchResults(data.results || []);
      toast.success(`Found ${data.results?.length || 0} results`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Research failed";
      toast.error(msg);
    } finally {
      setIsResearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const tabs = [
    { id: "generate" as const, label: "Generate Content", icon: Sparkles },
    { id: "full-course" as const, label: "Full Course", icon: Brain },
    { id: "research" as const, label: "Research", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      {/* Hero */}
      <section className="hero-surface border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <AnimatedSection direction="down">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  AI Content Studio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Generate course outlines, quizzes, video scripts & more with AI
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Generate Content Tab */}
        {activeTab === "generate" && (
          <AnimatedSection direction="up">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Form */}
              <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold text-foreground">Content Settings</h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Content Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_TYPES.map((ct) => (
                      <button
                        key={ct.value}
                        onClick={() => setContentType(ct.value)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                          contentType === ct.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <ct.icon className="h-3.5 w-3.5" />
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Topic *</label>
                  <Input
                    placeholder="e.g. React Hooks and Custom Hooks"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-surface/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Duration (min)</label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="bg-surface/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Items</label>
                    <Input
                      type="number"
                      value={numItems}
                      onChange={(e) => setNumItems(Number(e.target.value))}
                      className="bg-surface/50"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full gap-2"
                  variant="hero"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Content
                    </>
                  )}
                </Button>
              </div>

              {/* Result */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Generated Output
                  </h2>
                  {generatedContent && (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent)}
                      className="gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                  )}
                </div>
                {generatedContent ? (
                  <pre className="whitespace-pre-wrap rounded-xl bg-surface/50 border border-border p-4 text-xs text-foreground font-mono max-h-[600px] overflow-y-auto">
                    {generatedContent}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Generated content will appear here
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Configure settings and click Generate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Full Course Tab */}
        {activeTab === "full-course" && (
          <AnimatedSection direction="up">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">
                  Generate Complete Course Package
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate a full course outline, quiz questions, and video scripts in one go.
                </p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Course Topic *</label>
                    <Input
                      placeholder="e.g. Full Stack Web Development with React & Node.js"
                      value={courseTopic}
                      onChange={(e) => setCourseTopic(e.target.value)}
                      className="bg-surface/50"
                    />
                  </div>
                  <div className="w-40 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Level</label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleFullCourse}
                    disabled={isGeneratingCourse || !courseTopic.trim()}
                    variant="hero"
                    className="gap-2"
                  >
                    {isGeneratingCourse ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" /> Generate Course
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {courseResult && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {Object.entries(courseResult).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-border bg-background p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display text-sm font-bold text-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </h3>
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              typeof value === "string" ? value : JSON.stringify(value, null, 2),
                            )
                          }
                          className="gap-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs text-foreground/80 font-mono max-h-[400px] overflow-y-auto bg-surface/30 rounded-xl p-3">
                        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Research Tab */}
        {activeTab === "research" && (
          <AnimatedSection direction="up">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">
                  Research Course Topics
                </h2>
                <div className="flex gap-3">
                  <Input
                    placeholder="Search topics, curricula, syllabi..."
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                    className="bg-surface/50 flex-1"
                  />
                  <Button
                    onClick={handleResearch}
                    disabled={isResearching || !researchTopic.trim()}
                    variant="hero"
                    className="gap-2"
                  >
                    {isResearching ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" /> Research
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {researchResults.length > 0 && (
                <div className="space-y-3">
                  {researchResults.map((result, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px]">
                          {result.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{result.topic}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{result.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
