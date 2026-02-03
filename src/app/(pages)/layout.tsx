"use client";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BackToTop } from "@/components/ui/BackToTop";
import { Header } from "@/components/layout/Header";
import { Sidemenu } from "@/components/layout/Sidemenu";
import { Footer } from "@/components/layout/Footer";
import { Profile } from "@/components/sections/Profile";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar />
      <BackToTop />
      <Header />
      <Sidemenu />
      <main data-nosnippet className="dark:bg-dark bg-light transition-theme relative">
        <div className="w-[40%] inlg:w-full inlg:relative fixed top-0 left-0 h-screen inlg:h-auto z-20">
          <Profile />
        </div>
        <div className="ml-[40%] inlg:ml-0">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
