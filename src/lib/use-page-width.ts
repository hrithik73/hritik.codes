"use client";

import { usePathname } from "next/navigation";
import { narrowWidth, wideRoutes, wideWidth } from "./page-width";

export function usePageWidth() {
  const pathname = usePathname();
  return wideRoutes.some((r) => pathname.startsWith(r))
    ? wideWidth
    : narrowWidth;
}
