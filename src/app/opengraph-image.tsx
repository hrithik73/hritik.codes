import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Hritik Singh — Product-minded Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dark theme tokens from globals.css, as hex for Satori
export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public/avatar-v2.jpg"));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 96,
        background: "#1c1c1c",
        color: "#ececec",
      }}
    >
      <img
        src={`data:image/jpeg;base64,${avatar.toString("base64")}`}
        alt=""
        width={112}
        height={112}
        style={{ borderRadius: 999 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, letterSpacing: -3, lineHeight: 1 }}>
          Hritik Singh
        </div>
        <div
          style={{
            width: 72,
            height: 6,
            marginTop: 28,
            borderRadius: 3,
            background: "#a3e635",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 36,
            fontSize: 40,
            color: "#a8a8a8",
          }}
        >
          <span>Product-minded Developer</span>
          <span>hritik.io</span>
        </div>
      </div>
    </div>,
    size,
  );
}
