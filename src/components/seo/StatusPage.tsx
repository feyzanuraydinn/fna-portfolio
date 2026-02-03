"use client";
import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { Ripple } from "@/components/ui/Ripple";

interface StatusPageProps {
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
}

export function StatusPage({ code, title, description, actions }: StatusPageProps) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-[900]",
        "flex items-center justify-center px-4",
        "dark:bg-dark/95 bg-light/95 backdrop-blur-sm",
        "transition-theme"
      )}
    >
      <div
        className={clsx(
          "relative overflow-hidden",
          "max-w-lg w-full p-8 rounded-2xl",
          "dark:bg-light/5 bg-dark/5",
          "shadow-custom",
          "flex flex-col items-center text-center gap-4",
          "transition-theme",
          "after:content-[''] after:pointer-events-none after:absolute",
          "after:w-28 after:h-28 after:rounded-full",
          "after:border-4 after:border-dashed after:border-primary",
          "after:drop-shadow-custom after:transition-theme",
          "after:top-0 after:left-0 after:-translate-1/3",
          "before:content-[''] before:pointer-events-none before:absolute",
          "before:w-28 before:h-28 before:rounded-full",
          "before:border-4 before:border-dashed before:border-primary",
          "before:drop-shadow-custom before:transition-theme",
          "before:bottom-0 before:right-0 before:translate-1/3"
        )}
      >
        <p
          className={clsx(
            "font-extrabold text-7xl insm:text-6xl text-primary",
            "tracking-widest",
            "transition-theme"
          )}
        >
          {code}
        </p>
        <h1 className="font-extrabold text-2xl insm:text-xl dark:text-light text-dark transition-theme">
          {title}
        </h1>
        <p className="text-sm dark:text-light/75 text-dark/75 transition-theme max-w-sm">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      </div>
    </div>
  );
}

export function StatusPrimaryButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "cursor-pointer outline-offset-2 outline-primary relative overflow-hidden",
        "px-6 py-2 rounded",
        "font-semibold text-light text-sm",
        "bg-primary shadow-custom",
        "transition-all duration-333",
        "active:scale-90 active:bg-secondary hover:scale-95 focus-visible:scale-95",
        "animate-shine motion-safe:animate-shine motion-reduce:animate-none"
      )}
    >
      <Ripple />
      {children}
    </button>
  );
}

export function StatusSecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "outline-offset-2 outline-primary",
        "px-6 py-2 rounded",
        "font-semibold text-sm dark:text-light text-dark",
        "border dark:border-light/25 border-dark/25",
        "transition-all duration-333",
        "hover:border-primary hover:text-primary",
        "focus-visible:border-primary focus-visible:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
