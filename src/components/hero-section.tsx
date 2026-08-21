import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { CourseSearchDialog } from "@/components/course-search-dialog";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-28">
      <CourseSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Launch a new career in IT or enhance your skills
            </h1>

            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0">
              Build skills with courses, certificates, and degrees online from world-class
              universities and companies.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-md bg-primary hover:bg-primary/90 text-white"
                asChild
              >
                <Link to="/courses">Join for Free</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-md border-primary text-primary hover:bg-primary/5"
                onClick={() => setSearchOpen(true)}
              >
                Try GuideSoft for Business
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none mx-auto">
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] w-full">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=90"
                alt="Student learning online"
                className="absolute inset-0 w-full h-full object-cover rounded-full lg:rounded-tl-[100px] lg:rounded-br-[100px] lg:rounded-tr-none lg:rounded-bl-none shadow-xl border-4 border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logos Section */}
      <div className="mt-20 border-t border-border bg-surface py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-foreground mb-8">
            We collaborate with{" "}
            <span className="text-primary">300+ leading universities and companies</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Logos */}
            <div className="text-xl font-bold font-serif text-foreground">Google</div>
            <div className="text-xl font-bold font-serif text-foreground">IBM</div>
            <div className="text-xl font-bold font-serif text-foreground">Microsoft</div>
            <div className="text-xl font-bold font-serif text-foreground">Stanford</div>
            <div className="text-xl font-bold font-serif text-foreground">Meta</div>
            <div className="text-xl font-bold font-serif text-foreground">AWS</div>
          </div>
        </div>
      </div>
    </section>
  );
}
