"use client";
import { useEffect } from "react";

interface ScrollToTopOptions {
  mobileTargetSelector?: string;
  mobileNavbarHeight?: number;
  mobileExtraOffset?: number;
}

const MOBILE_BREAKPOINT = 1024;

export function useScrollToTop(
  deps: React.DependencyList = [],
  options: ScrollToTopOptions = {}
) {
  const {
    mobileTargetSelector,
    mobileNavbarHeight = 68,
    mobileExtraOffset = 16,
  } = options;

  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobile && mobileTargetSelector) {
      const raf = requestAnimationFrame(() => {
        const target = document.querySelector(mobileTargetSelector);
        if (target) {
          const rect = target.getBoundingClientRect();
          const scrollTo =
            window.scrollY + rect.top - mobileNavbarHeight - mobileExtraOffset;
          window.scrollTo({ top: Math.max(0, scrollTo), behavior: "instant" });
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
