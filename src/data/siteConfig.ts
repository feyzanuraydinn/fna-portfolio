import { colors, type ColorName } from "@/utils/colors";

export const siteConfig = {
  url: "https://feyzaydin.dev",
  defaultLocale: "tr" as const,
  twitterHandle: "",
  brand: "yellow" satisfies ColorName as ColorName,
} as const;

export const brandColors = colors[siteConfig.brand];
