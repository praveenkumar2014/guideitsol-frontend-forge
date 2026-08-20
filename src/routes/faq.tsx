import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, MessageCircle, Search } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/data/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: `FAQ | ${site.name}` },
      {
        name: "description",
        content:
          "Frequently asked questions about GuideSoft IT training courses, fees, placements, batch schedules, EMI options, and certifications.",
      },
    ],
  }),
  component: FAQ,
});

const categories = ["All", "Admissions", "Curriculum", "Placements", "Fees & EMI", "Certificates", "Technical"];

const faqs = [
  {
    category: "Admissions",
    q: "Do I need prior coding experience to join GuideSoft IT?",
    a: "Most of our courses are designed for beginners. For Java Full Stack, Python GenAI, Data Science, and Frontend Development — no prior coding experience is needed. You only need basic computer literacy. For advanced courses like AWS DevOps and SDET, basic programming knowledge (any language) is helpful. We publish clear prerequisites on each course page so you can self-assess.",
  },
  {
    category: "Admissions",
    q: "What is the batch size, and how many students are in each live session?",
    a: "We cap live batches at 30 students to ensure every learner gets individual attention. Our instructor-to-student ratio during lab sessions is 1:10. This is non-negotiable — we've turned away enrollments to protect this standard. Larger cohorts may be split into parallel sections, each with a dedicated instructor.",
  },
  {
    category: "Admissions",
    q: "Can working professionals join? What are the timings?",
    a: "Absolutely. Approximately 35% of our students are working professionals switching careers or upskilling. Weekend batches run Saturday–Sunday (9 AM to 1 PM). Weekday evening batches run Monday–Friday (7 PM to 9 PM). Live recordings of every session are available for 7 days so you never miss content due to work commitments. We also have self-paced tracks for maximum flexibility.",
  },
  {
    category: "Admissions",
    q: "Is there a selection process or eligibility test?",
    a: "For most courses, enrollment is open — no entrance test required. For our Premium Intensive tracks (small batch, guaranteed placement), we conduct a 20-minute aptitude conversation to ensure you're a fit for the pace and commitment required. This is not a gatekeeping exercise — it's to set realistic expectations on both sides.",
  },
  {
    category: "Admissions",
    q: "Can students from outside Andhra Pradesh and Telangana join?",
    a: "Yes. Approximately 40% of our current students are from Maharashtra, Karnataka, Tamil Nadu, West Bengal, and other states. All courses are available online with the same live instruction quality. We have alumni placed from Mumbai, Bengaluru, Pune, Delhi, Chennai, and Hyderabad.",
  },
  {
    category: "Curriculum",
    q: "How is the GuideSoft curriculum different from online self-paced courses (Udemy, YouTube)?",
    a: "Self-paced platforms give you video content. We give you a complete career transformation system: live instruction with Q&A, weekly code reviews by industry engineers, structured assignments with feedback, capstone projects reviewed by hiring managers, dedicated placement support, and a community of 18,500+ alumni. You can't pause a job interview — we prepare you for real-time technical scenarios.",
  },
  {
    category: "Curriculum",
    q: "How frequently is the curriculum updated?",
    a: "Every quarter. Our curriculum committee — which includes active engineers from partner companies — reviews and updates course content based on hiring trends, new frameworks, and technology shifts. When React 19 or Java 25 releases, we update our material within 4-6 weeks. You never learn outdated content at GuideSoft.",
  },
  {
    category: "Curriculum",
    q: "What projects will I build during the course?",
    a: "Every course has a Capstone Project that mirrors real-world applications. For Java Full Stack: you build a multi-tenant e-commerce platform with microservices, payment integration (Razorpay), and AWS deployment. For Data Science: you build a customer churn prediction platform with a FastAPI model endpoint and Streamlit dashboard. These are production-level projects you can demo to interviewers, not toy CRUD applications.",
  },
  {
    category: "Curriculum",
    q: "Do you cover system design and DSA for product company interviews?",
    a: "Yes — especially in the final interview prep modules. We cover: LLD (Low-Level Design), HLD (High-Level Design), and 150+ curated DSA problems (organized by pattern, not just difficulty). Our placement data shows that 68% of GuideSoft students who clear technical rounds get offers from product companies (startups and mid-size). We also have a dedicated 4-week DSA intensive program.",
  },
  {
    category: "Placements",
    q: "What is GuideSoft's placement record?",
    a: "As of 2025: 12,400+ total placements, 98.2% course completion rate, average first-year CTC ₹8.4 LPA for freshers, average salary hike of 180% for career switchers. Our highest placement in 2024 was ₹38 LPA (FAANG-tier startup). We publish unfiltered placement data — including the distribution of salaries — not just cherry-picked toppers.",
  },
  {
    category: "Placements",
    q: "Does GuideSoft guarantee placement?",
    a: "We offer a 'Placement Assurance' program on select courses: if you complete the course, maintain 85%+ attendance, finish all projects, and participate in the mock interview program — and still don't receive a job offer within 6 months, we provide a full fee refund. This applies to Java Full Stack, AWS DevOps, Data Science, and SDET tracks.",
  },
  {
    category: "Placements",
    q: "What companies hire from GuideSoft IT?",
    a: "Our alumni are placed at 250+ companies including: Tata Consultancy Services, Infosys, Wipro, Cognizant, Capgemini, HCL Technologies, Accenture, Tech Mahindra, Mphasis, Amazon India, Microsoft India, Flipkart, Swiggy, Razorpay, Freshworks, and many AP/Hyderabad-based product companies and funded startups. Our placement team maintains active relationships with HR at each of these companies.",
  },
  {
    category: "Placements",
    q: "What does the placement support actually include?",
    a: "Placement support is a structured program, not vague 'networking': (1) 1-on-1 resume review with our placement team, (2) LinkedIn profile optimization, (3) GitHub portfolio review, (4) 6 mock technical interviews with real engineers, (5) HR round preparation, (6) Direct referrals to hiring managers at 250+ partner companies, (7) Salary negotiation coaching, and (8) Continued support until you are placed — not just 3 months.",
  },
  {
    category: "Fees & EMI",
    q: "What are the fee structures and payment options?",
    a: "Fees vary by course: ₹28,000–₹55,000. All fees are transparent — no hidden charges for placement services, materials, or certifications. Payment options: (1) Full payment upfront with 8% discount, (2) 3-month EMI (no interest, debit/credit card), (3) 6-month EMI via Bajaj Finserv or HDFC Kredx (nominal interest), (4) Income Share Agreement for eligible students (pay after placement). UPI, NEFT, and card payments accepted.",
  },
  {
    category: "Fees & EMI",
    q: "Are there any scholarships available?",
    a: "Yes. We offer: (1) Merit Scholarship — 20% fee waiver for students with 80%+ marks in their degree, (2) Women in Tech Scholarship — 15% fee waiver for women applicants, (3) Referral Discount — ₹2,500 credit per successful referral, (4) Early Bird Discount — 5% off for batch enrollment 30+ days in advance. All scholarships can be applied simultaneously where applicable.",
  },
  {
    category: "Fees & EMI",
    q: "Is there a free trial or introductory session before enrolling?",
    a: "Yes. Every course has a free 2-hour Introductory Live Session where you experience the actual teaching style, ask the instructor questions, and see a sample assignment. No registration required — just show up to the scheduled session. Check the Live Batches page for the next available intro session for your chosen course.",
  },
  {
    category: "Certificates",
    q: "What certificates does GuideSoft IT issue?",
    a: "Every course includes: (1) GuideSoft IT Completion Certificate (issued upon completing 80%+ sessions and all assignments), (2) GuideSoft Capstone Project Certificate (issued on project submission and evaluation), (3) Course-specific credentials (e.g., 'Certified Java Full Stack Engineer', 'Certified AWS & DevOps Engineer'). Certificates are digitally signed with a verifiable QR code that employers can verify at guideitsol.in/verify.",
  },
  {
    category: "Certificates",
    q: "Are GuideSoft certificates recognized by employers?",
    a: "Our certificates are recognized by all 250+ partner companies. However, we want to be direct: certificates support your candidacy, but your skills and portfolio are what actually get you hired. That's why we focus obsessively on real project quality and technical interview readiness — not just certificate issuance. Our alumni consistently report that interviewers are more impressed by their capstone projects than by the certificate itself.",
  },
  {
    category: "Certificates",
    q: "Do courses prepare me for external certifications like AWS, Google Cloud, or PMP?",
    a: "Yes, for technically aligned courses. AWS Cloud & DevOps includes targeted prep for AWS SAA-C03 and DVA-C02 certification exams. GuideSoft provides exam voucher support (discounted purchase) and access to our practice question bank. Our pass rate for AWS certifications among enrolled students is 94%. For Google Cloud, Kubernetes (CKA), and Terraform (HashiCorp Certified) — optional add-on prep modules are available.",
  },
  {
    category: "Technical",
    q: "What laptop or computer specification do I need?",
    a: "Minimum: Any laptop (Windows 10/11, macOS 11+, or Linux Ubuntu 20.04+) with 8GB RAM and an i5 / Ryzen 5 processor or better. For Data Science and GenAI courses, 16GB RAM is strongly recommended for running local ML experiments. For Flutter/Mobile development, a Mac is required for iOS compilation. We do not recommend Chromebooks for development-heavy courses.",
  },
  {
    category: "Technical",
    q: "Can I access sessions and materials offline?",
    a: "Live sessions require internet — typically a 4G connection or better (we target 5 Mbps minimum for HD video). Session recordings are available for download within 24 hours via our Student Portal. Course notes, code samples, and project boilerplate are available on a private GitHub repository accessible throughout your enrollment and for 2 years after graduation.",
  },
  {
    category: "Technical",
    q: "What tech stack does GuideSoft use for its own platform?",
    a: "Our learning platform is built with React 18, TanStack Router, TypeScript, and Tailwind CSS on the frontend; Python FastAPI and PostgreSQL on the backend; deployed on AWS ECS with GitHub Actions CI/CD. We use this stack in our courses because we build with it ourselves — giving us first-hand insight into real-world challenges students will face.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch =
      search.trim() === "" ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="border-b border-border bg-surface/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              {faqs.length} Questions Answered
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-lg">
              Everything you want to know about GuideSoft IT courses, fees, placements, and certifications — answered honestly.
            </p>

            {/* Search */}
            <div className="mt-8 relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="faq-search"
                placeholder="Search questions…"
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Section>
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl space-y-3">
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No questions match your search. Try different keywords.
            </p>
          )}
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={`${faq.q}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="surface-panel rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-surface/50 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="shrink-0 text-xs mt-0.5">
                      {faq.category}
                    </Badge>
                    <span className="font-medium text-foreground text-sm">{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-16 max-w-3xl surface-panel rounded-2xl p-8 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-primary mb-3" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Still have questions?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Our counsellors respond within 2 hours (Mon–Sat, 9 AM – 7 PM IST).
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <EnquiryDialog courseName="General Enquiry">
              <Button id="faq-enquiry-btn" className="rounded-xl">
                Talk to a Counsellor
              </Button>
            </EnquiryDialog>
            <Button variant="outline" className="rounded-xl" asChild>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>Call {site.phone}</a>
            </Button>
          </div>
        </div>
      </Section>

      <CtaBand />
    </div>
  );
}
