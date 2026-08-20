export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type LearningMode = "Live online" | "Classroom" | "Hybrid" | "Self-paced";

export type Batch = {
  id: string;
  courseSlug: string;
  name: string;
  start: string;
  end: string;
  days: string;
  time: string;
  seats: number;
  available: number;
  mode: string;
  instructor: string;
  status: string;
  price: string;
};

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
  image?: string;
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

export const roles = [
  { name: "Data Analyst", icon: "BarChart3", courseCount: 4, color: "blue" },
  { name: "Project Manager", icon: "ClipboardList", courseCount: 3, color: "green" },
  { name: "Cyber Security Analyst", icon: "ShieldCheck", courseCount: 3, color: "red" },
  { name: "Data Scientist", icon: "BrainCircuit", courseCount: 5, color: "violet" },
  { name: "Business Intelligence Analyst", icon: "PieChart", courseCount: 3, color: "amber" },
  { name: "Digital Marketing Specialist", icon: "Megaphone", courseCount: 4, color: "orange" },
  { name: "UI / UX Designer", icon: "Palette", courseCount: 4, color: "pink" },
  { name: "Machine Learning Engineer", icon: "Cpu", courseCount: 5, color: "cyan" },
  { name: "Social Media Specialist", icon: "Share2", courseCount: 2, color: "indigo" },
  { name: "Computer Support Specialist", icon: "MonitorCheck", courseCount: 3, color: "teal" },
] as const;

export const exploreCategories = [
  { name: "Artificial Intelligence", icon: "BrainCircuit", courseCount: 12, color: "violet" },
  { name: "Business", icon: "Briefcase", courseCount: 9, color: "green" },
  { name: "Data Science", icon: "BarChart3", courseCount: 8, color: "blue" },
  { name: "Information Technology", icon: "Server", courseCount: 10, color: "cyan" },
  { name: "Computer Science", icon: "Code2", courseCount: 14, color: "indigo" },
  { name: "Healthcare", icon: "HeartPulse", courseCount: 4, color: "rose" },
  { name: "Physical Science and Engineering", icon: "Atom", courseCount: 5, color: "amber" },
  { name: "Personal Development", icon: "Rocket", courseCount: 6, color: "orange" },
  { name: "Social Sciences", icon: "Users", courseCount: 3, color: "teal" },
  { name: "Language Learning", icon: "Languages", courseCount: 2, color: "pink" },
  { name: "Arts and Humanities", icon: "Paintbrush", courseCount: 3, color: "fuchsia" },
] as const;

export const trendingSkills = [
  { name: "Python", courseCount: 18, color: "blue" },
  { name: "Artificial Intelligence", courseCount: 12, color: "violet" },
  { name: "Excel", courseCount: 8, color: "green" },
  { name: "Machine Learning", courseCount: 10, color: "cyan" },
  { name: "SQL", courseCount: 14, color: "amber" },
  { name: "Project Management", courseCount: 7, color: "orange" },
  { name: "Power BI", courseCount: 5, color: "yellow" },
  { name: "Marketing", courseCount: 6, color: "pink" },
] as const;

export const professionalCertificates = [
  {
    name: "Business",
    icon: "Briefcase",
    certificates: [
      "Google Project Management",
      "Business Analytics",
      "Digital Marketing",
      "Agile Project Management",
    ],
  },
  {
    name: "Computer Science",
    icon: "Monitor",
    certificates: [
      "Google IT Support",
      "Full Stack Web Development",
      "Cybersecurity",
      "IT Automation with Python",
    ],
  },
  {
    name: "Data Science",
    icon: "BarChart3",
    certificates: [
      "Google Data Analytics",
      "IBM Data Science",
      "Advanced Data Science",
      "Data Engineering",
    ],
  },
  {
    name: "Information Technology",
    icon: "Server",
    certificates: [
      "Google IT Support",
      "AWS Cloud Solutions",
      "System Administration",
      "Network Engineering",
    ],
  },
] as const;

export const degreePrograms = [
  {
    category: "Bachelor's Degrees",
    degrees: [
      "B.Sc. Computer Science",
      "BBA Digital Marketing",
      "B.Sc. Data Science",
      "B.Tech Information Technology",
    ],
  },
  {
    category: "Master's Degrees",
    degrees: [
      "M.Sc. Artificial Intelligence",
      "MBA Business Analytics",
      "M.Sc. Data Science",
      "M.Tech Cloud Computing",
    ],
  },
  {
    category: "University Certificates",
    degrees: [
      "Data Science Professional Certificate",
      "AI & Machine Learning Certificate",
      "Cloud Architecture Certificate",
      "Cybersecurity Certificate",
    ],
  },
] as const;

export const certificationExams = [
  {
    name: "AWS Solutions Architect",
    provider: "Amazon Web Services",
    code: "SAA-C03",
    color: "amber",
  },
  { name: "Google Cloud Professional", provider: "Google Cloud", code: "PCA", color: "blue" },
  { name: "Certified Kubernetes Admin", provider: "CNCF", code: "CKA", color: "violet" },
  { name: "PMP Certification", provider: "PMI", code: "PMP", color: "green" },
  { name: "CompTIA Security+", provider: "CompTIA", code: "SY0-701", color: "red" },
  { name: "Microsoft Azure Fundamentals", provider: "Microsoft", code: "AZ-900", color: "cyan" },
  { name: "TensorFlow Developer Certificate", provider: "Google", code: "TFDev", color: "orange" },
  { name: "Certified Scrum Master", provider: "Scrum Alliance", code: "CSM", color: "teal" },
] as const;

export const courses: Course[] = [
  {
    slug: "java-full-stack-development",
    title: "Java Full Stack Development",
    shortTitle: "Java Full Stack",
    category: "Software Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    level: "Intermediate",
    duration: "24 weeks",
    format: "Live online",
    price: "₹48,000",
    accent: "cyan",
    summary:
      "Build production-grade full-stack applications with Java 21, Spring Boot 3, REST APIs, React 18, and deploy on AWS Cloud with enterprise-level DevOps practices.",
    overview:
      "This comprehensive program is designed for aspiring full-stack engineers who want to master the complete Java ecosystem. You'll learn from industry practitioners who have built scalable systems at companies like TCS, Infosys, Wipro, and startups. The curriculum follows the same rigorous standards used by top software firms, with weekly live sessions, code reviews, and real-world capstone projects.",
    tools: [
      "Java 21",
      "Spring Boot 3",
      "PostgreSQL",
      "React 18",
      "TypeScript",
      "Docker",
      "AWS",
      "GitHub Actions",
      "Redis",
      "Kafka",
    ],
    prerequisites: [
      "Basic programming fundamentals (any language)",
      "Understanding of HTML and CSS",
      "Familiarity with command line tools",
      "A laptop with minimum 8GB RAM",
    ],
    outcomes: [
      "Land a Full Stack Java Developer role (avg. ₹6-12 LPA fresher)",
      "Build a portfolio with 5+ production-level projects",
      "Receive placement support with 200+ partner companies",
      "Get a verified GuideSoft IT Professional Certificate",
      "Access alumni network of 15,000+ placed developers",
    ],
    instructor: "Rajesh Kumar Sharma",
    instructorProfile: {
      name: "Rajesh Kumar Sharma",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "Rajesh Kumar Sharma is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.8,
    reviewsCount: 3847,
    enrolledCount: "18,500+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "python-full-stack-and-generative-ai",
    title: "Python Full Stack & Generative AI Engineering",
    shortTitle: "Python & GenAI",
    category: "Data & AI",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    level: "Intermediate",
    duration: "20 weeks",
    format: "Live online",
    price: "₹55,000",
    accent: "violet",
    summary:
      "Master Python from fundamentals to GenAI: build RAG pipelines, fine-tune LLMs, deploy production AI applications, and engineer autonomous AI agents using LangChain, LlamaIndex, and FastAPI.",
    overview:
      "The most comprehensive Python-to-GenAI program in India, designed for the era of AI-first software. You'll master Python engineering, data science fundamentals, and cutting-edge generative AI techniques. By the end, you'll have built production-ready AI applications including a personal LLM assistant, RAG document system, and autonomous agent.",
    tools: [
      "Python 3.12",
      "LangChain",
      "LlamaIndex",
      "PyTorch",
      "FastAPI",
      "Pinecone",
      "AWS Lambda",
      "OpenAI API",
      "Hugging Face",
      "Docker",
    ],
    prerequisites: [
      "Basic programming knowledge (any language)",
      "High school level mathematics",
      "Curiosity about AI and machine learning",
      "Laptop with 16GB RAM recommended for local LLM inference",
    ],
    outcomes: [
      "Land AI/ML Engineer roles (avg. ₹12-25 LPA)",
      "Build production GenAI applications and agents",
      "Work with cutting-edge LLM technologies",
      "Get verified as a GuideSoft Certified AI Engineer",
      "Access exclusive GenAI job placement network",
    ],
    instructor: "Dr. Kavitha Subramaniam",
    instructorProfile: {
      name: "Dr. Kavitha Subramaniam",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      bio: "Dr. Kavitha Subramaniam is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.9,
    reviewsCount: 2943,
    enrolledCount: "14,200+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "aws-cloud-and-devops",
    title: "AWS Cloud & DevOps Engineering",
    shortTitle: "AWS Cloud & DevOps",
    category: "Cloud & DevOps",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    level: "Intermediate",
    duration: "18 weeks",
    format: "Live online",
    price: "₹42,000",
    accent: "lime",
    summary:
      "Achieve AWS certification readiness while mastering real-world DevOps: Terraform IaC, Kubernetes orchestration, CI/CD pipelines, cloud security, and cost optimization for enterprise workloads.",
    overview:
      "The most in-demand skill combination in the Indian IT market: AWS Cloud + DevOps Engineering. This program combines certification preparation (AWS SAA-C03, AWS-DVA-C02) with hands-on lab experience building and managing production cloud infrastructure. You'll work on real enterprise scenarios with 40+ AWS services.",
    tools: [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Docker",
      "GitHub Actions",
      "Jenkins",
      "Ansible",
      "Python",
      "Bash",
      "Prometheus",
    ],
    prerequisites: [
      "Basic Linux/command line familiarity",
      "Understanding of networking concepts (TCP/IP, DNS, HTTP)",
      "Any programming experience helpful but not mandatory",
    ],
    outcomes: [
      "Pass AWS Solutions Architect Associate (SAA-C03) exam",
      "Land Cloud/DevOps Engineer roles (avg. ₹8-18 LPA)",
      "Build a cloud portfolio with enterprise-grade projects",
      "Get GuideSoft Certified Cloud & DevOps Engineer credential",
    ],
    instructor: "Ramana Murthy Vangala",
    instructorProfile: {
      name: "Ramana Murthy Vangala",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Ramana Murthy Vangala is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.8,
    reviewsCount: 2156,
    enrolledCount: "11,800+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "data-science-and-machine-learning",
    title: "Data Science & Machine Learning",
    shortTitle: "Data Science & ML",
    category: "Data & AI",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
    level: "Beginner",
    duration: "20 weeks",
    format: "Live online",
    price: "₹45,000",
    accent: "amber",
    summary:
      "Go from zero to Data Scientist: Python, SQL, statistics, ML algorithms, deep learning, NLP, and deploying models to production — with real business datasets from Indian industries.",
    overview:
      "India's most comprehensive Data Science bootcamp, taught by practitioners who've built data products at Flipkart, Ola, and HDFC Bank. You'll work with real datasets from e-commerce, fintech, and healthcare sectors, and learn to communicate data insights to business stakeholders.",
    tools: [
      "Python",
      "Pandas",
      "scikit-learn",
      "TensorFlow",
      "SQL",
      "Tableau",
      "Spark",
      "FastAPI",
      "Streamlit",
      "Apache Airflow",
    ],
    prerequisites: [
      "No prior programming experience required",
      "Basic algebra and statistics helpful",
      "Eagerness to work with data",
    ],
    outcomes: [
      "Land Data Analyst or Junior Data Scientist roles (avg. ₹6-14 LPA)",
      "Build a portfolio of 8+ data science projects",
      "Get hands-on experience with Indian industry datasets",
      "Receive GuideSoft Certified Data Scientist credential",
    ],
    instructor: "Pradeep Ganguly",
    instructorProfile: {
      name: "Pradeep Ganguly",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Pradeep Ganguly is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.7,
    reviewsCount: 3214,
    enrolledCount: "22,400+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "selenium-and-api-testing-automation",
    title: "Selenium & API Testing Automation (SDET)",
    shortTitle: "SDET & Test Automation",
    category: "Testing",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    level: "Intermediate",
    duration: "16 weeks",
    format: "Live online",
    price: "₹38,000",
    accent: "rose",
    summary:
      "Become an SDET (Software Development Engineer in Test) — master Selenium WebDriver, RestAssured API testing, Playwright, CI/CD integration, performance testing with JMeter, and build complete test automation frameworks.",
    overview:
      "The most comprehensive SDET training program in India, covering the complete modern QA toolkit. You'll learn to build robust test automation frameworks from scratch using industry best practices like Page Object Model, BDD with Cucumber, and integrate them into CI/CD pipelines.",
    tools: [
      "Selenium 4",
      "Java",
      "TestNG",
      "RestAssured",
      "Playwright",
      "JMeter",
      "Cucumber",
      "Postman",
      "GitHub Actions",
      "JIRA",
    ],
    prerequisites: [
      "Basic Java or Python programming knowledge",
      "Understanding of web technologies (HTML, CSS, HTTP)",
      "Familiarity with software testing concepts",
    ],
    outcomes: [
      "Land SDET or QA Automation Engineer roles (avg. ₹5-12 LPA)",
      "Build complete test automation frameworks used in production",
      "Get certified as GuideSoft QA Automation Specialist",
      "Work with the industry's most in-demand testing tools",
    ],
    instructor: "Narasimha Rao Paluri",
    instructorProfile: {
      name: "Narasimha Rao Paluri",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
      bio: "Narasimha Rao Paluri is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.8,
    reviewsCount: 1892,
    enrolledCount: "9,800+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "ui-ux-product-design",
    title: "UI/UX Product Design",
    shortTitle: "UI/UX Design",
    category: "UI/UX & Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    level: "Beginner",
    duration: "12 weeks",
    format: "Live online",
    price: "₹28,000",
    accent: "violet",
    summary:
      "Master user experience research, interface design with Figma, prototyping, design systems, usability testing, and build a professional UX portfolio with real-world case studies.",
    overview:
      "The most practical UI/UX design program in India, taught by designers who've shipped products at top Indian startups and enterprises. You'll learn the complete product design process from research to high-fidelity prototypes, with weekly critiques and portfolio reviews.",
    tools: [
      "Figma",
      "Adobe XD",
      "Miro",
      "FigJam",
      "Protopie",
      "Maze",
      "Hotjar",
      "Notion",
      "Illustrator",
      "Framer",
    ],
    prerequisites: [
      "No prior design experience required",
      "A creative mindset and willingness to learn",
      "Basic computer literacy",
      "Laptop with Figma installed (free)",
    ],
    outcomes: [
      "Land UI/UX Designer roles (avg. ₹5-10 LPA fresher)",
      "Build a professional UX portfolio with 4+ case studies",
      "Master the industry-standard design tool (Figma)",
      "Get GuideSoft Certified Product Designer credential",
    ],
    instructor: "Kavya Thomas",
    instructorProfile: {
      name: "Kavya Thomas",
      role: "Senior Design Lead",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      bio: "Kavya Thomas is a design leader with over 10 years of experience crafting user-centered products. They have mentored hundreds of designers and led design systems at scale.",
      rating: 4.9,
      studentsTaught: "8,000+",
      coursesCount: 2,
    },
    rating: 4.9,
    reviewsCount: 1654,
    enrolledCount: "9,200+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup Figma and complete first wireframe exercise.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Design a complete mobile app flow from research to prototype.",
      ),
      module(
        "Portfolio & Career Launch",
        "Building your design portfolio and preparing for interviews.",
        "Create a polished case study and present it to peers.",
      ),
    ],
    project:
      "End-to-end UX case study: research, wireframes, prototyping, usability testing, and portfolio presentation.",
  },
  {
    slug: "react-and-nextjs-frontend-development",
    title: "React & Next.js Frontend Development",
    shortTitle: "React & Next.js",
    category: "Software Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    level: "Beginner",
    duration: "14 weeks",
    format: "Live online",
    price: "₹35,000",
    accent: "blue",
    summary:
      "Master modern frontend engineering: React 18, Next.js 14, TypeScript, Tailwind CSS, state management, performance optimization, and deploy production applications with Vercel and AWS.",
    overview:
      "The definitive React and Next.js program for aspiring frontend engineers. You'll build real-world applications including a SaaS dashboard, e-commerce storefront, and a blog platform — all production-deployed and portfolio-ready.",
    tools: [
      "React 18",
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "React Query",
      "Prisma",
      "PostgreSQL",
      "Vercel",
      "Playwright",
    ],
    prerequisites: [
      "Understanding of HTML, CSS, and JavaScript basics",
      "Completion of GuideSoft HTML/CSS Fundamentals (or equivalent)",
      "A laptop capable of running Node.js 18+",
    ],
    outcomes: [
      "Land Frontend Developer or React Engineer roles (avg. ₹5-10 LPA)",
      "Build 5+ production-deployed portfolio projects",
      "Master the most in-demand frontend stack in the Indian job market",
      "Get GuideSoft Certified Frontend Developer credential",
    ],
    instructor: "Swathi Rao Pulluru",
    instructorProfile: {
      name: "Swathi Rao Pulluru",
      role: "Senior Engineering Manager",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Swathi Rao Pulluru is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",
      rating: 4.8,
      studentsTaught: "15,000+",
      coursesCount: 3,
    },
    rating: 4.8,
    reviewsCount: 2876,
    enrolledCount: "16,300+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding the basic principles and environment setup.",
        "Setup local environment and run first program.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced techniques and industry standard patterns.",
        "Refactor previous code to use advanced patterns.",
      ),
      module(
        "Architecture & Scale",
        "Building for production, performance and security.",
        "Deploy the application to a cloud provider.",
      ),
    ],
    project: "Comprehensive capstone project involving all skills learned, deployed to production.",
  },
  {
    slug: "cyber-security-and-ethical-hacking",
    title: "Cyber Security, Ethical Hacking & SOC Defense",
    shortTitle: "Cyber Security",
    category: "Information Technology",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    level: "Intermediate",
    duration: "14 weeks",
    format: "Live online",
    price: "₹42,000",
    accent: "red",
    summary:
      "Master cybersecurity fundamentals: ethical hacking, SIEM operations with Splunk, network forensics, vulnerability assessments, and SOC incident response with hands-on cyber range labs.",
    overview:
      "The most practical cybersecurity training program in India, designed for aspiring SOC analysts and security engineers. You'll work on real threat scenarios in virtual cyber ranges and learn to defend enterprise infrastructure against advanced persistent threats.",
    tools: [
      "Splunk SIEM",
      "Wireshark",
      "Burp Suite",
      "Kali Linux",
      "Metasploit",
      "Nmap",
      "OWASP ZAP",
      "Snort",
      "Volatility",
      "Ghidra",
    ],
    prerequisites: [
      "Basic networking knowledge (TCP/IP, DNS, HTTP)",
      "Familiarity with Linux command line",
      "Understanding of operating systems",
      "Laptop with 8GB RAM minimum",
    ],
    outcomes: [
      "Land SOC Analyst or Cybersecurity Engineer roles (avg. ₹6-15 LPA)",
      "Master industry-standard security tools and frameworks",
      "Get GuideSoft Certified Cybersecurity Professional credential",
      "Build a portfolio of security audit reports and incident response playbooks",
    ],
    instructor: "Arjun Nair",
    instructorProfile: {
      name: "Arjun Nair",
      role: "Security Engineering Lead",
      organization: "GuideSoft IT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Arjun Nair is a cybersecurity expert with over 10 years of experience in enterprise security operations and threat intelligence.",
      rating: 4.8,
      studentsTaught: "6,000+",
      coursesCount: 2,
    },
    rating: 4.7,
    reviewsCount: 1432,
    enrolledCount: "7,800+",
    modules: [
      module(
        "Foundation & Core Concepts",
        "Understanding security fundamentals and setting up a safe lab environment.",
        "Configure Kali Linux and complete first vulnerability scan.",
      ),
      module(
        "Deep Dive & Best Practices",
        "Advanced penetration testing and SIEM operations.",
        "Conduct a full penetration test and create a security report.",
      ),
      module(
        "SOC Operations & Career Launch",
        "Building incident response skills and security portfolio.",
        "Complete a cyber range exercise and present findings.",
      ),
    ],
    project:
      "Enterprise SOC threat hunting simulation with incident response playbook and security audit report.",
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
    courseSlug: "python-full-stack-and-generative-ai",
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
    courseSlug: "data-science-and-machine-learning",
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
    courseSlug: "aws-cloud-and-devops",
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
    courseSlug: "ui-ux-product-design",
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
