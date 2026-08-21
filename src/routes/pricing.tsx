import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, HelpCircle } from "lucide-react";

import { AnimatedCard, StaggerContainer } from "@/components/animated-card";
import { AnimatedSection } from "@/components/animated-section";
import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Course Fees & Pricing | ${site.name}` },
      {
        name: "description",
        content:
          "Transparent pricing for GuideSoft IT training programs. EMI options available, merit scholarships, and placement assurance programs.",
      },
    ],
  }),
  component: Pricing,
});

const pricingPlans = [
  {
    name: "Standard Live",
    price: "₹28,000",
    description:
      "Perfect for students who want rigorous live training and hands-on project experience without placement commitments.",
    features: [
      "Live interactive classes (Zoom)",
      "Access to class recordings for 1 year",
      "2 Capstone projects with code review",
      "Standard doubt clearing support",
      "Course completion certificate",
      "Resume review template",
    ],
    cta: "Enroll Now",
    featured: false,
    link: "/contact",
  },
  {
    name: "Job-Ready Intensive",
    price: "₹42,000",
    badge: "Most Popular",
    description:
      "The complete career transformation package with dedicated mentorship and our full 6-stage placement program.",
    features: [
      "Everything in Standard Live, plus:",
      "1-on-1 industry mentorship sessions",
      "6 mock technical interviews",
      "Line-by-line resume & LinkedIn revamp",
      "Direct referrals to 250+ partner companies",
      "Dedicated placement manager",
      "Salary negotiation coaching",
    ],
    cta: "Apply for Intensive",
    featured: true,
    link: "/contact",
  },
  {
    name: "Placement Assurance",
    price: "₹55,000",
    description:
      "Our premium tier where we share the risk. If you complete the requirements and don't get placed, we refund your fee.",
    features: [
      "Everything in Job-Ready Intensive, plus:",
      "100% Fee Refund guarantee (if not placed in 6 months)",
      "Unlimited mock interviews until placed",
      "Priority referral queue for premium partners",
      "1-on-1 DSA & System Design tutoring",
      "Lifetime access to course material updates",
    ],
    cta: "Check Eligibility",
    featured: false,
    link: "/contact",
  },
];

const faqs = [
  {
    q: "Do you offer EMI or installment options?",
    a: "Yes. We offer 3-month and 6-month No-Cost EMI options through our partners (Bajaj Finserv, HDFC Kredx, and major credit cards). You can start learning for as low as ₹4,666/month.",
  },
  {
    q: "Are there any hidden charges?",
    a: "No. The fee covers training, materials, cloud lab access, project evaluations, and placement support. We do not charge any 'placement fee' or percentage of your salary after you get hired.",
  },
  {
    q: "How does the Placement Assurance refund work?",
    a: "If you enroll in the Placement Assurance tier, maintain 85% attendance, complete all assignments, and don't receive a valid job offer within 6 months of course completion, we refund 100% of your tuition fee. No hidden clauses.",
  },
];

function Pricing() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Badge className="mb-4 bg-primary/15 text-primary border-primary/30">
              Transparent Pricing
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Invest in a career, <span className="text-gradient">not just a certificate.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Straightforward pricing with zero hidden fees. Choose the level of support you need —
              from foundational training to guaranteed placement outcomes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* PRICING CARDS */}
      <Section>
        <StaggerContainer className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <AnimatedCard
              key={plan.name}
              className={`p-8 relative flex flex-col ${
                plan.featured
                  ? "border-primary/50 shadow-elevated bg-surface/80"
                  : "hover:border-border/80"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-display font-semibold text-foreground">{plan.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/ course</span>
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span
                        className={idx === 0 && plan.featured ? "font-medium text-foreground" : ""}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <Button
                  asChild
                  variant={plan.featured ? "default" : "outline"}
                  className={`w-full rounded-xl h-12 ${plan.featured ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <Link to={plan.link}>{plan.cta}</Link>
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      {/* PRICING FAQ */}
      <Section className="bg-surface/30">
        <SectionHeading
          eyebrow="Pricing FAQ"
          title="Common questions about fees and payments"
          centered
        />
        <StaggerContainer className="mt-12 max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <AnimatedCard key={i} className="p-6 flex gap-4">
              <HelpCircle className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </AnimatedCard>
          ))}
        </StaggerContainer>
      </Section>

      <CtaBand />
    </div>
  );
}
