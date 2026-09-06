"use client";

import { useDroneColorIndex, droneStore, FINISHES } from "@/lib/drone-store";

export default function Explore() {
  const colorIndex = useDroneColorIndex();

  return (
    <section
      id="explore"
      className="pointer-events-none relative flex min-h-screen w-full flex-col items-center justify-between border-t border-white/10 px-6 py-24 text-center sm:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #edeae3 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative mx-auto max-w-lg">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-accent">Explore AXIS-7</p>
        <h2 className="font-display mt-5 text-4xl leading-tight text-foreground sm:text-5xl">
          Drag to rotate. Pick a finish.
        </h2>
        <p className="mt-4 text-base text-muted">
          Click and drag the model anywhere on screen, or choose a finish below.
        </p>
      </div>

      <div className="pointer-events-auto relative z-10 flex items-center gap-5 rounded-full border border-white/10 bg-surface/60 px-6 py-4 backdrop-blur-sm">
        {FINISHES.map((finish, i) => (
          <button
            key={finish.name}
            onClick={() => droneStore.setColorIndex(i)}
            aria-label={finish.name}
            aria-pressed={colorIndex === i}
            className={`group flex flex-col items-center gap-2 transition-transform ${
              colorIndex === i ? "scale-110" : "hover:scale-105"
            }`}
          >
            <span
              className={`h-9 w-9 rounded-full border-2 transition-colors ${
                colorIndex === i ? "border-accent" : "border-white/20 group-hover:border-white/50"
              }`}
              style={{ backgroundColor: finish.hex }}
            />
            <span className={`text-xs transition-colors ${colorIndex === i ? "text-foreground" : "text-muted"}`}>
              {finish.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}