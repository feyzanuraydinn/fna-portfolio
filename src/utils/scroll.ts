export function scrollToItem(id: string, instant?: boolean) {
  return () => {
    const el = document.getElementById(id);
    if (!el) return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: isReducedMotion || instant ? "instant" : "smooth" });
  };
}
