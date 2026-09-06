"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";

const links = [
  { href: "#hero", id: "hero", label: "AXIS-7" },
  { href: "#features", id: "features", label: "Features" },
  { href: "#explore", id: "explore", label: "Explore" },
  { href: "#closing", id: "closing", label: "Reserve" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const sectionIds = links.slice(1).map((l) => l.id);
    let raf = 0;
    const compute = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const viewportCenter = window.innerHeight / 2;
      let best = "hero";
      let bestDist = Infinity;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + Math.min(rect.height, window.innerHeight) / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
      setActiveId(best);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`pointer-events-auto fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-12 lg:px-16">
        <a
          href="#hero"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-accent/60">
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            AXIS-7
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm sm:flex">
          {links.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative pb-1 transition-colors ${
                activeId === link.id
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
              {activeId === link.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </a>
          ))}
        </nav>

        <a
          href="#closing"
          className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent sm:block"
        >
          Request access
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`h-px w-5 bg-foreground transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-5 bg-foreground transition-transform ${menuOpen ? "translate-y-[-3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <motion.div
        className="h-px origin-left bg-linear-to-r from-accent to-accent-2"
        style={{ scaleX: scrollYProgress }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/10 bg-background/95 backdrop-blur-xl sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.slice(1).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#closing"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full border border-white/15 px-4 py-3 text-center text-sm text-foreground"
              >
                Request access
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
