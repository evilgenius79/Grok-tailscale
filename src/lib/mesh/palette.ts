export const PALETTES = [
  { id: "olive", label: "Olive", scheme: "dark", chrome: "#10140f", hint: "Night green. The original." },
  { id: "harbor", label: "Harbor", scheme: "dark", chrome: "#0e141c", hint: "Navy, with a blue mark for machines that are up." },
  { id: "ember", label: "Ember", scheme: "dark", chrome: "#16110e", hint: "Warm charcoal and a peach mark." },
  { id: "violet", label: "Violet", scheme: "dark", chrome: "#121018", hint: "Ink and lilac." },
  { id: "paper", label: "Paper", scheme: "light", chrome: "#f6f3ec", hint: "A light page. Status bar icons switch with it." },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

const KEY = "meshwarden.palette";

export function isPalette(value: string | null | undefined): value is PaletteId {
  return PALETTES.some((palette) => palette.id === value);
}

export function readPalette(): PaletteId {
  if (typeof window === "undefined") return "olive";
  try {
    const stored = localStorage.getItem(KEY);
    return isPalette(stored) ? stored : "olive";
  } catch {
    return "olive";
  }
}

export function applyPalette(id: PaletteId): PaletteId {
  const palette = PALETTES.find((item) => item.id === id) ?? PALETTES[0];
  if (typeof document !== "undefined") {
    document.documentElement.dataset.palette = palette.id;
    document.documentElement.style.colorScheme = palette.scheme;
  }
  try {
    localStorage.setItem(KEY, palette.id);
  } catch {
    /* Palette name only. Never a credential. */
  }
  const bridge = typeof window !== "undefined" ? window.Meshwarden : undefined;
  if (bridge?.setChrome) bridge.setChrome(palette.chrome);
  return palette.id;
}

export const PALETTE_BOOT = `(function(){try{var ok={olive:1,harbor:1,ember:1,violet:1,paper:1};var p=localStorage.getItem("meshwarden.palette");if(!ok[p])return;document.documentElement.dataset.palette=p;document.documentElement.style.colorScheme=p==="paper"?"light":"dark";}catch(e){}})();`;
