"use client";
import { clsx } from "clsx";
import type { IconType } from "react-icons";

interface SocialLinkProps {
  href: string;
  label: string;
  Icon: IconType;
}

export function SocialLink({ href, label, Icon }: SocialLinkProps) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      aria-label={label}
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      className={clsx(
        "block p-1 transition-all rounded-full",
        "group outline-primary outline-offset-0",
        "shadow-custom duration-666",
        "animate-expand"
      )}
    >
      <Icon
        size={24}
        className={clsx(
          "transition-all duration-666",
          "text-primary",
          "group-hover:text-light group-focus-visible:text-light"
        )}
      />
    </a>
  );
}
