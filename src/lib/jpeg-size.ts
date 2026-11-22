import { readFileSync } from "node:fs";

/**
 * Pixel size of a JPEG, read from its SOF header — enough to give covers their
 * true proportions at build time without pulling in an image library.
 */
export function jpegSize(
  path: string,
): { width: number; height: number } | null {
  const buf = readFileSync(path);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    // SOF0–SOF15 carry the frame size; C4/C8/CC are tables, not frames
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    )
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
      };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}
