import { createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Quote } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies, process, services, site, stats, testimonials } from "@/data/site";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} | Product engineering, without the theatre` },
      { name: "description", content: site.tagline },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <>
      <section className="hero-surface relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="grid-lines absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Bengaluru · India · Remote-ready
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Build the thing your business is waiting for.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {site.tagline} We pair product thinking with senior engineering to take ambitious
              ideas from first sketch to reliable scale.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact" className="text-primary">
                  Book a consultation <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="subtle" size="xl">
                <Link to="/work" className="text-primary">
                  See our work
                </Link>
              </Button>
            </div>
          </div>
          <div className="surface-panel self-end rounded-2xl p-6 lg:mb-4">
            <p className="text-sm font-semibold text-primary">A better delivery rhythm</p>
            <p className="mt-5 text-2xl font-semibold leading-tight">
              Discovery that earns its keep. Delivery you can see.
            </p>
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              {[
                "A named team lead from day one",
                "Working software every two weeks",
                "Your code, cloud and design files",
              ].map((item) => (
                <p key={item} className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-gradient">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="What we do"
          title="A senior team for the moments that matter."
          description="From a focused MVP to a platform carrying millions of transactions, we bring the product, design and engineering muscle to make it real."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <a
              key={service.slug}
              href={
                service.slug === "web-development" || service.slug === "mobile-apps"
                  ? `/${service.slug}`
                  : `/services#${service.slug}`
              }
              className="surface-panel group rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-semibold text-primary">0{index + 1}</p>
              <h3 className="mt-8 text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Explore{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How we work" title="Clear steps. No theatre." />
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {process.map((item) => (
            <div key={item.step} className="border-t border-primary pt-5">
              <p className="text-sm font-semibold text-primary">{item.step}</p>
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="Selected work" title="Outcomes beat output." />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <div key={study.slug} className="surface-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {study.sector}
              </p>
              <h3 className="mt-8 text-xl font-semibold">{study.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.body}</p>
              <p className="mt-8 font-display text-2xl font-semibold">{study.result}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="border-l-2 border-primary pl-5">
              <Quote className="h-5 w-5 text-primary" />
              <blockquote className="mt-4 text-lg leading-relaxed">{testimonial.quote}</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                {testimonial.name} · {testimonial.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
