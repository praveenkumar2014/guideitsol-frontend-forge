import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Search, Tag, User } from "lucide-react";

import { AnimatedSection } from "@/components/animated-section";
import { StaggerContainer, staggerItem } from "@/components/stagger-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { site } from "@/data/site";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `Blog & Articles | ${site.name}` },
      { name: "description", content: "Career tips, tech tutorials, industry insights, and student success stories from GUIDESOFT IT Solutions." },
    ],
  }),
  component: BlogPage,
});

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const CATEGORIES = ["All", "Career Tips", "Tech Tutorials", "Industry Insights", "Student Stories"];

const articles: Article[] = [
  {
    slug: "top-10-interview-questions-2026",
    title: "Top 10 Technical Interview Questions You Must Prepare in 2026",
    excerpt: "System design, DSA, and behavioral questions that FAANG and top Indian startups are asking this hiring season.",
    author: "Aarav Menon",
    date: "Aug 15, 2026",
    readTime: "8 min read",
    category: "Career Tips",
    image: "",
  },
  {
    slug: "react-server-components-guide",
    title: "React Server Components: A Practical Guide for Backend-Frontend Teams",
    excerpt: "Understanding RSC, streaming SSR, and how to architect full-stack apps with TanStack Start and Next.js.",
    author: "Priya Sharma",
    date: "Aug 10, 2026",
    readTime: "12 min read",
    category: "Tech Tutorials",
    image: "",
  },
  {
    slug: "data-science-career-roadmap",
    title: "Data Science Career Roadmap: From Beginner to Machine Learning Engineer",
    excerpt: "A structured 6-month plan covering Python, SQL, ML algorithms, and portfolio projects that get you hired.",
    author: "Rohan Verma",
    date: "Aug 5, 2026",
    readTime: "10 min read",
    category: "Career Tips",
    image: "",
  },
  {
    slug: "aws-devops-real-world",
    title: "AWS DevOps in the Real World: What Bootcamps Don't Teach You",
    excerpt: "Lessons from deploying production workloads — CI/CD pipelines, cost optimization, and incident response.",
    author: "Aarav Menon",
    date: "Jul 28, 2026",
    readTime: "15 min read",
    category: "Industry Insights",
    image: "",
  },
  {
    slug: "student-story-placement-amazon",
    title: "How I Landed a Role at Amazon After 6 Months of GUIDESOFT Training",
    excerpt: "From mechanical engineering to software development — a student's journey through Java Full Stack and placement preparation.",
    author: "Vikram Reddy",
    date: "Jul 20, 2026",
    readTime: "7 min read",
    category: "Student Stories",
    image: "",
  },
  {
    slug: "python-automation-scripts",
    title: "10 Python Automation Scripts Every Developer Should Know",
    excerpt: "File processing, web scraping, email automation, and data pipeline scripts that save hours of manual work.",
    author: "Meera Krishnan",
    date: "Jul 15, 2026",
    readTime: "9 min read",
    category: "Tech Tutorials",
    image: "",
  },
  {
    slug: "hiring-trends-2026",
    title: "Tech Hiring Trends 2026: What Skills Are Employers Actually Looking For?",
    excerpt: "Analysis of 500+ job postings reveals the most in-demand skills, certifications, and portfolio expectations.",
    author: "Rohan Verma",
    date: "Jul 10, 2026",
    readTime: "11 min read",
    category: "Industry Insights",
    image: "",
  },
  {
    slug: "first-job-web-developer",
    title: "From Zero to First Job: My Web Development Journey at GUIDESOFT",
    excerpt: "A non-CS graduate shares how structured learning, real projects, and mock interviews changed their career trajectory.",
    author: "Sneha Patel",
    date: "Jul 5, 2026",
    readTime: "6 min read",
    category: "Student Stories",
    image: "",
  },
  {
    slug: "docker-kubernetes-production",
    title: "Docker & Kubernetes in Production: Lessons from 50+ Deployments",
    excerpt: "Container orchestration patterns, health checks, resource limits, and debugging strategies that actually work.",
    author: "Aarav Menon",
    date: "Jun 28, 2026",
    readTime: "14 min read",
    category: "Tech Tutorials",
    image: "",
  },
];

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface/30 pb-20">
      {/* Hero */}
      <section className="hero-surface border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <AnimatedSection direction="down">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Blog & Articles</h1>
                <p className="text-sm text-muted-foreground">Career tips, tutorials, and industry insights</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-surface/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Articles Grid */}
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {filteredArticles.map((article) => (
            <motion.article
              key={article.slug}
              variants={staggerItem}
              className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary/10 to-cyan-500/10 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-primary/30" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                    {article.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {article.readTime}
                  </span>
                </div>
                <h2 className="font-display text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{article.author}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{article.date}</span>
                </div>
                <Link
                  to="/blog/$slug"
                  params={{ slug: article.slug }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
                >
                  Read more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </StaggerContainer>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
