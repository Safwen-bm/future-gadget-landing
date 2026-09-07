# AXIS-7 — Drone Landing Page

A concept landing page for an autonomous recon drone, built with Next.js, Tailwind CSS, and a 3D drone model (Three.js / React Three Fiber) that moves and scales as you scroll.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- React Three Fiber / drei / Three.js — 3D drone model
- Framer Motion — scroll animations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/            App router pages, layout, global styles
  components/     Navbar, Hero, FeatureShowcase, Explore, ClosingCTA, Footer, Scene/Drone
  lib/            Shared drone color state
public/models/    Drone .glb model
```

## Notes

- The 3D drone lives in `Scene.tsx` / `Drone.tsx` and repositions itself based on which section is in view.
- In the "Explore" section, drag to rotate the drone and click the swatches to change its finish.
- Drone model: original creator on Sketchfab, CC BY 4.0.