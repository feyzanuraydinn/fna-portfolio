import { Home } from "@/components/sections/Home";
import { Projects } from "@/components/sections/Projects";
import { Tools } from "@/components/sections/Tools";
import { Contact } from "@/components/sections/Contact";
import { Physics } from "@/components/sections/Physics";
import { JsonLd } from "@/components/seo/JsonLd";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/siteConfig";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteConfig.url,
  image: `${siteConfig.url}${profile.photoUrl}`,
  email: profile.social.email,
  jobTitle: profile.description[siteConfig.defaultLocale],
  sameAs: [profile.social.github, profile.social.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location[siteConfig.defaultLocale],
  },
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Full Stack Development",
    "Web Development",
    "Frontend Development",
    "Backend Development",
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${profile.name} — Full Stack Development`,
  description:
    "Full Stack web development services using React, Next.js, TypeScript and Node.js.",
  provider: {
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
  },
  areaServed: "Worldwide",
  serviceType: [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Web Application Development",
  ],
};

export default function HomePage() {
  return (
    <>
      <Home />
      <Projects />
      <Tools />
      <Contact />
      <Physics />
      <JsonLd data={[personSchema, serviceSchema]} />
    </>
  );
}
