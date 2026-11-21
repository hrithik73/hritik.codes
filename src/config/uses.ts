// Everything on /uses. Gear renders as an image grid; the rest as rows with app icons.
// Icons were pulled from the installed .app bundles; product shots live in public/uses/gear.

export type UsesItem = {
  name: string;
  note?: string;
  href?: string;
  /** Path under /public, e.g. "/uses/icons/zed.png" */
  image?: string;
};

export type UsesSection = { title: string; items: UsesItem[] };

export const gear: UsesItem[] = [
  {
    name: 'MacBook Pro 14"',
    note: "M4 Pro, 24 GB. Does everything, never gets warm.",
    image: "/uses/gear/macbook-pro.webp",
  },
  {
    name: 'LG 27" 4K HDR',
    note: "Main screen when I’m at the desk.",
    // Exact model unknown (OSD shows only serial + resolution; EDID says 27", 2021).
    // Image is a generic LG 27" 4K HDR (27UL550) product shot.
    image: "/uses/gear/lg-monitor.webp",
  },
  {
    name: "Keychron K6",
    note: "65%, wireless, Mac layout.",
    image: "/uses/gear/keychron-k6.webp",
  },
  {
    name: "Amkette XS Flow 2",
    note: "Bluetooth mouse.",
    image: "/uses/gear/amk-xs-flow2.webp",
  },
  {
    name: "Sony WH-CH520",
    note: "Long calls and longer focus sessions.",
    image: "/uses/gear/sony-wh-ch520.webp",
  },
  {
    name: "AirPods Pro",
    note: "For when I’m out.",
    image: "/uses/gear/airpods-pro.webp",
  },
  {
    name: "iPhone 15",
    note: "Daily phone, and the first test device for every build.",
    image: "/uses/gear/iphone-15.webp",
  },
  {
    name: "iPad (A16)",
    note: "Reading, sketching ideas, testing tablet layouts.",
    image: "/uses/gear/ipad.webp",
  },
  {
    name: "Kindle Paperwhite",
    note: "Books, away from notifications.",
    image: "/uses/gear/kindle-paperwhite.webp",
  },
  // TODO: desk
  // TODO: chair
];

export const software: UsesSection[] = [
  {
    title: "Editors",
    items: [
      {
        name: "Zed",
        note: "Main editor. Geist Mono, Tokyo Night, Claude Code in the agent panel.",
        href: "https://zed.dev",
        image: "/uses/icons/zed.png",
      },
      {
        name: "Cursor",
        note: "For bigger AI-assisted refactors.",
        href: "https://cursor.com",
        image: "/uses/icons/cursor.png",
      },
      {
        name: "VSCodium",
        note: "VS Code without telemetry. GitLens for history spelunking.",
        href: "https://vscodium.com",
        image: "/uses/icons/vscodium.png",
      },
      {
        name: "Xcode",
        note: "iOS builds, simulators and the occasional native module.",
        href: "https://developer.apple.com/xcode/",
        image: "/uses/icons/xcode.png",
      },
      {
        name: "Android Studio",
        note: "Emulators, Gradle and Logcat.",
        href: "https://developer.android.com/studio",
        image: "/uses/icons/android-studio.png",
      },
    ],
  },
  {
    title: "Terminal",
    items: [
      {
        name: "Ghostty",
        note: "Fast, native, sensible defaults.",
        href: "https://ghostty.org",
        image: "/uses/icons/ghostty.png",
      },
      {
        name: "Rex",
        note: "Sessions and panes I can script.",
        image: "/uses/icons/rex.png",
      },
      {
        name: "zsh + Starship",
        note: "oh-my-zsh with autosuggestions, syntax highlighting and z.",
        href: "https://starship.rs",
      },
      {
        name: "tmux, lazygit, btop",
        note: "Splits, git without typing git, and what’s eating my CPU.",
      },
    ],
  },
  {
    title: "AI",
    items: [
      {
        name: "Claude Code",
        note: "Aliased to c. Most of my day starts here.",
        href: "https://claude.com/claude-code",
        image: "/uses/icons/claude.png",
      },
      {
        name: "Codex",
        note: "A second opinion from the command line.",
        href: "https://openai.com/codex",
      },
    ],
  },
  {
    title: "Dev tooling",
    items: [
      {
        name: "Node 24 via nvm, and Bun",
        note: "Bun for scripts and installs.",
      },
      {
        name: "rbenv, CocoaPods, Watchman",
        note: "The React Native toolbelt.",
      },
      { name: "Zulu JDK 17", note: "Keeps Gradle happy." },
      {
        name: "gh",
        note: "PRs and reviews without opening a browser.",
        href: "https://cli.github.com",
      },
      {
        name: "chezmoi",
        note: "Dotfiles, versioned.",
        href: "https://chezmoi.io",
      },
    ],
  },
  {
    title: "Fonts",
    items: [
      {
        name: "Geist Mono",
        note: "Editor and terminal. Also on this site.",
        href: "https://vercel.com/font",
      },
      {
        name: "JetBrains Mono, IBM Plex Mono, Iosevka",
        note: "For when I get bored.",
      },
    ],
  },
  {
    title: "Apps",
    items: [
      {
        name: "Raycast",
        note: "Launcher, clipboard history, window management.",
        href: "https://raycast.com",
        image: "/uses/icons/raycast.png",
      },
      {
        name: "Helium",
        note: "Daily browser. Chromium, minus the noise.",
        href: "https://helium.computer",
        image: "/uses/icons/helium.png",
      },
      {
        name: "Brave",
        note: "Second browser for testing and logged-out checks.",
        href: "https://brave.com",
        image: "/uses/icons/brave.png",
      },
      {
        name: "Notion",
        note: "Notes, plans and half-written posts.",
        href: "https://notion.com",
        image: "/uses/icons/notion.png",
      },
      {
        name: "Shottr",
        note: "Screenshots with annotations and pixel measuring.",
        href: "https://shottr.cc",
        image: "/uses/icons/shottr.png",
      },
      {
        name: "Karabiner-Elements",
        note: "Key remapping.",
        href: "https://karabiner-elements.pqrs.org",
        image: "/uses/icons/karabiner.png",
      },
      {
        name: "Klack",
        note: "Mechanical keyboard sounds on any keyboard.",
        href: "https://tryklack.com",
        image: "/uses/icons/klack.png",
      },
      {
        name: "Scroll Reverser",
        note: "Natural scrolling on the trackpad, normal on the mouse.",
        href: "https://pilotmoon.com/scrollreverser/",
        image: "/uses/icons/scroll-reverser.png",
      },
      {
        name: "Tailscale",
        note: "Reaching my machines from anywhere.",
        href: "https://tailscale.com",
        image: "/uses/icons/tailscale.png",
      },
      {
        name: "Slack",
        note: "Work chat.",
        href: "https://slack.com",
        image: "/uses/icons/slack.png",
      },
    ],
  },
];
