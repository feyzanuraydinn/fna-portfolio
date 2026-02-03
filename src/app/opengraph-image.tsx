import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { brandColors } from "@/data/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} - Full Stack Developer Portfolio`;
export const dynamic = "force-static";

const BG_DARK = "#1e1e1f";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: `linear-gradient(135deg, ${BG_DARK} 0%, ${brandColors.secondaryHex} 50%, ${BG_DARK} 100%)`,
          padding: "80px 100px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: brandColors.primaryHex,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          PORTFOLIO
        </div>
        <div
          style={{
            fontSize: 96,
            color: "#fefffe",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            display: "flex",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#fefffe",
            opacity: 0.75,
            display: "flex",
          }}
        >
          {profile.description.en}
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
            fontSize: 24,
            color: "#fefffe",
            opacity: 0.6,
          }}
        >
          <div style={{ display: "flex" }}>React</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>Next.js</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>TypeScript</div>
          <div style={{ display: "flex" }}>·</div>
          <div style={{ display: "flex" }}>Node.js</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `8px dashed ${brandColors.primaryHex}`,
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: `8px dashed ${brandColors.primaryHex}`,
            opacity: 0.3,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
