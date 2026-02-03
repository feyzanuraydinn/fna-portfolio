"use client";
import { clsx } from "clsx";
import { Sidecard } from "@/components/layout/Sidecard";
export function Profile(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id="profile" aria-labelledby="profile-title" aria-describedby="profile-desc" className={clsx("sticky top-0 left-0 h-screen px-2 py-4 inlg:p-0", "flex items-center justify-end", "inlg:static inlg:justify-center", "inmd:h-svh")} {...props}>
      <h2 className="sr-only">Profile</h2>
      <Sidecard />
    </section>
  );
}
