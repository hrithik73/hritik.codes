// Tech I'm comfortable with — rendered as a short labelled list on the home page.
// Pulled from what I actually ship: work apps (CoinPoker, PokerBoss), shared
// RN libraries, and personal projects. Keep it to things I'd happily be quizzed on.
// Icons: brand marks from simple-icons; official logo files in /public/stack for
// libraries simple-icons lacks; Lucide only for concepts with no logo at all.
import { Component, HardDrive, type LucideIcon, Radio } from "lucide-react";
import {
  type SimpleIcon,
  siApollographql,
  siAppstore,
  siClerk,
  siConvex,
  siExpo,
  siFirebase,
  siGoogleplay,
  siGraphql,
  siJavascript,
  siJest,
  siKotlin,
  siMobx,
  siMobxstatetree,
  siNextdotjs,
  siReact,
  siReactquery,
  siRedux,
  siSentry,
  siStorybook,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVitest,
} from "simple-icons";

/** Official logo file under /public/stack, for libraries simple-icons doesn't carry. */
export type LogoFile = {
  src: string;
  /** Dark single-colour marks (e.g. Software Mansion navy) get inverted in dark mode. */
  invertInDark?: boolean;
};

export type StackItem = {
  name: string;
  icon: SimpleIcon | LucideIcon | LogoFile;
};

export const stack: { label: string; items: StackItem[] }[] = [
  {
    label: "Mobile",
    items: [
      { name: "React Native", icon: siReact },
      { name: "Expo", icon: siExpo },
      {
        name: "Reanimated",
        icon: { src: "/stack/reanimated.svg", invertInDark: true },
      },
      {
        name: "Gesture Handler",
        icon: { src: "/stack/gesture-handler.svg", invertInDark: true },
      },
      {
        name: "React Navigation",
        icon: { src: "/stack/react-navigation.svg" },
      },
    ],
  },
  {
    label: "Web",
    items: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Tailwind CSS", icon: siTailwindcss },
    ],
  },
  {
    label: "Languages",
    items: [
      { name: "TypeScript", icon: siTypescript },
      { name: "JavaScript", icon: siJavascript },
      { name: "Swift", icon: siSwift },
      { name: "Kotlin", icon: siKotlin },
      { name: "GraphQL", icon: siGraphql },
    ],
  },
  {
    label: "State & data",
    items: [
      { name: "MobX", icon: siMobx },
      { name: "MobX-State-Tree", icon: siMobxstatetree },
      { name: "Zustand", icon: { src: "/stack/zustand.png" } },
      { name: "Redux", icon: siRedux },
      { name: "TanStack Query", icon: siReactquery },
      { name: "Apollo Client", icon: siApollographql },
      { name: "MMKV", icon: HardDrive },
      { name: "WebSockets", icon: Radio },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Firebase", icon: siFirebase },
      { name: "Convex", icon: siConvex },
      { name: "Clerk", icon: siClerk },
    ],
  },
  {
    label: "Testing & tooling",
    items: [
      { name: "Jest", icon: siJest },
      { name: "Detox", icon: { src: "/stack/detox.png" } },
      { name: "Vitest", icon: siVitest },
      { name: "Storybook", icon: siStorybook },
      { name: "Sentry", icon: siSentry },
    ],
  },
  {
    label: "Shipping",
    items: [
      { name: "EAS Build & Update", icon: siExpo },
      { name: "App Store", icon: siAppstore },
      { name: "Play Store", icon: siGoogleplay },
      { name: "Vercel", icon: siVercel },
      { name: "Design systems", icon: Component },
    ],
  },
];
