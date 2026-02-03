"use client";
import { clsx } from "clsx";
import { useScrollProgress } from "@/hooks/useScrollProgress";
export function ProgressBar() {
  const completion = useScrollProgress();
  return (
    <div aria-hidden="true" className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent">
      <div className={clsx("origin-left w-full h-full bg-primary drop-shadow-custom transition-transform duration-150 ease-out")} style={{ transform: `scaleX(${completion / 100})` }} />
    </div>
  );
}
