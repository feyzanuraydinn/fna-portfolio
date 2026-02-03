import { clsx } from "clsx";
import { GoHome } from "@/components/projects/GoHome";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-labelledby="projects-title"
      className={clsx(
        "max-w-full w-[666px] scroll-mt-16 ml-36 pt-44 pb-22 min-h-screen",
        "inlg:pt-33 inlg:ml-0",
        "flex flex-col gap-12",
        "in2xl:mx-auto",
        "inxl:px-8",
        "insm:px-4"
      )}
    >
      <GoHome />
      {children}
    </section>
  );
}
