"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ClosingCTA() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitted");
  };

  return (
    <section id="closing" className="relative flex min-h-[70vh] w-full flex-col items-start justify-center overflow-hidden border-t border-white/10 px-6 py-24 sm:px-12 lg:px-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, #5b8def22 0%, transparent 70%)" }}
      />
      <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display relative z-10 text-sm uppercase tracking-[0.2em] text-accent">
        AXIS-7 / Reserve a unit
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display relative z-10 mt-5 max-w-2xl text-4xl leading-[1.1] text-foreground sm:text-6xl">
        The map is only as good as the machine that made it.
      </motion.h2>

      {status === "idle" ? (
        <form onSubmit={handleSubmit} className="pointer-events-auto relative z-10 mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            required
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-full border border-white/15 bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button type="submit" className="whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
            Join the waitlist
          </button>
        </form>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 mt-10 text-sm text-accent-2">
          You're on the list — we'll be in touch.
        </motion.p>
      )}

    </section>
  );
}