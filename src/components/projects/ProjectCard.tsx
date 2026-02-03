"use client";
import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Project } from "@/data/projects";

function CardShell({
  height,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { height: number }) {
  return (
    <article
      className={clsx(
        "overflow-hidden rounded-xl flex flex-col",
        "dark:bg-light/5 bg-dark/5",
        "shadow-custom",
        "transition-all duration-333",
        "hover:scale-[0.98] focus-visible:scale-[0.98]",
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    />
  );
}

interface CardImageProps {
  figure: string;
  previewUrl?: string;
  alt: string;
  bandHeightClass: string;
  portrait?: boolean;
}

function CardImage({ figure, previewUrl, alt, bandHeightClass, portrait }: CardImageProps) {
  const src = previewUrl || figure;

  const wrapClass = portrait
    ? "relative h-full w-[40%] flex-shrink-0 overflow-hidden"
    : clsx("relative w-full overflow-hidden flex-shrink-0", bandHeightClass);

  if (!src) {
    return <figure className={clsx(wrapClass, "bg-primary/20")} />;
  }

  // Animated previews (webp/gif) bypass next/image processing so the animation
  // is preserved end-to-end.
  if (previewUrl) {
    return (
      <figure className={wrapClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none select-none object-cover"
        />
      </figure>
    );
  }

  return (
    <figure className={wrapClass}>
      <Image
        fill
        src={figure}
        alt={alt}
        sizes={portrait ? "(max-width: 1024px) 40vw, 200px" : "(max-width: 1024px) 100vw, 333px"}
        className="pointer-events-none select-none object-cover"
      />
    </figure>
  );
}

function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className="font-bold text-xl dark:text-light text-dark transition-theme"
      {...props}
    />
  );
}

interface CardDescProps extends React.HTMLAttributes<HTMLParagraphElement> {
  clamp?: number;
}

function CardDesc({ className, clamp = 2, style, ...props }: CardDescProps) {
  return (
    <p
      className={clsx(
        "text-sm dark:text-light/50 text-dark/50 transition-theme overflow-hidden",
        className
      )}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: clamp,
        WebkitBoxOrient: "vertical",
        ...style,
      }}
      {...props}
    />
  );
}

function CardStatus(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "block px-4 py-2 mt-auto",
        "text-center text-xs font-semibold",
        "text-light bg-primary",
        "transition-colors duration-500"
      )}
      {...props}
    />
  );
}

interface ProjectCardProps {
  project: Project;
  cardHeight: number;
  imageHeightClass: string;
  mobileDescClamp: number;
  onLinkClick?: () => void;
}

export function ProjectCard({
  project,
  cardHeight,
  imageHeightClass,
  mobileDescClamp,
  onLinkClick,
}: ProjectCardProps) {
  const { locale } = useLanguage();

  const alt = project.content.cardAlt[locale];
  const name = project.content.name[locale];
  const description = project.content.cardDescription[locale];
  const status = project.content.status[locale];

  const titleId = `${project.id}-title`;
  const descId = `${project.id}-desc`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={onLinkClick}
      className="outline-none block h-full"
    >
      {project.isMobile ? (
        <CardShell height={cardHeight}>
          <div className="flex flex-1 min-h-0">
            <CardImage
              figure={project.coverImage || ""}
              previewUrl={project.previewUrl}
              alt={alt}
              bandHeightClass={imageHeightClass}
              portrait
            />
            <div className="p-4 flex flex-col gap-2 flex-1 min-w-0">
              <CardTitle id={titleId}>{name}</CardTitle>
              <CardDesc id={descId} clamp={mobileDescClamp}>
                {description}
              </CardDesc>
            </div>
          </div>
          <CardStatus>{status}</CardStatus>
        </CardShell>
      ) : (
        <CardShell height={cardHeight}>
          <CardImage
            figure={project.coverImage || ""}
            previewUrl={project.previewUrl}
            alt={alt}
            bandHeightClass={imageHeightClass}
          />
          <div className="p-4 flex flex-col gap-2">
            <CardTitle id={titleId}>{name}</CardTitle>
            <CardDesc id={descId}>{description}</CardDesc>
          </div>
          <CardStatus>{status}</CardStatus>
        </CardShell>
      )}
    </Link>
  );
}
