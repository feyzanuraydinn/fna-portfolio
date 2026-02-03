import { ImageResponse } from "next/og";
import { brandColors } from "@/data/siteConfig";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

const BG = "#1e1e1f";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          fill="none"
          stroke={brandColors.primaryHex}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="10,11 5,16 10,21" />
          <line x1="13" y1="23" x2="19" y2="9" />
          <polyline points="22,11 27,16 22,21" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
