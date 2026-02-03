"use client";
import { useEffect, useRef, useCallback } from "react";
export function Ripple({ color = "rgba(255,255,255,0.333)" }: { color?: string }) {
  const layerRef = useRef<HTMLSpanElement | null>(null);
  const createRipple = useCallback((clientX: number, clientY: number): void => {
    const layer = layerRef.current;
    const trigger = layer ? (layer.closest("button,a") as HTMLElement) : null;
    if (!trigger || !layer) return;
    const rect = trigger.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.75;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    const el = document.createElement("span");
    Object.assign(el.style, { pointerEvents: "none", position: "absolute", width: `${size}px`, height: `${size}px`, left: `${x}px`, top: `${y}px`, borderRadius: "50%", transform: "scale(0)", background: color, transition: "transform 1000ms cubic-bezier(0.2,0.8,0.2,1), opacity 1000ms ease-out" });
    layer.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = "scale(1)"; el.style.opacity = "0"; });
    const cleanup = () => { el.removeEventListener("transitionend", cleanup); if (el.parentElement) el.parentElement.removeChild(el); };
    el.addEventListener("transitionend", cleanup);
    setTimeout(() => { if (el.parentElement) el.parentElement.removeChild(el); }, 1200);
  }, [color]);
  useEffect(() => {
    const layer = layerRef.current;
    const trigger = layer ? (layer.closest("button,a") as HTMLElement) : null;
    if (!trigger || !layer) return;
    const onKeyDown = (ev: KeyboardEvent) => { if (ev.key === "Enter" || ev.key === " ") { const rect = (ev.target as HTMLElement).getBoundingClientRect(); createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2); } };
    const onPointerDown = (ev: PointerEvent) => createRipple(ev.clientX, ev.clientY);
    trigger.addEventListener("keydown", onKeyDown);
    trigger.addEventListener("pointerdown", onPointerDown);
    return () => { trigger.removeEventListener("keydown", onKeyDown); trigger.removeEventListener("pointerdown", onPointerDown); };
  }, [createRipple]);
  return <span ref={layerRef} aria-hidden="true" className="pointer-events-none overflow-hidden absolute inset-0" />;
}
