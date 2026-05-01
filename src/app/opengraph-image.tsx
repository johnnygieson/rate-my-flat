import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rate My Flat — Honest reviews of UK rentals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0faf5",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", fontSize: 80, fontWeight: 800, lineHeight: 1 }}>
          <span style={{ color: "#1c1c1a" }}>Rate My&nbsp;</span>
          <span style={{ color: "#22875a" }}>Flat</span>
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#374151",
            marginTop: 32,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Honest reviews of UK rentals by people who lived there
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
