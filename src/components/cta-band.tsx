import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function CtaBand({
  title = "Ready to scope your next release?",
  description = "Tell us what you are building. You'll get a costed delivery plan and a named team lead within three working days.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-panel hero-surface glow-elevated relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">Book a consultation</Link>
            </Button>
            <Button asChild variant="subtle" size="xl">
              <Link to="/pricing">See engagement models</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
