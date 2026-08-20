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

export type InstructorProfile = {
  name: string;
  role: string;
  organization: string;
  avatar: string;
  bio: string;
  rating: number;
  studentsTaught: string;
  coursesCount: number;
};

export type CourseReview = {
  id: string;
  studentName: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
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
  instructorProfile?: InstructorProfile;
  modules: Module[];
  project: string;
  rating?: number;
  reviewsCount?: number;
  enrolledCount?: string;
  credentialType?: "Professional Certificate" | "Specialization" | "MasterTrack Pathway";
  partnerName?: string;
  skillsLearned?: string[];
  reviews?: CourseReview[];
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
    summary: "Build production-grade full-stack applications with Java 21, Spring Boot 3, REST APIs, React 18, and deploy on AWS Cloud with enterprise-level DevOps practices.",
    overview: "This comprehensive program is designed for aspiring full-stack engineers who want to master the complete Java ecosystem. You'll learn from industry practitioners who have built scalable systems at companies like TCS, Infosys, Wipro, and startups. The curriculum follows the same rigorous standards used by top software firms, with weekly live sessions, code reviews, and real-world capstone projects.",
    tools: ["Java 21","Spring Boot 3","PostgreSQL","React 18","TypeScript","Docker","AWS","GitHub Actions","Redis","Kafka"],
    prerequisites: ["Basic programming fundamentals (any language)","Understanding of HTML and CSS","Familiarity with command line tools","A laptop with minimum 8GB RAM"],
    outcomes: ["Land a Full Stack Java Developer role (avg. ₹6-12 LPA fresher)","Build a portfolio with 5+ production-level projects","Receive placement support with 200+ partner companies","Get a verified GuideSoft IT Professional Certificate","Access alumni network of 15,000+ placed developers"],
    instructor: "Rajesh Kumar Sharma",
    rating: 4.8,
    reviewsCount: 3847,
    enrolledCount: "18,500+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },
  {
    slug: "python-full-stack-and-generative-ai",
    title: "Python Full Stack & Generative AI Engineering",
    shortTitle: "Python & GenAI",
    category: "Data & AI",
    level: "Intermediate",
    duration: "20 weeks",
    format: "Live online",
    price: "₹55,000",
    accent: "violet",
    summary: "Master Python from fundamentals to GenAI: build RAG pipelines, fine-tune LLMs, deploy production AI applications, and engineer autonomous AI agents using LangChain, LlamaIndex, and FastAPI.",
    overview: "The most comprehensive Python-to-GenAI program in India, designed for the era of AI-first software. You'll master Python engineering, data science fundamentals, and cutting-edge generative AI techniques. By the end, you'll have built production-ready AI applications including a personal LLM assistant, RAG document system, and autonomous agent.",
    tools: ["Python 3.12","LangChain","LlamaIndex","PyTorch","FastAPI","Pinecone","AWS Lambda","OpenAI API","Hugging Face","Docker"],
    prerequisites: ["Basic programming knowledge (any language)","High school level mathematics","Curiosity about AI and machine learning","Laptop with 16GB RAM recommended for local LLM inference"],
    outcomes: ["Land AI/ML Engineer roles (avg. ₹12-25 LPA)","Build production GenAI applications and agents","Work with cutting-edge LLM technologies","Get verified as a GuideSoft Certified AI Engineer","Access exclusive GenAI job placement network"],
    instructor: "Dr. Kavitha Subramaniam",
    rating: 4.9,
    reviewsCount: 2943,
    enrolledCount: "14,200+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },
  {
    slug: "aws-cloud-and-devops",
    title: "AWS Cloud & DevOps Engineering",
    shortTitle: "AWS Cloud & DevOps",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "18 weeks",
    format: "Live online",
    price: "₹42,000",
    accent: "lime",
    summary: "Achieve AWS certification readiness while mastering real-world DevOps: Terraform IaC, Kubernetes orchestration, CI/CD pipelines, cloud security, and cost optimization for enterprise workloads.",
    overview: "The most in-demand skill combination in the Indian IT market: AWS Cloud + DevOps Engineering. This program combines certification preparation (AWS SAA-C03, AWS-DVA-C02) with hands-on lab experience building and managing production cloud infrastructure. You'll work on real enterprise scenarios with 40+ AWS services.",
    tools: ["AWS","Terraform","Kubernetes","Docker","GitHub Actions","Jenkins","Ansible","Python","Bash","Prometheus"],
    prerequisites: ["Basic Linux/command line familiarity","Understanding of networking concepts (TCP/IP, DNS, HTTP)","Any programming experience helpful but not mandatory"],
    outcomes: ["Pass AWS Solutions Architect Associate (SAA-C03) exam","Land Cloud/DevOps Engineer roles (avg. ₹8-18 LPA)","Build a cloud portfolio with enterprise-grade projects","Get GuideSoft Certified Cloud & DevOps Engineer credential"],
    instructor: "Ramana Murthy Vangala",
    rating: 4.8,
    reviewsCount: 2156,
    enrolledCount: "11,800+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },
  {
    slug: "data-science-and-machine-learning",
    title: "Data Science & Machine Learning",
    shortTitle: "Data Science & ML",
    category: "Data & AI",
    level: "Beginner",
    duration: "20 weeks",
    format: "Live online",
    price: "₹45,000",
    accent: "amber",
    summary: "Go from zero to Data Scientist: Python, SQL, statistics, ML algorithms, deep learning, NLP, and deploying models to production — with real business datasets from Indian industries.",
    overview: "India's most comprehensive Data Science bootcamp, taught by practitioners who've built data products at Flipkart, Ola, and HDFC Bank. You'll work with real datasets from e-commerce, fintech, and healthcare sectors, and learn to communicate data insights to business stakeholders.",
    tools: ["Python","Pandas","scikit-learn","TensorFlow","SQL","Tableau","Spark","FastAPI","Streamlit","Apache Airflow"],
    prerequisites: ["No prior programming experience required","Basic algebra and statistics helpful","Eagerness to work with data"],
    outcomes: ["Land Data Analyst or Junior Data Scientist roles (avg. ₹6-14 LPA)","Build a portfolio of 8+ data science projects","Get hands-on experience with Indian industry datasets","Receive GuideSoft Certified Data Scientist credential"],
    instructor: "Pradeep Ganguly",
    rating: 4.7,
    reviewsCount: 3214,
    enrolledCount: "22,400+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },
  {
    slug: "selenium-and-api-testing-automation",
    title: "Selenium & API Testing Automation (SDET)",
    shortTitle: "SDET & Test Automation",
    category: "Testing",
    level: "Intermediate",
    duration: "16 weeks",
    format: "Live online",
    price: "₹38,000",
    accent: "rose",
    summary: "Become an SDET (Software Development Engineer in Test) — master Selenium WebDriver, RestAssured API testing, Playwright, CI/CD integration, performance testing with JMeter, and build complete test automation frameworks.",
    overview: "The most comprehensive SDET training program in India, covering the complete modern QA toolkit. You'll learn to build robust test automation frameworks from scratch using industry best practices like Page Object Model, BDD with Cucumber, and integrate them into CI/CD pipelines.",
    tools: ["Selenium 4","Java","TestNG","RestAssured","Playwright","JMeter","Cucumber","Postman","GitHub Actions","JIRA"],
    prerequisites: ["Basic Java or Python programming knowledge","Understanding of web technologies (HTML, CSS, HTTP)","Familiarity with software testing concepts"],
    outcomes: ["Land SDET or QA Automation Engineer roles (avg. ₹5-12 LPA)","Build complete test automation frameworks used in production","Get certified as GuideSoft QA Automation Specialist","Work with the industry's most in-demand testing tools"],
    instructor: "Narasimha Rao Paluri",
    rating: 4.8,
    reviewsCount: 1892,
    enrolledCount: "9,800+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
  },
  {
    slug: "react-and-nextjs-frontend-development",
    title: "React & Next.js Frontend Development",
    shortTitle: "React & Next.js",
    category: "Software Development",
    level: "Beginner",
    duration: "14 weeks",
    format: "Live online",
    price: "₹35,000",
    accent: "blue",
    summary: "Master modern frontend engineering: React 18, Next.js 14, TypeScript, Tailwind CSS, state management, performance optimization, and deploy production applications with Vercel and AWS.",
    overview: "The definitive React and Next.js program for aspiring frontend engineers. You'll build real-world applications including a SaaS dashboard, e-commerce storefront, and a blog platform — all production-deployed and portfolio-ready.",
    tools: ["React 18","Next.js 14","TypeScript","Tailwind CSS","Zustand","React Query","Prisma","PostgreSQL","Vercel","Playwright"],
    prerequisites: ["Understanding of HTML, CSS, and JavaScript basics","Completion of GuideSoft HTML/CSS Fundamentals (or equivalent)","A laptop capable of running Node.js 18+"],
    outcomes: ["Land Frontend Developer or React Engineer roles (avg. ₹5-10 LPA)","Build 5+ production-deployed portfolio projects","Master the most in-demand frontend stack in the Indian job market","Get GuideSoft Certified Frontend Developer credential"],
    instructor: "Swathi Rao Pulluru",
    rating: 4.8,
    reviewsCount: 2876,
    enrolledCount: "16,300+",
    modules: [
      module("Foundation & Core Concepts", "Understanding the basic principles and environment setup.", "Setup local environment and run first program."),
      module("Deep Dive & Best Practices", "Advanced techniques and industry standard patterns.", "Refactor previous code to use advanced patterns."),
      module("Architecture & Scale", "Building for production, performance and security.", "Deploy the application to a cloud provider.")
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production."
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
  },
  {
    slug: "what-makes-a-useful-portfolio-project",
    title: "What makes a portfolio project useful?",
    category: "Learning Resources",
    date: "06 Aug 2026",
    excerpt:
      "A project becomes evidence when you can explain the decisions, trade-offs and results behind it.",
  },
  {
    slug: "getting-started-with-api-testing",
    title: "Getting started with API testing",
    category: "Testing",
    date: "28 Jul 2026",
    excerpt: "Understand requests, assertions and the questions a good API check should answer.",
  },
  {
    slug: "a-better-way-to-learn-cloud",
    title: "A better way to learn cloud foundations",
    category: "Cloud",
    date: "19 Jul 2026",
    excerpt:
      "Start with systems and constraints, then add services. The vocabulary sticks when the why is clear.",
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

export const certificates = [
  {
    id: "GS-2026-0142",
    student: "Priya Sharma",
    course: "Java Full Stack Development",
    issued: "18 Jun 2026",
    status: "Verified & Issued by GuideSoft IT Academic Council",
  },
  {
    id: "GS-2026-0157",
    student: "Rahul Verma",
    course: "Data Science with Python",
    issued: "02 Jul 2026",
    status: "Verified & Issued by GuideSoft IT Academic Council",
  },
  {
    id: "GS-2026-0163",
    student: "Sneha Reddy",
    course: "UI/UX Product Design",
    issued: "24 Jul 2026",
    status: "Verified & Issued by GuideSoft IT Academic Council",
  },
  {
    id: "GS-2026-0171",
    student: "Arun Kumar",
    course: "AWS Cloud & DevOps",
    issued: "05 Aug 2026",
    status: "Verified & Issued by GuideSoft IT Academic Council",
  },
] as const;

export const certificate = certificates[0];
