import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          backgroundColor: "#22875a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        R
      </div>
    ),
    { width: 32, height: 32 }
  );
}
