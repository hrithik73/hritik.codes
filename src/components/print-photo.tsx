"use client";

// next/image only ships a default export.
import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";
import portrait from "../../public/avatar-portrait-hq.jpg";

/* Taped-up snapshot on a memory wall. Drag it around; it floats back on release. */
export function PrintPhoto() {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    setOffset({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  }

  function end() {
    start.current = null;
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      data-dragging={dragging || undefined}
      style={{ translate: `${offset.x}px ${offset.y}px` }}
      className={`group relative z-10 shrink-0 self-start sm:self-center p-3 -m-3 select-none sm:touch-none ${
        dragging
          ? "cursor-grabbing"
          : "cursor-grab motion-safe:transition-[translate] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.25,0.8,0.25,1)]"
      }`}
    >
      <figure className="relative bg-[oklch(0.98_0_0)] px-2.5 pt-2.5 pb-9 shadow-xl ring-1 ring-black/10 sm:mt-2 sm:px-3 sm:pt-3 sm:pb-12 sm:[transform:rotate(-3deg)] sm:group-hover:[transform:translateY(-6px)_rotate(1deg)] sm:group-data-[dragging]:[transform:translateY(-6px)_rotate(0deg)_scale(1.05)] motion-safe:transition-transform motion-safe:duration-[600ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]">
        <span
          aria-hidden="true"
          className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-2 bg-accent/60 shadow-sm"
        />
        <Image
          src={portrait}
          alt="Hritik Singh"
          // Rendered at most 144×192 CSS px; sizing to that keeps the 2x
          // variant at 384w instead of 640w.
          width={144}
          height={192}
          placeholder="blur"
          preload
          draggable={false}
          className="h-36 w-28 object-cover sm:h-48 sm:w-36"
        />
      </figure>
    </div>
  );
}
