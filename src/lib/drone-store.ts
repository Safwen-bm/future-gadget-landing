"use client";

import { useSyncExternalStore } from "react";

export const FINISHES = [
  { name: "Matte Black", hex: "#141414" },
  { name: "Signal Blue", hex: "#2f6fed" },
  { name: "Arctic White", hex: "#eef1f4" },
  { name: "Safety Red", hex: "#d1373c" },
] as const;

let colorIndex = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const droneStore = {
  getColorIndex: () => colorIndex,
  setColorIndex: (index: number) => {
    colorIndex = ((index % FINISHES.length) + FINISHES.length) % FINISHES.length;
    emit();
  },
  cycle: () => {
    colorIndex = (colorIndex + 1) % FINISHES.length;
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useDroneColorIndex() {
  return useSyncExternalStore(droneStore.subscribe, droneStore.getColorIndex, () => 0);
}