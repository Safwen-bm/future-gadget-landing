"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const features = [
  { range: [0, 0.33], eyebrow: "Terrain mapping", title: "It reads the ground before it flies over it.", body: "Onboard LiDAR builds a live elevation model, so AXIS-7 already knows what's ahead before its cameras confirm it." },
  { range: [0.33, 0.66], eyebrow: "Path planning", title: "No operator, no preset route.", body: "Given a boundary, AXIS-7 plans its own flight path, adjusting mid-flight when the terrain doesn't match the map." },
  { range: [0.66, 1], eyebrow: "All-weather sensors", title: "Fog, dust, or low light don't slow it down.", body: "A fused thermal and infrared array keeps mapping accurate when visible-light cameras alone would fail." },
] as const;

function FeatureBlock({
  feature,
  scrollYProgress,
}: {
  feature: (typeof features)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [start, end] = feature.range;
  const mid = (start + end) / 2;
  const fadeIn = start === 0 ? 0.01 : 0.06;
  const opacity = useTransform(scrollYProgress, [start, start + fadeIn, end - fadeIn, end], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, mid], [24, 0]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">{feature.eyebrow}</p>
      <h3 className="font-display mt-4 max-w-sm text-3xl leading-tight text-foreground sm:text-4xl">{feature.title}</h3>
      <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">{feature.body}</p>
    </motion.div>
  );
}

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(Math.min(features.length - 1, Math.floor(v * features.length)));
  });

  return (
    <section id="features" ref={containerRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 flex h-screen w-full items-center justify-between px-6 sm:px-12 lg:px-16">
        <div className="relative flex min-h-70 flex-col justify-center lg:w-[45%]">
          {features.map((feature) => (
            <FeatureBlock key={feature.eyebrow} feature={feature} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        <div className="hidden flex-col items-end gap-4 lg:flex">
          <span className="font-display text-xs text-muted">
            0{activeIndex + 1} / 0{features.length}
          </span>
          <div className="flex flex-col gap-3">
            {features.map((feature, i) => (
              <span
                key={feature.eyebrow}
                className={`h-8 w-px transition-colors duration-300 ${i === activeIndex ? "bg-accent" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}