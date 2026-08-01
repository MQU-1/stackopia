/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#F1E9D8",
      "foreground": "#0B2224",
      "border": "#D6CDB4",
      "card": "#E8DFC9",
      "cardForeground": "#0B2224",
      "popover": "#E8DFC9",
      "popoverForeground": "#0B2224",
      "primary": "#A97B1B",
      "primaryForeground": "#0B2224",
      "secondary": "#E8DFC9",
      "secondaryForeground": "#0B2224",
      "muted": "#DED2B4",
      "mutedForeground": "#4B6362",
      "accent": "#2F7A68",
      "accentForeground": "#F1E9D8",
      "destructive": "#A6523A",
      "destructiveForeground": "#F1E9D8",
      "input": "#D6CDB4",
      "ring": "#A97B1B",
      "chart1": "#A97B1B",
      "chart2": "#2F7A68",
      "chart3": "#8A6A18",
      "chart4": "#A6523A",
      "chart5": "#33695E",
      "sidebar": "#E8DFC9",
      "sidebarForeground": "#0B2224",
      "sidebarBorder": "#D6CDB4",
      "sidebarPrimary": "#A97B1B",
      "sidebarPrimaryForeground": "#0B2224",
      "sidebarAccent": "#DED2B4",
      "sidebarAccentForeground": "#0B2224",
      "sidebarRing": "#A97B1B"
    },
    "dark": {
      "background": "#0B2224",
      "foreground": "#F1E9D8",
      "border": "#234345",
      "card": "#123336",
      "cardForeground": "#F1E9D8",
      "popover": "#123336",
      "popoverForeground": "#F1E9D8",
      "primary": "#C9982E",
      "primaryForeground": "#0B2224",
      "secondary": "#123336",
      "secondaryForeground": "#F1E9D8",
      "muted": "#1A4340",
      "mutedForeground": "#C9C0AC",
      "accent": "#4EA189",
      "accentForeground": "#0B2224",
      "destructive": "#C0623F",
      "destructiveForeground": "#F1E9D8",
      "input": "#234345",
      "ring": "#E3B44E",
      "chart1": "#E3B44E",
      "chart2": "#6BC2A8",
      "chart3": "#C9982E",
      "chart4": "#4EA189",
      "chart5": "#B5654A",
      "sidebar": "#0F2A2C",
      "sidebarForeground": "#F1E9D8",
      "sidebarBorder": "#234345",
      "sidebarPrimary": "#C9982E",
      "sidebarPrimaryForeground": "#0B2224",
      "sidebarAccent": "#1A4340",
      "sidebarAccentForeground": "#F1E9D8",
      "sidebarRing": "#E3B44E"
    }
  },
  "fontFamily": {
    "sans": [
      "IBM Plex Sans",
      "IBM Plex Sans Arabic",
      "-apple-system",
      "sans-serif"
    ],
    "serif": [
      "Fraunces",
      "Georgia",
      "serif"
    ],
    "mono": [
      "IBM Plex Mono",
      "ui-monospace",
      "monospace"
    ]
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
