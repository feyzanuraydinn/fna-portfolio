"use client";
import { clsx } from "clsx";
import { Ripple } from "./Ripple";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useTranslations } from "next-intl";
export function BackToTop() {
  const t = useTranslations();
  const completion = useScrollProgress();
  const isHidden = completion < 33;
  const handleBackToTop = (): void => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: isReducedMotion ? "instant" : "smooth" });
  };
  return (
    <div aria-hidden={isHidden} className={clsx("z-[800] fixed right-5 insm:right-auto insm:left-5 bottom-5", "transition-all duration-333 ease-out", isHidden ? "translate-y-10 opacity-0 invisible pointer-events-none" : "translate-y-0 opacity-100 visible pointer-events-auto")}>
      <button type="button" aria-label={t("backToTop")} tabIndex={isHidden ? -1 : 0} onClick={handleBackToTop} className={clsx("cursor-pointer outline-offset-4 outline-primary", "relative overflow-hidden", "flex items-center justify-center", "w-9 h-9 rounded-full", "dark:bg-light/33 bg-dark/33", "shadow-custom", "transition-all duration-333", "active:scale-90 hover:scale-95 focus-visible:scale-95", "animate-expand motion-safe:animate-expand motion-reduce:animate-none")}>
        <Ripple />
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-light"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </div>
  );
}
