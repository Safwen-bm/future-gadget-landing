"use client";

import { motion, type Variants } from "framer-motion";

const specs = [
  { label: "Flight time", value: "47 min" },
  { label: "Range", value: "12 km" },
  { label: "Weight", value: "890 g" },
  { label: "Max altitude", value: "4,800 m" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col overflow-hidden lg:flex-row lg:items-center"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #edeae3 1px, transparent 1px), linear-gradient(to bottom, #edeae3 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-5 w-full bg-linear-to-r from-background via-background/85 to-transparent lg:w-[62%]" />
      <div
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[70vh] w-[70vh] -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, #5b8def33 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-center px-6 pt-24 sm:px-12 lg:w-[48%] lg:px-16 lg:pt-20">
        <motion.p
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="font-display text-sm uppercase tracking-[0.2em] text-accent"
        >
          Concept 001 / Autonomous Flight
        </motion.p>
        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="font-display mt-4 max-w-lg text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl"
        >
          AXIS-7 maps terrain no one has{" "}
          <span className="text-gradient">walked yet</span>.
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-4 max-w-sm text-base leading-relaxed text-muted"
        >
          A recon drone built to fly itself: it reads the terrain, plots its own
          path, and returns with a map you can trust.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="pointer-events-auto mt-6 flex items-center gap-5"
        >
          <button className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-background shadow-[0_0_24px_-4px_var(--accent)] transition-transform hover:scale-[1.03] hover:opacity-90">
            Request early access
          </button>
          <a
            href="#features"
            className="text-sm font-medium text-foreground underline decoration-muted underline-offset-4 transition-colors hover:decoration-accent"
          >
            See specs
          </a>
        </motion.div>
        <motion.dl
          initial="hidden"
          animate="show"
          custom={4}
          variants={fadeUp}
          className="mt-8 grid max-w-md grid-cols-4 border-t border-white/10 pt-4"
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="border-l border-white/10 pl-3 first:border-l-0 first:pl-0"
            >
              <dt className="text-xs text-muted">{spec.label}</dt>
              <dd className="font-display mt-1 text-base text-foreground">
                {spec.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <div className="pointer-events-none absolute inset-6 z-10">
          <span className="absolute left-0 top-0 h-8 w-8 border-l border-t border-accent/40" />
          <span className="absolute right-0 top-0 h-8 w-8 border-r border-t border-accent/40" />
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-accent/40" />
          <span className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-accent/40" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px animate-pulse bg-linear-to-b from-accent to-transparent" />
      </motion.div>
    </section>
  );
}
