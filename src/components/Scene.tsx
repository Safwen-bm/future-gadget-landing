"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";
import { DroneRig } from "./Drone";
import { droneStore } from "@/lib/drone-store";

type Section = "hero" | "features" | "explore" | "closing";

type SectionConfig = {
  position: [number, number, number];
  mobilePosition: [number, number, number];
  sizeMultiplier: number;
};

const SECTION_CONFIG: { [key in Section]: SectionConfig } = {
  hero: {
    position: [2.2, 0.15, -1.2],
    mobilePosition: [0, 1.3, -1.5],
    sizeMultiplier: 0.52,
  },
  features: {
    position: [1.7, 0, 0],
    mobilePosition: [0, 1.1, -0.5],
    sizeMultiplier: 0.62,
  },
  explore: {
    position: [0, -0.1, 0],
    mobilePosition: [0, -0.1, 0],
    sizeMultiplier: 0.85,
  },
  closing: {
    position: [0, -4, -2],
    mobilePosition: [0, -4, -2],
    sizeMultiplier: 0.3,
  },
};

const SECTION_IDS: Section[] = ["hero", "features", "explore", "closing"];
const CLICK_DRAG_THRESHOLD = 6; // px — below this a pointer down+up counts as a click, not a drag
const MOBILE_BREAKPOINT = 1024; // matches Tailwind's `lg`

function useActiveSection(): Section {
  const [active, setActive] = useState<Section>("hero");

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const viewportCenter = window.innerHeight / 2;

      // near the very bottom of the page (in the footer) → force non-interactive
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (nearBottom) {
        setActive("closing");
        return;
      }

      let best: Section = "hero";
      let bestDist = Infinity;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const visibleCenter =
          rect.top + Math.min(rect.height, window.innerHeight) / 2;
        const dist = Math.abs(visibleCenter - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
      setActive(best);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function AnimatedDrone({
  active,
  isMobile,
  onHoverChange,
}: {
  active: Section;
  isMobile: boolean;
  onHoverChange: (hovering: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(...SECTION_CONFIG.hero.position));
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (active !== "explore") return;
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (active !== "explore" || !pointerDown.current) return;
    const dx = e.clientX - pointerDown.current.x;
    const dy = e.clientY - pointerDown.current.y;
    const moved = Math.hypot(dx, dy);
    pointerDown.current = null;
    if (moved < CLICK_DRAG_THRESHOLD) droneStore.cycle();
  };

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const baseScale = (group.userData.baseScale as number | undefined) ?? 0;
    const config = SECTION_CONFIG[active];
    const basePos = isMobile ? config.mobilePosition : config.position;

    if (active === "hero") {
      targetPos.current.set(
        basePos[0],
        basePos[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05,
        basePos[2],
      );
      group.rotation.y += delta * 0.22;
    } else if (active === "features") {
      const featuresEl = document.getElementById("features");
      if (featuresEl) {
        const rect = featuresEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = THREE.MathUtils.clamp(
          -rect.top / (rect.height - vh),
          0,
          1,
        );
        targetPos.current.set(
          basePos[0],
          basePos[1] + Math.sin(progress * Math.PI * 2) * 0.15,
          basePos[2],
        );
        group.rotation.y = progress * Math.PI * 2;
        group.rotation.x = Math.sin(progress * Math.PI) * 0.15;
      }
    } else {
      targetPos.current.set(basePos[0], basePos[1], basePos[2]);
      if (active === "closing") group.rotation.y += delta * 0.15;
    }

    group.position.lerp(targetPos.current, delta * 4);
    const targetScale = baseScale * config.sizeMultiplier;
    const s = THREE.MathUtils.lerp(group.scale.x, targetScale, delta * 4);
    group.scale.setScalar(s);
  });

  return (
    <DroneRig
      groupRef={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={() => active === "explore" && onHoverChange(true)}
      onPointerOut={() => onHoverChange(false)}
    />
  );
}

function Loader() {
  return (
    <Html center>
      <div className="h-2 w-2 animate-ping rounded-full bg-accent" />
    </Html>
  );
}

export default function Scene() {
  const active = useActiveSection();
  const isMobile = useIsMobile();
  const [hovering, setHovering] = useState(false);
  const interactive = active === "explore";

  return (
    <div
      style={{ touchAction: "none" }}
      className={`fixed inset-0 ${interactive ? "pointer-events-auto" : "pointer-events-none"} ${
        interactive ? (hovering ? "cursor-pointer" : "cursor-grab") : ""
      }`}
    >
      <Canvas
        camera={{ position: [0, 1, 5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.3}
          color="#5b8def"
        />
        <directionalLight
          position={[-5, -2, -5]}
          intensity={0.35}
          color="#edeae3"
        />
        <Suspense fallback={<Loader />}>
          <AnimatedDrone
            active={active}
            isMobile={isMobile}
            onHoverChange={setHovering}
          />
          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.35}
            scale={8}
            blur={2.4}
            far={2}
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          makeDefault
          enabled={interactive}
          enablePan={false}
          enableZoom={false}
          minDistance={3}
          maxDistance={8}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
