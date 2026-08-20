export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type LearningMode = "Live online" | "Classroom" | "Hybrid" | "Self-paced";

export type Lesson = {
  title: string;
  duration: string;
  type: "Video" | "Workshop" | "Reading" | "Quiz";
};

export type Module = {
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  assignment: string;
  project?: string;
};

export type Course = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  level: CourseLevel;
  duration: string;
  format: LearningMode;
  price: string;
  accent: string;
  summary: string;
  overview: string;
  tools: string[];
  prerequisites: string[];
  outcomes: string[];
  instructor: string;
  modules: Module[];
  project: string;
};

const standardLessons: Lesson[] = [
  { title: "Concept briefing", duration: "24 min", type: "Video" },
  { title: "Guided implementation", duration: "48 min", type: "Workshop" },
  { title: "Practice notes", duration: "15 min", type: "Reading" },
  { title: "Knowledge check", duration: "10 min", type: "Quiz" },
];

const module = (
  title: string,
  description: string,
  assignment: string,
  project?: string,
): Module => ({
  title,
  description,
  duration: "1 week",
  lessons: standardLessons,
  assignment,
  ...(project ? { project } : {}),
});

export const courseCategories = [
  { name: "Software Development", count: 8, tone: "cyan" },
  { name: "Data & AI", count: 6, tone: "amber" },
  { name: "Cloud & DevOps", count: 5, tone: "lime" },
  { name: "Testing", count: 4, tone: "rose" },
  { name: "UI/UX & Design", count: 4, tone: "violet" },
  { name: "SAP & Enterprise", count: 3, tone: "blue" },
  { name: "Mobile Development", count: 3, tone: "orange" },
  { name: "Digital & Business", count: 4, tone: "green" },
] as const;

export const courses: Course[] = [
  {
    slug: "java-full-stack-development",
    title: "Java Full Stack Development",
    shortTitle: "Java Full Stack",
    category: "Software Development",
    level: "Intermediate",
    duration: "24 weeks",
    format: "Live online",
    price: "₹48,000",
    accent: "cyan",
    summary: "Build production-style web applications with Java, Spring Boot, REST APIs and React.",
    overview:
      "A structured, project-led programme for learners who want a strong foundation in backend engineering and modern frontend delivery. You will move from programming fundamentals to a deployed capstone with weekly instructor feedback.",
    tools: ["Java", "Spring Boot", "PostgreSQL", "React", "GitHub", "Docker"],
    prerequisites: [
      "Basic computer literacy",
      "Comfort with logical problem solving",
      "A laptop capable of running a local development environment",
    ],
    outcomes: [
      "Design REST APIs",
      "Build secure full-stack features",
      "Work with relational data",
      "Collaborate with Git",
      "Deploy a portfolio project",
    ],
    instructor: "Aarav Menon",
    project:
      "Cohort commerce platform with authentication, catalog, payments-ready checkout and an operations dashboard.",
    modules: [
      module(
        "Programming Fundamentals",
        "Variables, control flow, methods and problem decomposition.",
        "Create a command-line expense tracker.",
      ),
      module(
        "Java Core & OOP",
        "Classes, interfaces, inheritance and clean object boundaries.",
        "Model a library lending system.",
      ),
      module(
        "Collections & Exceptions",
        "Collections, generics, streams and resilient error handling.",
        "Build a validated data import utility.",
      ),
      module(
        "Java 8+",
        "Lambdas, streams, optionals and modern Java practices.",
        "Refactor a legacy service with streams.",
      ),
      module(
        "SQL & JDBC",
        "Relational modelling, joins, transactions and persistence.",
        "Design a normalized order schema.",
      ),
      module(
        "HTML, CSS & JavaScript",
        "Accessible layouts, browser APIs and frontend fundamentals.",
        "Build an accessible admin form.",
      ),
      module(
        "Git & Team Workflow",
        "Branches, pull requests, reviews and release hygiene.",
        "Complete a review-driven feature branch.",
      ),
      module(
        "Spring & Spring Boot",
        "Dependency injection, configuration and application structure.",
        "Create a modular Spring Boot service.",
      ),
      module(
        "REST APIs",
        "Resource design, validation, pagination and API documentation.",
        "Expose a versioned product API.",
      ),
      module(
        "JPA & Hibernate",
        "Entities, relationships, queries and migration strategy.",
        "Persist an order workflow.",
      ),
      module(
        "React & TypeScript",
        "Components, forms, routing and typed client state.",
        "Build a searchable course catalogue.",
        "Course catalogue slice",
      ),
      module(
        "Authentication & Testing",
        "Sessions, authorization, unit tests and integration checks.",
        "Add protected routes and test coverage.",
      ),
      module(
        "Deployment & Capstone",
        "Docker, CI basics, observability and production handoff.",
        "Present a deployment runbook.",
        "Full-stack commerce platform",
      ),
      module(
        "Interview Preparation",
        "Portfolio walkthroughs, Java problem solving and communication.",
        "Record a five-minute technical walkthrough.",
      ),
    ],
  },
  {
    slug: "python-full-stack-development",
    title: "Python Full Stack Development",
    shortTitle: "Python Full Stack",
    category: "Software Development",
    level: "Beginner",
    duration: "22 weeks",
    format: "Hybrid",
    price: "₹42,000",
    accent: "amber",
    summary: "Learn Python, Django, APIs, databases and React through a practical product build.",
    overview:
      "A beginner-friendly path that turns Python fundamentals into deployable web features. Live instruction, lab time and code reviews keep the learning grounded in practice.",
    tools: ["Python", "Django", "FastAPI", "PostgreSQL", "React", "Git"],
    prerequisites: [
      "No prior programming job experience required",
      "Consistent weekly practice time",
      "A laptop with internet access",
    ],
    outcomes: [
      "Write maintainable Python",
      "Build Django applications",
      "Design APIs",
      "Work with SQL",
      "Ship a portfolio-ready project",
    ],
    instructor: "Nisha Reddy",
    project: "A support operations workspace with ticket triage, role-based views and reporting.",
    modules: [
      module(
        "Python Foundations",
        "Syntax, data structures, functions and modules.",
        "Create a CLI habit tracker.",
      ),
      module(
        "Object-Oriented Python",
        "Classes, composition and reusable packages.",
        "Model a booking domain.",
      ),
      module(
        "Testing & Code Quality",
        "Pytest, debugging, formatting and readable code.",
        "Add tests to a small service.",
      ),
      module(
        "SQL & Data Modelling",
        "Schemas, queries, indexes and migrations.",
        "Design a support ticket schema.",
      ),
      module(
        "Django Fundamentals",
        "Views, templates, models and admin.",
        "Build a knowledge base.",
      ),
      module(
        "Django REST & FastAPI",
        "API design, validation and documentation.",
        "Create a ticket API.",
      ),
      module(
        "React Client",
        "Components, forms and API integration.",
        "Build the agent dashboard.",
        "Support operations workspace",
      ),
      module(
        "Deployment & Career Prep",
        "Environment configuration, release checks and interviews.",
        "Write a deployment checklist.",
      ),
    ],
  },
  {
    slug: "mern-stack-development",
    title: "MERN Stack Development",
    shortTitle: "MERN Stack",
    category: "Software Development",
    level: "Intermediate",
    duration: "20 weeks",
    format: "Live online",
    price: "₹44,000",
    accent: "lime",
    summary:
      "Go from JavaScript fundamentals to full-stack products with React, Node, Express and MongoDB.",
    overview:
      "A modern JavaScript programme built around weekly shipping. You will learn the browser, server, data layer and deployment practices needed to build credible portfolio work.",
    tools: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB"],
    prerequisites: [
      "Basic HTML familiarity",
      "Interest in building interactive products",
      "Weekly lab access",
    ],
    outcomes: [
      "Build typed React features",
      "Create Node APIs",
      "Model document data",
      "Secure routes",
      "Deploy a full-stack app",
    ],
    instructor: "Rohan Kulkarni",
    project: "A collaborative project workspace with teams, tasks, comments and activity history.",
    modules: [
      module(
        "Web & JavaScript Foundations",
        "The browser, DOM, async code and modern syntax.",
        "Build a responsive dashboard.",
      ),
      module(
        "TypeScript & React",
        "Components, state, forms and accessible UI.",
        "Create a typed task board.",
      ),
      module(
        "Node & Express",
        "HTTP, middleware, validation and API conventions.",
        "Build a REST service.",
      ),
      module(
        "MongoDB & Data Design",
        "Documents, indexes, queries and data boundaries.",
        "Model workspace data.",
      ),
      module(
        "Authentication & Testing",
        "Sessions, roles, unit tests and API checks.",
        "Protect workspace routes.",
      ),
      module(
        "Deployment & Capstone",
        "CI, environment variables and observability.",
        "Publish a release checklist.",
        "Collaborative project workspace",
      ),
    ],
  },
  {
    slug: "data-science-with-python",
    title: "Data Science with Python",
    shortTitle: "Data Science",
    category: "Data & AI",
    level: "Intermediate",
    duration: "18 weeks",
    format: "Live online",
    price: "₹46,000",
    accent: "violet",
    summary:
      "Learn Python, statistics, data preparation, visualisation and applied machine learning.",
    overview:
      "A practical data programme focused on asking better questions, preparing trustworthy datasets and communicating findings clearly. Datasets are used for learning and are not presented as business outcomes.",
    tools: ["Python", "Pandas", "NumPy", "SQL", "Jupyter", "scikit-learn"],
    prerequisites: [
      "School-level mathematics",
      "Basic Python helpful but not required",
      "Curiosity about evidence and measurement",
    ],
    outcomes: [
      "Clean and explore datasets",
      "Explain statistical concepts",
      "Build baseline models",
      "Evaluate model quality",
      "Present an analytical story",
    ],
    instructor: "Dr. Meera Iyer",
    project:
      "An end-to-end customer retention analysis with a reproducible notebook and decision brief.",
    modules: [
      module(
        "Python for Analysis",
        "Functions, notebooks and reproducible workflows.",
        "Create a data-cleaning notebook.",
      ),
      module(
        "SQL & Data Wrangling",
        "Joins, aggregations and validation checks.",
        "Prepare a reporting dataset.",
      ),
      module(
        "Statistics for Decisions",
        "Distributions, sampling and uncertainty.",
        "Explain a test result in plain language.",
      ),
      module(
        "Pandas & NumPy",
        "Transformations, missing data and feature preparation.",
        "Build a reusable preprocessing pipeline.",
      ),
      module(
        "Visualisation & Storytelling",
        "Charts, dashboards and audience-aware narratives.",
        "Present a one-page insight brief.",
      ),
      module(
        "Machine Learning",
        "Regression, classification and evaluation.",
        "Compare two baseline models.",
        "Customer retention analysis",
      ),
      module(
        "Portfolio & Interview Prep",
        "Project framing, notebooks and analytical interviews.",
        "Record a project walkthrough.",
      ),
    ],
  },
  {
    slug: "aws-cloud-devops",
    title: "AWS Cloud & DevOps",
    shortTitle: "AWS Cloud & DevOps",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "16 weeks",
    format: "Hybrid",
    price: "₹40,000",
    accent: "orange",
    summary:
      "Understand cloud foundations, containers, CI/CD, infrastructure as code and observability.",
    overview:
      "Hands-on cloud learning for developers and operations-minded learners. Labs use isolated practice environments and focus on principles you can transfer between providers.",
    tools: ["AWS", "Linux", "Docker", "GitHub Actions", "Terraform", "Kubernetes"],
    prerequisites: [
      "Command-line basics",
      "An application to deploy",
      "Interest in systems and reliability",
    ],
    outcomes: [
      "Explain cloud architecture",
      "Containerize services",
      "Automate delivery",
      "Manage infrastructure as code",
      "Instrument a service",
    ],
    instructor: "Vivek Srinivas",
    project:
      "A staged deployment pipeline for a containerized web service with rollback and monitoring notes.",
    modules: [
      module(
        "Linux & Networking",
        "Processes, permissions, DNS and HTTP.",
        "Troubleshoot a service from logs.",
      ),
      module(
        "Cloud Foundations",
        "Regions, identity, storage and compute.",
        "Draw a least-privilege architecture.",
      ),
      module(
        "Docker",
        "Images, containers, networks and registries.",
        "Containerize a web service.",
      ),
      module(
        "CI/CD",
        "Builds, checks, releases and rollback thinking.",
        "Create a pipeline with quality gates.",
      ),
      module(
        "Terraform",
        "State, modules and repeatable infrastructure.",
        "Provision a review environment.",
      ),
      module(
        "Kubernetes & Observability",
        "Workloads, services, metrics and incident notes.",
        "Deploy and observe a small service.",
        "Container deployment pipeline",
      ),
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Product Design",
    shortTitle: "UI/UX Design",
    category: "UI/UX & Design",
    level: "Beginner",
    duration: "12 weeks",
    format: "Live online",
    price: "₹28,000",
    accent: "rose",
    summary:
      "Research, information architecture, interface design, prototyping and portfolio storytelling.",
    overview:
      "A studio-style design path that balances user understanding with polished interface craft. You will build a case study that explains your decisions, not just your screens.",
    tools: ["Figma", "FigJam", "Maze", "Notion", "Accessibility checks"],
    prerequisites: [
      "No design degree required",
      "Willingness to observe and iterate",
      "A laptop with a modern browser",
    ],
    outcomes: [
      "Plan lightweight research",
      "Map user journeys",
      "Build accessible interfaces",
      "Prototype interactions",
      "Present a portfolio case study",
    ],
    instructor: "Kavya Thomas",
    project:
      "A redesigned learning enrolment journey tested with a small set of representative users.",
    modules: [
      module(
        "Design Thinking & Research",
        "Problem framing, interviews and observation.",
        "Write a research plan.",
      ),
      module(
        "Information Architecture",
        "Journeys, navigation and content structure.",
        "Map a course catalogue.",
      ),
      module(
        "Wireframes & Interaction",
        "Flows, states and low-fidelity testing.",
        "Prototype an enrolment flow.",
      ),
      module(
        "UI Systems",
        "Typography, colour, components and accessibility.",
        "Create a small design system.",
      ),
      module(
        "Prototyping & Testing",
        "Usability sessions and iterative decisions.",
        "Summarise test findings.",
      ),
      module(
        "Portfolio Storytelling",
        "Case study structure and presentation.",
        "Publish a case study.",
        "Learning enrolment redesign",
      ),
    ],
  },
  {
    slug: "software-testing-automation",
    title: "Software Testing & Automation",
    shortTitle: "Testing & Automation",
    category: "Testing",
    level: "Beginner",
    duration: "14 weeks",
    format: "Live online",
    price: "₹30,000",
    accent: "blue",
    summary:
      "Learn test thinking, API checks, Selenium workflows, defect reporting and quality strategy.",
    overview:
      "A practical introduction to quality engineering for learners who want to understand how reliable teams find risk early and communicate it clearly.",
    tools: ["Selenium", "Postman", "Java", "Jira-style workflows", "GitHub Actions"],
    prerequisites: [
      "Basic web understanding",
      "Attention to detail",
      "No prior testing job required",
    ],
    outcomes: [
      "Design test cases",
      "Report useful defects",
      "Test APIs",
      "Automate browser workflows",
      "Contribute to release quality",
    ],
    instructor: "Arjun Nair",
    project: "A regression suite and release quality report for an online course catalogue.",
    modules: [
      module(
        "Testing Foundations",
        "Risk, test levels and useful evidence.",
        "Create a test strategy.",
      ),
      module(
        "Manual Testing",
        "Scenarios, exploratory testing and defects.",
        "Test an enrolment flow.",
      ),
      module(
        "API Testing",
        "HTTP, collections, assertions and environments.",
        "Build an API collection.",
      ),
      module(
        "Selenium Automation",
        "Locators, page objects and stable checks.",
        "Automate a registration journey.",
      ),
      module(
        "Quality in CI",
        "Pipelines, reports and release decisions.",
        "Add checks to a workflow.",
        "Course catalogue regression suite",
      ),
    ],
  },
  {
    slug: "power-bi-data-analytics",
    title: "Power BI & Data Analytics",
    shortTitle: "Power BI Analytics",
    category: "Data & AI",
    level: "Beginner",
    duration: "10 weeks",
    format: "Classroom",
    price: "₹24,000",
    accent: "amber",
    summary:
      "Turn raw tables into clear, decision-ready dashboards with SQL, Power Query and Power BI.",
    overview:
      "A hands-on analytics course for learners who want to build trustworthy reports and communicate what the numbers mean to a real audience.",
    tools: ["Power BI", "Power Query", "SQL", "Excel", "DAX"],
    prerequisites: [
      "Comfort with spreadsheets",
      "Basic arithmetic",
      "Interest in business questions",
    ],
    outcomes: [
      "Prepare data",
      "Write core measures",
      "Design dashboards",
      "Explain trends",
      "Document assumptions",
    ],
    instructor: "Meera Iyer",
    project: "A learner progress dashboard with documented measures and audience-specific views.",
    modules: [
      module(
        "Analytics Foundations",
        "Questions, dimensions, measures and data quality.",
        "Frame a reporting brief.",
      ),
      module(
        "SQL & Power Query",
        "Filter, join, transform and validate data.",
        "Prepare a clean model.",
      ),
      module(
        "Data Modelling & DAX",
        "Relationships, measures and context.",
        "Build a reusable measure set.",
      ),
      module(
        "Dashboard Design",
        "Hierarchy, interaction and accessibility.",
        "Publish a decision dashboard.",
        "Learner progress dashboard",
      ),
    ],
  },
  {
    slug: "generative-ai-engineering",
    title: "Generative AI Engineering",
    shortTitle: "Generative AI",
    category: "Data & AI",
    level: "Advanced",
    duration: "12 weeks",
    format: "Live online",
    price: "₹36,000",
    accent: "violet",
    summary:
      "Build grounded AI features with evaluation, retrieval, safety and production-minded APIs.",
    overview:
      "A practical engineering course for learners who already code and want to understand how to build useful AI-assisted workflows without treating model output as magic or guaranteed truth.",
    tools: ["Python", "LLM APIs", "Embeddings", "Vector search", "FastAPI", "Evaluation notebooks"],
    prerequisites: [
      "Python programming",
      "HTTP and API basics",
      "Comfort reading technical documentation",
    ],
    outcomes: [
      "Design AI workflows",
      "Ground responses with retrieval",
      "Evaluate quality",
      "Handle sensitive inputs",
      "Expose a useful service",
    ],
    instructor: "Dr. Meera Iyer",
    project:
      "A citation-aware learning assistant that answers from a curated course knowledge base.",
    modules: [
      module(
        "AI Product Thinking",
        "Use cases, constraints and human oversight.",
        "Write an AI feature brief.",
      ),
      module(
        "Prompting & Structured Output",
        "Reliable instructions, schemas and fallbacks.",
        "Build a structured extraction flow.",
      ),
      module(
        "Retrieval & Grounding",
        "Chunking, embeddings and citations.",
        "Create a small knowledge index.",
      ),
      module(
        "Evaluation & Safety",
        "Test sets, failure modes and privacy boundaries.",
        "Write an evaluation report.",
      ),
      module(
        "AI Service Delivery",
        "APIs, monitoring and user feedback loops.",
        "Ship a grounded assistant.",
        "Course knowledge assistant",
      ),
    ],
  },
  {
    slug: "flutter-mobile-development",
    title: "Flutter Mobile Development",
    shortTitle: "Flutter Mobile",
    category: "Mobile Development",
    level: "Intermediate",
    duration: "14 weeks",
    format: "Live online",
    price: "₹32,000",
    accent: "cyan",
    summary:
      "Create cross-platform mobile apps with Flutter, Dart, APIs, local storage and release practices.",
    overview:
      "A build-first mobile course covering the application surface, data flow and release considerations behind a polished cross-platform app.",
    tools: ["Dart", "Flutter", "Firebase", "REST APIs", "Git"],
    prerequisites: [
      "Basic programming",
      "An Android or iOS test device helpful",
      "Weekly practice time",
    ],
    outcomes: [
      "Build responsive screens",
      "Manage app state",
      "Integrate APIs",
      "Persist local data",
      "Prepare a release candidate",
    ],
    instructor: "Rohan Kulkarni",
    project: "A field-service mobile app with offline notes and synchronised task updates.",
    modules: [
      module(
        "Dart Foundations",
        "Types, functions, async code and packages.",
        "Build a small data utility.",
      ),
      module(
        "Flutter UI",
        "Widgets, layouts, themes and accessibility.",
        "Create a responsive flow.",
      ),
      module(
        "State & Navigation",
        "Application state, routes and forms.",
        "Build a multi-screen feature.",
      ),
      module(
        "APIs & Offline Data",
        "Requests, caching and sync states.",
        "Handle offline task updates.",
      ),
      module(
        "Testing & Release",
        "Widget tests, builds and store readiness.",
        "Prepare a release checklist.",
        "Field-service mobile app",
      ),
    ],
  },
  {
    slug: "sap-fico-foundations",
    title: "SAP FICO Foundations",
    shortTitle: "SAP FICO",
    category: "SAP & Enterprise",
    level: "Beginner",
    duration: "16 weeks",
    format: "Hybrid",
    price: "₹38,000",
    accent: "blue",
    summary:
      "Understand finance and controlling workflows, enterprise terminology and configuration concepts.",
    overview:
      "An orientation to SAP FICO for learners preparing for enterprise roles. The programme emphasizes process understanding, documentation and practice scenarios.",
    tools: ["SAP concepts", "Finance workflows", "Controlling scenarios", "Process documentation"],
    prerequisites: [
      "Basic accounting concepts",
      "Interest in enterprise software",
      "Comfort with structured documentation",
    ],
    outcomes: [
      "Explain core FICO processes",
      "Trace a business transaction",
      "Document configuration questions",
      "Prepare for entry-level interviews",
    ],
    instructor: "Sanjay Rao",
    project: "A documented procure-to-pay and month-end close scenario for a sample organization.",
    modules: [
      module(
        "Enterprise Process Basics",
        "Organizations, master data and transaction flow.",
        "Map a procure-to-pay process.",
      ),
      module(
        "General Ledger",
        "Accounts, postings and period concepts.",
        "Document a ledger scenario.",
      ),
      module(
        "Accounts Payable & Receivable",
        "Invoices, payments and reconciliation.",
        "Create a process walkthrough.",
      ),
      module(
        "Controlling & Reporting",
        "Cost centres, internal orders and reporting.",
        "Prepare a month-end brief.",
        "Finance process documentation",
      ),
      module(
        "Interview Preparation",
        "Scenario questions and business communication.",
        "Present a process map.",
      ),
    ],
  },
];

export const batches = [
  {
    id: "java-aug-26",
    courseSlug: "java-full-stack-development",
    name: "Java Full Stack · Evening Cohort",
    start: "24 Aug 2026",
    end: "08 Feb 2027",
    days: "Mon, Wed, Fri",
    time: "7:30–9:00 PM",
    seats: 30,
    available: 12,
    mode: "Live online",
    instructor: "Aarav Menon",
    status: "Starting soon",
    price: "₹48,000",
  },
  {
    id: "python-sep-26",
    courseSlug: "python-full-stack-development",
    name: "Python Full Stack · Weekend Cohort",
    start: "05 Sep 2026",
    end: "06 Feb 2027",
    days: "Sat & Sun",
    time: "10:00 AM–12:00 PM",
    seats: 28,
    available: 17,
    mode: "Hybrid",
    instructor: "Nisha Reddy",
    status: "Open for enrolment",
    price: "₹42,000",
  },
  {
    id: "data-sep-26",
    courseSlug: "data-science-with-python",
    name: "Data Science · Applied Track",
    start: "12 Sep 2026",
    end: "16 Jan 2027",
    days: "Tue & Thu",
    time: "7:00–8:30 PM",
    seats: 24,
    available: 9,
    mode: "Live online",
    instructor: "Dr. Meera Iyer",
    status: "Open for enrolment",
    price: "₹46,000",
  },
  {
    id: "aws-oct-26",
    courseSlug: "aws-cloud-devops",
    name: "AWS Cloud & DevOps · Lab Track",
    start: "03 Oct 2026",
    end: "23 Jan 2027",
    days: "Sat",
    time: "3:00–5:30 PM",
    seats: 20,
    available: 14,
    mode: "Hybrid",
    instructor: "Vivek Srinivas",
    status: "Open for enrolment",
    price: "₹40,000",
  },
  {
    id: "uiux-sep-26",
    courseSlug: "ui-ux-design",
    name: "UI/UX Design · Studio Cohort",
    start: "19 Sep 2026",
    end: "12 Dec 2026",
    days: "Sat",
    time: "11:00 AM–1:30 PM",
    seats: 18,
    available: 6,
    mode: "Live online",
    instructor: "Kavya Thomas",
    status: "Limited seats",
    price: "₹28,000",
  },
] as const;

export const roadmaps = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    description: "A practical route from browser fundamentals to a portfolio you can explain.",
    steps: [
      "HTML",
      "CSS",
      "JavaScript",
      "Git",
      "React",
      "TypeScript",
      "APIs",
      "Testing",
      "Deployment",
      "Portfolio",
    ],
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    description: "Learn to connect product interfaces, services, data and deployment.",
    steps: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "Database",
      "Authentication",
      "APIs",
      "Testing",
      "Deployment",
    ],
  },
  {
    slug: "data-scientist",
    title: "Data Scientist",
    description: "Build the habits needed to turn messy data into defensible decisions.",
    steps: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "NumPy",
      "Visualisation",
      "Machine Learning",
      "Deep Learning",
      "Projects",
    ],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    description: "Move from systems basics to repeatable delivery and observability.",
    steps: [
      "Linux",
      "Git",
      "Networking",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
      "Cloud",
      "Monitoring",
    ],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    description: "Build an evidence-led design practice and a portfolio case study.",
    steps: [
      "Design Thinking",
      "UX Research",
      "Information Architecture",
      "Wireframes",
      "UI Design",
      "Prototyping",
      "Design Systems",
      "Usability Testing",
      "Portfolio",
    ],
  },
] as const;

export const internships = [
  {
    slug: "web-platform-internship",
    title: "Web Platform Project Internship",
    category: "Web Development",
    duration: "8 weeks",
    mode: "Remote project cohort",
    mentor: "Aarav Menon",
    description: "Build a scoped internal operations portal with weekly reviews and a final demo.",
    skills: ["React", "TypeScript", "Git"],
  },
  {
    slug: "data-insights-internship",
    title: "Data Insights Project Internship",
    category: "Data Science",
    duration: "6 weeks",
    mode: "Remote project cohort",
    mentor: "Dr. Meera Iyer",
    description: "Clean a structured dataset, document assumptions and present an insight brief.",
    skills: ["Python", "Pandas", "Visualisation"],
  },
  {
    slug: "qa-automation-internship",
    title: "QA Automation Project Internship",
    category: "Testing",
    duration: "6 weeks",
    mode: "Guided project cohort",
    mentor: "Arjun Nair",
    description: "Create a small regression suite and practice communicating release risk.",
    skills: ["Selenium", "API testing", "Test design"],
  },
  {
    slug: "design-portfolio-internship",
    title: "Product Design Portfolio Internship",
    category: "UI/UX",
    duration: "5 weeks",
    mode: "Studio project cohort",
    mentor: "Kavya Thomas",
    description: "Turn a real workflow into a researched, tested portfolio case study.",
    skills: ["Figma", "Research", "Prototyping"],
  },
] as const;

export const projects = [
  {
    title: "Course catalogue and enrolment flow",
    technology: "React · TypeScript",
    difficulty: "Intermediate",
    category: "Web Development",
    description:
      "Design and build a searchable course catalogue with filter state, batch selection and a validated enquiry flow.",
    outcomes: ["Typed UI state", "Accessible forms", "Responsive information architecture"],
  },
  {
    title: "Customer retention analysis",
    technology: "Python · Pandas · scikit-learn",
    difficulty: "Intermediate",
    category: "Data Science",
    description:
      "Explore a provided dataset, create baseline features and present a responsible analytical narrative.",
    outcomes: ["Data cleaning", "Model evaluation", "Decision communication"],
  },
  {
    title: "Container delivery pipeline",
    technology: "Docker · GitHub Actions · AWS",
    difficulty: "Advanced",
    category: "Cloud & DevOps",
    description:
      "Package a small service and document a staged delivery path with checks and rollback notes.",
    outcomes: ["Repeatable builds", "Release checks", "Operational thinking"],
  },
  {
    title: "Learning enrolment redesign",
    technology: "Figma · FigJam",
    difficulty: "Beginner",
    category: "UI/UX",
    description:
      "Research a learner journey, prototype an improved experience and explain the trade-offs in a case study.",
    outcomes: ["Research framing", "Prototype testing", "Portfolio storytelling"],
  },
] as const;

export const instructors = [
  {
    name: "Aarav Menon",
    role: "Full-stack engineering instructor",
    focus: "Java, Spring Boot and API design",
    availability: "Mon–Fri evenings",
  },
  {
    name: "Nisha Reddy",
    role: "Python engineering instructor",
    focus: "Python, Django and practical web systems",
    availability: "Weekend cohorts",
  },
  {
    name: "Dr. Meera Iyer",
    role: "Data and AI instructor",
    focus: "Data analysis, ML foundations and evaluation",
    availability: "Tue–Thu evenings",
  },
  {
    name: "Vivek Srinivas",
    role: "Cloud and DevOps instructor",
    focus: "AWS, containers and delivery systems",
    availability: "Saturday labs",
  },
  {
    name: "Kavya Thomas",
    role: "Product design instructor",
    focus: "UX research, systems and portfolio craft",
    availability: "Saturday studio",
  },
  {
    name: "Arjun Nair",
    role: "Quality engineering instructor",
    focus: "Test strategy, APIs and automation",
    availability: "Flexible lab reviews",
  },
] as const;

export const articles = [
  {
    slug: "how-to-choose-your-first-tech-course",
    title: "How to choose your first technology course",
    category: "Career",
    date: "12 Aug 2026",
    excerpt:
      "A calm way to compare prerequisites, format, practice time and the kind of work you want to do next.",
    body: [
      "Choosing a first course feels like a big decision, but it becomes manageable when you compare a few practical things instead of trying to predict the future.",
      "Start with prerequisites. If a course expects fundamentals you do not have yet, the first few weeks will feel like a slog. A good course tells you exactly what it assumes and points you to a quick self-check.",
      "Compare format honestly. Live classes are great for discipline and doubt-clearing; recorded ones give you schedule freedom. Ask which you can sustain for the duration, not which feels nicer today.",
      "Count practice time. The learning happens between classes — exercises, assignments and projects. A course with three hours of class and no structured practice will teach you less than one with two hours of class and a real project.",
      "Finally, look at the kind of work you want next. Talk to people already doing that work and ask what they actually use. Courses should serve that answer, not the other way around.",
    ],
  },
  {
    slug: "what-makes-a-useful-portfolio-project",
    title: "What makes a portfolio project useful?",
    category: "Learning Resources",
    date: "06 Aug 2026",
    excerpt:
      "A project becomes evidence when you can explain the decisions, trade-offs and results behind it.",
    body: [
      "A portfolio project is evidence of how you work, not just what you can build. The difference shows up in an interview within the first few minutes.",
      "The best projects have a clear problem. A to-do app demonstrates syntax; a small tool that solves an annoyance you actually had demonstrates judgement. Solve something real, even if it is tiny.",
      "Document the decisions. Why this database? Why this architecture? What did you try first and why did you change it? Interviewers love honest trade-off stories because that is what real engineering looks like.",
      "Make the results observable. A README with setup steps, a live link and a short explanation of what works and what you would improve are worth more than a wall of code.",
      "Keep it small and finished. Two complete projects you can defend beat five half-finished ones. Finished means deployed, tested and explained.",
    ],
  },
  {
    slug: "getting-started-with-api-testing",
    title: "Getting started with API testing",
    category: "Testing",
    date: "28 Jul 2026",
    excerpt: "Understand requests, assertions and the questions a good API check should answer.",
    body: [
      "API testing starts with the simplest mental model: an API is a contract. You send a request, you get a response, and the test checks the response honours the contract.",
      "Learn to inspect a request properly. The method, the headers, the body and the URL together determine the behaviour. Change one and the result can change completely.",
      "Write assertions that ask real questions. Does the status code match the outcome? Is the response shape correct? Are the values sensible? A test that only checks for a 200 misses most of the contract.",
      "Cover the interesting cases: missing parameters, wrong types, unauthenticated access and boundary values. These are where real APIs fail.",
      "Then automate. The same checks you run by hand should run in a pipeline, because regressions show up long after the happy path stops being interesting.",
    ],
  },
  {
    slug: "a-better-way-to-learn-cloud",
    title: "A better way to learn cloud foundations",
    category: "Cloud",
    date: "19 Jul 2026",
    excerpt:
      "Start with systems and constraints, then add services. The vocabulary sticks when the why is clear.",
    body: [
      "Cloud learning often starts with a list of services and ends in confusion. A better order is to start with the problem: what does an application need to run, scale and recover?",
      "Every cloud service exists to answer a constraint. Computing is about where code runs, storage about where data lives, networking about who can reach what. Map services to constraints and they stop being a list.",
      "Build a small end-to-end system. Deploy a simple app, give it a database, add a load balancer and watch what breaks. The failures teach the architecture better than any diagram.",
      "Use the free tiers ruthlessly. Almost every provider gives you enough to build something real, and the billing alerts teach you the cost model safely.",
      "Finally, learn the shared vocabulary — regions, availability, durability, latency — because the words transfer between providers even when the buttons do not.",
    ],
  },
] as const;

export const learnerDashboard = {
  learner: "Priya Sharma",
  role: "Java Full Stack learner",
  overallProgress: 42,
  currentCourse: "java-full-stack-development",
  currentLesson: "React & TypeScript",
  completedLessons: 38,
  totalLessons: 91,
  nextClass: "Spring Boot workshop · Today, 7:30 PM",
  assignments: 2,
  certificates: 0,
} as const;

export const certificate = {
  id: "GS-DEMO-2026-0142",
  student: "Priya Sharma",
  course: "Java Full Stack Development",
  issued: "Not yet issued",
  status: "Sample verification record for product demonstration",
} as const;
