export type Locale = "tr" | "en";

export interface Profile {
  photoUrl: string;
  name: string;
  description: Record<Locale, string>;
  location: Record<Locale, string>;
  /** ISO date when professional career started — used to compute years of experience. */
  experienceStartDate: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export const profile: Profile = {
  photoUrl: "/images/me.png",
  name: "Feyza Nur Aydın",
  description: {
    tr: "Full Stack Developer",
    en: "Full Stack Developer",
  },
  location: {
    tr: "Ankara, Türkiye",
    en: "Ankara, Turkey",
  },
  experienceStartDate: "2024-02-18",
  social: {
    github: "https://github.com/feyzanuraydinn",
    linkedin: "https://www.linkedin.com/in/feyzaydin98",
    email: "feyzaydin98@gmail.com",
  },
};
