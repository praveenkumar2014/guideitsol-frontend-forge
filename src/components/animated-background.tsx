import { memo } from "react";

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Dynamic ambient gradient orbs */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/15 via-highlight/5 to-transparent blur-[120px] animate-pulse" />
      <div
        className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-accent/20 via-primary/10 to-transparent blur-[140px]"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-highlight/10 via-primary/10 to-transparent blur-[150px]"
        style={{ animationDuration: "12s" }}
      />

      {/* Modern fine grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
});
