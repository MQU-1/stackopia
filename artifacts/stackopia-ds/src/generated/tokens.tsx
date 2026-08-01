/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FAFAF5",
      "foreground": "#0D0D0D",
      "border": "#E0E0DB",
      "card": "#FFFFFF",
      "cardForeground": "#0D0D0D",
      "popover": "#FFFFFF",
      "popoverForeground": "#0D0D0D",
      "primary": "#5D8C0A",
      "primaryForeground": "#FFFFFF",
      "secondary": "#F2F2ED",
      "secondaryForeground": "#0D0D0D",
      "muted": "#F2F2ED",
      "mutedForeground": "#707070",
      "accent": "#2E8B57",
      "accentForeground": "#FFFFFF",
      "destructive": "#E53939",
      "destructiveForeground": "#FFFFFF",
      "input": "#E0E0DB",
      "ring": "#5D8C0A",
      "chart1": "#5D8C0A",
      "chart2": "#2E8B57",
      "chart3": "#C4900C",
      "chart4": "#E53939",
      "chart5": "#2B92C5",
      "sidebar": "#F2F2ED",
      "sidebarForeground": "#0D0D0D",
      "sidebarBorder": "#E0E0DB",
      "sidebarPrimary": "#5D8C0A",
      "sidebarPrimaryForeground": "#FFFFFF",
      "sidebarAccent": "#E6E6E1",
      "sidebarAccentForeground": "#0D0D0D",
      "sidebarRing": "#5D8C0A"
    },
    "dark": {
      "background": "#080808",
      "foreground": "#F0F0F0",
      "border": "#222222",
      "card": "#111111",
      "cardForeground": "#F0F0F0",
      "popover": "#111111",
      "popoverForeground": "#F0F0F0",
      "primary": "#C8F135",
      "primaryForeground": "#080808",
      "secondary": "#181818",
      "secondaryForeground": "#F0F0F0",
      "muted": "#181818",
      "mutedForeground": "#666666",
      "accent": "#7EE8A2",
      "accentForeground": "#080808",
      "destructive": "#FF6B6B",
      "destructiveForeground": "#080808",
      "input": "#222222",
      "ring": "#C8F135",
      "chart1": "#C8F135",
      "chart2": "#7EE8A2",
      "chart3": "#FFD166",
      "chart4": "#FF6B6B",
      "chart5": "#5BC4F5",
      "sidebar": "#0D0D0D",
      "sidebarForeground": "#F0F0F0",
      "sidebarBorder": "#222222",
      "sidebarPrimary": "#C8F135",
      "sidebarPrimaryForeground": "#080808",
      "sidebarAccent": "#1A1A1A",
      "sidebarAccentForeground": "#F0F0F0",
      "sidebarRing": "#C8F135"
    }
  },
  "fontFamily": {
    "sans": [
      "DM Sans",
      "sans-serif"
    ],
    "serif": [
      "Syne",
      "sans-serif"
    ],
    "mono": [
      "JetBrains Mono",
      "monospace"
    ]
  },
  "radius": "1rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
