export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
}

export const CATEGORIES = [
  "All",
  "Career Tips",
  "Tech Tutorials",
  "Industry Insights",
  "Student Stories",
] as const;

export const articles: Article[] = [
  {
    slug: "top-10-interview-questions-2026",
    title: "Top 10 Technical Interview Questions You Must Prepare in 2026",
    excerpt:
      "System design, DSA, and behavioral questions that FAANG and top Indian startups are asking this hiring season.",
    author: "Aarav Menon",
    date: "Aug 15, 2026",
    readTime: "8 min read",
    category: "Career Tips",
    image: "",
    content: [
      "Technical interviews in 2026 have evolved beyond basic algorithm questions. Companies now test system thinking, real-world trade-offs, and your ability to reason about production systems under pressure.",
      "System Design remains the single most important filter for mid-to-senior roles. Interviewers expect you to design a URL shortener, a chat system, or a rate limiter — not just draw boxes, but discuss CAP theorem, caching layers, database sharding, and graceful degradation.",
      "Data Structures & Algorithms still dominate the first round. Focus on graph traversal (BFS/DFS), dynamic programming (knapsack variants), and tree manipulation. LeetCode Medium problems in the top 150 list cover 80% of what you will see.",
      "Behavioral questions are no longer optional. Use the STAR method (Situation, Task, Action, Result) to structure answers. Prepare stories about conflict resolution, debugging under pressure, and taking ownership of failures.",
      "For backend roles, know your SQL joins cold. Practice writing optimized queries with indexes, EXPLAIN plans, and understand the difference between read replicas and connection pooling.",
      "For frontend roles, be ready to build a small component live. Know React hooks deeply — useEffect cleanup, useMemo vs useCallback, and how to avoid unnecessary re-renders with profiling tools.",
      "Cloud-native questions are rising. Know the basics of Docker (multi-stage builds, layer caching), Kubernetes (pods, services, ingress), and CI/CD pipelines (GitHub Actions, Jenkins).",
      "Finally, practice mock interviews with a timer. The pressure of a 45-minute window changes how you think. Record yourself, review the recording, and iterate on your communication clarity.",
    ],
  },
  {
    slug: "react-server-components-guide",
    title: "React Server Components: A Practical Guide for Backend-Frontend Teams",
    excerpt:
      "Understanding RSC, streaming SSR, and how to architect full-stack apps with TanStack Start and Next.js.",
    author: "Priya Sharma",
    date: "Aug 10, 2026",
    readTime: "12 min read",
    category: "Tech Tutorials",
    image: "",
    content: [
      "React Server Components (RSC) fundamentally change how we think about the React rendering model. Instead of shipping all components to the client, RSC lets you run components exclusively on the server, reducing bundle size and improving time-to-interactive.",
      "The core idea is simple: components that fetch data, access databases, or use Node-only APIs can run on the server. Only components that need interactivity (click handlers, state, effects) ship to the client.",
      "In TanStack Start, this is the default. Every route component is a server component unless you explicitly mark it with 'use client'. This means your course listing page, blog index, and static content never ship JavaScript to the browser.",
      "Streaming SSR pairs with RSC to progressively render your page. The shell renders first, then server component placeholders are replaced with actual content as data resolves. The user sees content faster, even if the database query takes 500ms.",
      "The mental model shift for backend developers is minimal: your server component is basically a template function that returns JSX instead of HTML. You call your ORM, format the data, and return the markup.",
      "For frontend developers, the key lesson is: push state as close to the interactive leaf as possible. A product card that is purely display — use a server component. A card with a 'like' button — the button itself needs 'use client', but the card wrapper can stay on the server.",
      "Error boundaries work at the server component level too. Wrap data-fetching server components in error boundaries to catch database failures gracefully without crashing the entire page.",
      "Performance wins are real: we measured a 40% reduction in client-side JavaScript and a 25% improvement in LCP when migrating a data-heavy dashboard from pure CSR to RSC with TanStack Start.",
    ],
  },
  {
    slug: "data-science-career-roadmap",
    title: "Data Science Career Roadmap: From Beginner to Machine Learning Engineer",
    excerpt:
      "A structured 6-month plan covering Python, SQL, ML algorithms, and portfolio projects that get you hired.",
    author: "Rohan Verma",
    date: "Aug 5, 2026",
    readTime: "10 min read",
    category: "Career Tips",
    image: "",
    content: [
      "Breaking into data science requires a structured approach. The field is vast — Python, statistics, machine learning, SQL, data visualization — and trying to learn everything at once leads to burnout without results.",
      "Month 1-2: Foundation. Master Python basics (list comprehensions, generators, OOP), then move to NumPy and Pandas. Practice with real datasets from Kaggle. Write at least 20 SQL queries using JOINs, window functions, and CTEs.",
      "Month 3-4: Machine Learning. Start with scikit-learn. Understand linear regression, logistic regression, decision trees, and random forests. Implement them from scratch first, then use the library. This builds intuition that API-only learners lack.",
      "Month 5: Deep Learning & Specialization. Pick one — computer vision (PyTorch + CNNs) or NLP (Hugging Face transformers). Don't try both. Build one end-to-end project with a trained model deployed via FastAPI.",
      "Month 6: Portfolio & Job Prep. Build 3-4 projects that demonstrate different skills: exploratory data analysis, a predictive model with a Flask/FastAPI API, a dashboard with Streamlit, and a published Kaggle notebook with high votes.",
      "The most common mistake is spending months on courses without building. Employers care about what you have shipped, not what certificates you hold. Your GitHub profile is your resume.",
      "Networking matters more than you think. Attend local ML meetups, contribute to open-source data tools, write technical blog posts. The data science community in India is growing rapidly — use that.",
      "Salary expectations: entry-level data analyst roles start at ₹4-6 LPA. ML engineer roles at product companies start at ₹8-12 LPA. FAANG-level ML roles in India start at ₹20-35 LPA with stock.",
    ],
  },
  {
    slug: "aws-devops-real-world",
    title: "AWS DevOps in the Real World: What Bootcamps Don't Teach You",
    excerpt:
      "Lessons from deploying production workloads — CI/CD pipelines, cost optimization, and incident response.",
    author: "Aarav Menon",
    date: "Jul 28, 2026",
    readTime: "15 min read",
    category: "Industry Insights",
    image: "",
    content: [
      "Bootcamps teach you to deploy a static site on S3. Real-world DevOps is about keeping a 99.95% uptime SLA while your team pushes 15 deploys a day and costs don't explode.",
      "CI/CD is not just 'git push and pray'. Production pipelines have stages: lint, unit tests, integration tests (with a real database), security scanning (Snyk/Trivy), staging deployment, smoke tests, and canary production rollout.",
      "Cost optimization is a full-time job. AWS bills have a way of creeping up. Reserved instances for stable workloads, spot instances for batch jobs, S3 Intelligent-Tiering for data, and right-sizing EC2 instances monthly can save 40-60%.",
      "Incident response is where senior engineers distinguish themselves. Runbooks, PagerDuty escalation, post-mortems with blameless culture, and SLA/SLO tracking are non-negotiable. If you can write a clear incident timeline under pressure, you are valuable.",
      "Terraform is the IaC standard, but the real skill is structuring your Terraform modules: separate state files per environment, remote state with locking, and output references between modules.",
      "Observability is not just CloudWatch dashboards. Structured logging (JSON), distributed tracing (X-Ray/Jaeger), and alerting on symptoms (error rate, latency P99) not causes (CPU usage) is the modern approach.",
      "Container orchestration in practice means: horizontal pod autoscaling based on custom metrics, network policies for security, and understanding that Kubernetes is a platform, not a silver bullet. Sometimes a single ECS service is the right call.",
      "The best DevOps engineers are the ones who make the developer experience seamless. Internal developer platforms, self-service infrastructure, and fast feedback loops are what actually move the needle.",
    ],
  },
  {
    slug: "student-story-placement-amazon",
    title: "How I Landed a Role at Amazon After 6 Months of GUIDESOFT Training",
    excerpt:
      "From mechanical engineering to software development — a student's journey through Java Full Stack and placement preparation.",
    author: "Vikram Reddy",
    date: "Jul 20, 2026",
    readTime: "7 min read",
    category: "Student Stories",
    image: "",
    content: [
      "I graduated with a mechanical engineering degree in 2025 and had zero coding experience. Like many engineers in India, I was placed in a core company with a ₹3.5 LPA package and quickly realized the work wasn't for me.",
      "A friend recommended GUIDESOFT's Java Full Stack Development program. I was skeptical — could 6 months really change my career trajectory? But the syllabus covered exactly what job postings asked for: Java, Spring Boot, React, databases, and deployment.",
      "The first month was the hardest. Learning to think programmatically when you have never written code is a mental rewiring. The instructors were patient — they held extra doubt-clearing sessions and paired me with a mentor who had made the same transition.",
      "By month three, I was building REST APIs with Spring Boot and connecting them to PostgreSQL. The hands-on projects were the turning point. We built a complete e-commerce backend with authentication, payment integration, and order management.",
      "The placement preparation module was underrated. Mock interviews, resume reviews, and DSA practice sessions three times a week. They didn't just teach us to code — they taught us to communicate technical concepts clearly.",
      "Amazon's interview process was intense: online assessment (DSA + OS + DBMS), then 4 rounds of interviews (coding, system design, leadership principles, bar raiser). The system design round was where my GUIDESOFT project experience shone — I could discuss trade-offs, not just textbook answers.",
      "I joined Amazon as an SDE-1 in Bangalore with a CTC of ₹28 LPA. Six months ago I was writing MATLAB scripts for thermal analysis. The transition was brutal but absolutely worth it.",
      "My advice: commit fully. Treat the program like a 9-to-5 job. Code every day, build projects beyond the syllabus, and don't skip the placement prep sessions. The placement cell at GUIDESOFT genuinely cares about outcomes.",
    ],
  },
  {
    slug: "python-automation-scripts",
    title: "10 Python Automation Scripts Every Developer Should Know",
    excerpt:
      "File processing, web scraping, email automation, and data pipeline scripts that save hours of manual work.",
    author: "Meera Krishnan",
    date: "Jul 15, 2026",
    readTime: "9 min read",
    category: "Tech Tutorials",
    image: "",
    content: [
      "Automation is Python's superpower. The ability to write a 20-line script that saves you 2 hours of repetitive work every week is why Python dominates DevOps, data engineering, and backend development.",
      "Script 1: Bulk File Renamer. Use os.listdir() and a regex pattern to rename hundreds of files in a directory. Add logging to track what changed and a --dry-run flag for safety.",
      "Script 2: CSV to Database Loader. Use Pandas read_csv() with dtype specifications, then SQLAlchemy to batch-insert into PostgreSQL. Handle duplicates with ON CONFLICT DO UPDATE.",
      "Script 3: Web Scraper with Retry Logic. Requests + BeautifulSoup for static pages, Playwright for JS-rendered content. Add exponential backoff, respect robots.txt, and cache responses to avoid redundant requests.",
      "Script 4: Email Digest Sender. Use smtplib for sending, imaplib for reading. Parse incoming emails with email.policy, extract key metrics, and send a formatted HTML digest every morning.",
      "Script 5: Log Analyzer. Read application logs, parse timestamps and error levels, aggregate by hour, and output a summary CSV. Use regex for structured logs and line-by-line processing for unstructured ones.",
      "Script 6: Database Backup Scheduler. Use subprocess to run pg_dump, compress with gzip, upload to S3 with boto3, and rotate old backups. Schedule with cron or a systemd timer.",
      "Script 7-10: API health checker, SSL certificate expiry monitor, Docker image cleaner, and Slack notification bot. Each follows the same pattern: read config, perform action, handle errors, log results.",
      "The best automation scripts are idempotent (safe to re-run), well-logged, and have a dry-run mode. Start automating your most tedious weekly task — the ROI compounds fast.",
    ],
  },
  {
    slug: "hiring-trends-2026",
    title: "Tech Hiring Trends 2026: What Skills Are Employers Actually Looking For?",
    excerpt:
      "Analysis of 500+ job postings reveals the most in-demand skills, certifications, and portfolio expectations.",
    author: "Rohan Verma",
    date: "Jul 10, 2026",
    readTime: "11 min read",
    category: "Industry Insights",
    image: "",
    content: [
      "We analyzed 500+ tech job postings from Indian startups, product companies, and MNCs posted between January and June 2026. The results challenge some common assumptions about what employers want.",
      "Java is not dead — it is the most requested backend language, appearing in 62% of backend/full-stack roles. Python is second at 48%. The 'Python will replace Java' narrative is misleading; enterprises run on Java.",
      "React dominates frontend with 71% of frontend/full-stack postings. Next.js appears in 35% of React roles. Vue.js and Angular together account for 18%. If you know React + TypeScript, you are qualified for the majority of frontend openings.",
      "Cloud skills are no longer optional. 58% of roles mention AWS, 22% Azure, 15% GCP. Docker appears in 45% of backend postings. Kubernetes in 28%. These are not DevOps-only skills anymore — every developer is expected to understand containers.",
      "AI/ML skills are the fastest-growing category. 31% of backend/full-stack postings now mention 'experience with LLMs', 'AI integration', or 'prompt engineering'. This was under 5% in 2024. The GenAI wave is creating real hiring demand.",
      "Soft skills appear in 67% of senior-level postings. 'Communication skills', 'ability to explain technical concepts to non-technical stakeholders', and 'mentoring experience' are the most common. Technical skill alone caps your career growth.",
      "Portfolio expectations have risen. 43% of startup postings mention 'GitHub profile review' in the hiring process. Having 3-5 well-documented projects with READMEs, tests, and CI/CD is now the baseline for getting shortlisted.",
      "Salary bands: Entry-level (0-2 years) ₹4-8 LPA. Mid-level (3-5 years) ₹12-22 LPA. Senior (5+ years) ₹25-50 LPA. FAANG-equivalent packages for strong candidates start at ₹35+ LPA. Specializations in ML, security, or cloud architecture command 20-30% premiums.",
    ],
  },
  {
    slug: "first-job-web-developer",
    title: "From Zero to First Job: My Web Development Journey at GUIDESOFT",
    excerpt:
      "A non-CS graduate shares how structured learning, real projects, and mock interviews changed their career trajectory.",
    author: "Sneha Patel",
    date: "Jul 5, 2026",
    readTime: "6 min read",
    category: "Student Stories",
    image: "",
    content: [
      "I studied electronics engineering and had never written more than a 'Hello World' program. When I decided to switch to web development, I didn't know what HTML, CSS, or JavaScript even did.",
      "GUIDESOFT's Web Development program starts from absolute zero, which was exactly what I needed. The first two weeks cover HTML semantics, CSS Flexbox/Grid, and vanilla JavaScript DOM manipulation — no frameworks, no shortcuts.",
      "By week 4, we were building responsive landing pages. By week 8, we had learned React and were building single-page applications with routing, state management, and API integration.",
      "The project-based learning model was crucial for me. Every module ends with a real project: a task manager, a weather app, a blog platform, and finally a full-stack capstone. These projects became my portfolio.",
      "The instructors didn't just teach code. They taught us how to learn — reading documentation, debugging with browser dev tools, using Git properly, and reading error messages instead of panicking.",
      "Placement support started at week 16. Resume building, LinkedIn optimization, and mock technical interviews. My first mock interview was terrible — I couldn't explain how the virtual DOM works. By my fifth, I was answering system design questions confidently.",
      "I landed a frontend developer role at a SaaS startup with a CTC of ₹6.5 LPA. The role involves building React components, writing tests, and collaborating with designers. Everything I learned at GUIDESOFT applies directly.",
      "If you are a non-CS graduate considering web development: the barrier to entry is lower than you think, but the learning curve is real. Commit 4-6 months of focused study, build projects every week, and don't be afraid to apply before you feel 'ready'.",
    ],
  },
  {
    slug: "docker-kubernetes-production",
    title: "Docker & Kubernetes in Production: Lessons from 50+ Deployments",
    excerpt:
      "Container orchestration patterns, health checks, resource limits, and debugging strategies that actually work.",
    author: "Aarav Menon",
    date: "Jun 28, 2026",
    readTime: "14 min read",
    category: "Tech Tutorials",
    image: "",
    content: [
      "Docker makes local development easy. Kubernetes makes production deployment scalable. But the gap between 'docker run' and a reliable production deployment is where most teams struggle.",
      "Multi-stage builds are non-negotiable. A typical Node.js app image goes from 1.2GB (node:18 full) to 180MB (node:18-alpine with production deps only). Smaller images mean faster pulls, less attack surface, and cheaper registry storage.",
      "Health checks save you from silent failures. Liveness probes check if the process is alive. Readiness probes check if it can accept traffic. Startup probes prevent slow-starting containers from being killed by the liveness check.",
      "Resource limits prevent the noisy neighbor problem. Set CPU requests/limits based on profiling, not guesswork. Memory limits must account for JVM heap (if Java), Node.js garbage collection, and container overhead.",
      "Kubernetes debugging starts with kubectl describe pod, logs, and exec. If the pod is in CrashLoopBackOff, check logs first, then events, then resource limits. 90% of production issues are misconfigured probes or missing environment variables.",
      "Horizontal pod autoscaling works best with custom metrics (requests per second, queue depth) not CPU. CPU-based scaling is reactive; custom metric scaling is predictive.",
      "Rolling deployments with readiness gates prevent downtime. The new pod must pass readiness checks before the old pod is terminated. Pair with PodDisruptionBudgets to ensure minimum availability during cluster maintenance.",
      "The biggest lesson from 50+ deployments: simplicity wins. If your architecture requires a service mesh, custom operators, and 12 Helm charts to deploy a CRUD app, you have over-engineered. Start with Deployment + Service + Ingress. Add complexity only when you have the traffic to justify it.",
    ],
  },
];
