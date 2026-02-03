export const colors = {
  red: {
    primary: "oklch(0.637 0.237 25.331)",
    secondary: "oklch(0.396 0.141 25.723)",
    primaryHex: "#ef4444",
    secondaryHex: "#7f1d1d",
  },
  orange: {
    primary: "oklch(0.705 0.213 47.604)",
    secondary: "oklch(0.408 0.123 38.172)",
    primaryHex: "#f97316",
    secondaryHex: "#7c2d12",
  },
  amber: {
    primary: "oklch(0.769 0.188 70.08)",
    secondary: "oklch(0.414 0.112 45.904)",
    primaryHex: "#f59e0b",
    secondaryHex: "#78350f",
  },
  yellow: {
    primary: "oklch(0.795 0.184 86.047)",
    secondary: "oklch(0.421 0.095 57.708)",
    primaryHex: "#eab308",
    secondaryHex: "#713f12",
  },
  lime: {
    primary: "oklch(0.768 0.233 130.85)",
    secondary: "oklch(0.405 0.101 131.063)",
    primaryHex: "#84cc16",
    secondaryHex: "#365314",
  },
  green: {
    primary: "oklch(0.723 0.219 149.579)",
    secondary: "oklch(0.393 0.095 152.535)",
    primaryHex: "#22c55e",
    secondaryHex: "#14532d",
  },
  emerald: {
    primary: "oklch(0.696 0.17 162.48)",
    secondary: "oklch(0.378 0.077 168.94)",
    primaryHex: "#10b981",
    secondaryHex: "#064e3b",
  },
  teal: {
    primary: "oklch(0.704 0.14 182.503)",
    secondary: "oklch(0.386 0.063 188.416)",
    primaryHex: "#14b8a6",
    secondaryHex: "#134e4a",
  },
  cyan: {
    primary: "oklch(0.715 0.143 215.221)",
    secondary: "oklch(0.398 0.07 227.392)",
    primaryHex: "#06b6d4",
    secondaryHex: "#164e63",
  },
  sky: {
    primary: "oklch(0.685 0.169 237.323)",
    secondary: "oklch(0.391 0.09 240.876)",
    primaryHex: "#0ea5e9",
    secondaryHex: "#0c4a6e",
  },
  blue: {
    primary: "oklch(0.623 0.214 259.815)",
    secondary: "oklch(0.379 0.146 265.522)",
    primaryHex: "#3b82f6",
    secondaryHex: "#1e3a8a",
  },
  indigo: {
    primary: "oklch(0.585 0.233 277.117)",
    secondary: "oklch(0.359 0.144 278.697)",
    primaryHex: "#6366f1",
    secondaryHex: "#312e81",
  },
  violet: {
    primary: "oklch(0.606 0.25 292.717)",
    secondary: "oklch(0.38 0.189 293.745)",
    primaryHex: "#8b5cf6",
    secondaryHex: "#4c1d95",
  },
  purple: {
    primary: "oklch(0.627 0.265 303.9)",
    secondary: "oklch(0.381 0.176 304.987)",
    primaryHex: "#a855f7",
    secondaryHex: "#581c87",
  },
  fuchsia: {
    primary: "oklch(0.667 0.295 322.15)",
    secondary: "oklch(0.401 0.17 325.612)",
    primaryHex: "#d946ef",
    secondaryHex: "#701a75",
  },
  pink: {
    primary: "oklch(0.656 0.241 354.308)",
    secondary: "oklch(0.408 0.153 2.432)",
    primaryHex: "#ec4899",
    secondaryHex: "#831843",
  },
  rose: {
    primary: "oklch(0.645 0.246 16.439)",
    secondary: "oklch(0.41 0.159 10.272)",
    primaryHex: "#f43f5e",
    secondaryHex: "#881337",
  },
} as const;

export type ColorName = keyof typeof colors;
export type ColorShade = (typeof colors)[ColorName];
export type Color = { primary: string; secondary: string };
