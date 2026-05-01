import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: "#22875a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        R
      </div>
    ),
    { width: 180, height: 180 }
  );
}
