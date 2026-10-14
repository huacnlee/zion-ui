// @ts-check

import { set_theme } from "gpui-base";

/** @typedef {import("gpui-kit").Color} Color */
/** @typedef {"accent" | "success" | "warning" | "danger" | "info" | "neutral"} Tone */
/** @typedef {"canvas" | "main" | "card" | "raised" | "well" | "border" | "borderStrong" | "dashed" | "foreground" | "bright" | "secondary" | "tertiary" | "light" | "onLight" | "accent" | "success" | "warning" | "danger" | "info"} PaletteRole */

export const TONES = /** @type {const} */ (["accent", "success", "warning", "danger", "info", "neutral"]);

/** @param {string} hex */
function channels(hex) {
  const value = String(hex).replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value)) {
    throw new Error(`Zion colors must be #rrggbb or #rrggbbaa, got ${JSON.stringify(hex)}`);
  }
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

/** @param {number[]} rgb @returns {Color} */
function hex(rgb) {
  return /** @type {Color} */ (`#${rgb.map((part) => Math.round(part).toString(16).padStart(2, "0")).join("")}`);
}

/**
 * `color` moved toward `toward` by `amount` (0 keeps `color`, 1 is `toward`).
 * @param {string} color @param {string} toward @param {number} amount
 * @returns {Color}
 */
export function mix(color, toward, amount) {
  const from = channels(color), to = channels(toward);
  return hex(from.map((part, index) => part + (to[index] - part) * amount));
}

/**
 * `color` at an opacity, as `#rrggbbaa`.
 * @param {string} color @param {number} opacity
 * @returns {Color}
 */
export function alpha(color, opacity) {
  const value = Math.max(0, Math.min(1, opacity));
  return /** @type {Color} */ (`${hex(channels(color))}${Math.round(value * 255).toString(16).padStart(2, "0")}`);
}

/**
 * Zion, the default theme: a phosphor screen. Surfaces are near-black with
 * the faintest green cast, stepped by lightness rather than hue, and every
 * signal color is a phosphor of the same, deliberately muted, brightness — green for the accent
 * and success, amber for warnings, red for danger, blue for information — so
 * the colors on a screen read as one family. All four sit at OKLCH lightness
 * 0.72 and chroma 0.15 (amber 0.135, the most sRGB holds there) and differ
 * only in hue, so none is louder than another. `canvas` is what navigation sits on,
 * `main` the deeper panel the work happens in, `card` and `raised` the steps
 * above it, and `well` the recess below it that fields and tracks sit in.
 */
/** @type {Readonly<Record<PaletteRole, string>>} */
export const DEFAULT_PALETTE = Object.freeze({
  canvas: "#0c0f0d",
  main: "#070908",
  card: "#121614",
  raised: "#1b201d",
  well: "#090b0a",
  border: "#1f2622",
  borderStrong: "#2d3631",
  dashed: "#4b5751",
  foreground: "#d8e4dc",
  bright: "#f1fbf4",
  secondary: "#7f8c85",
  tertiary: "#53605a",
  light: "#e4efe8",
  onLight: "#06120a",
  accent: "#53be70",
  success: "#53be70",
  warning: "#ce9b2b",
  danger: "#f47b74",
  info: "#4cabfd",
});

/**
 * Named themes. Each is a complete palette, so switching never mixes two.
 * @type {Readonly<Record<string, Readonly<Record<PaletteRole, string>>>>}
 */
export const THEMES = Object.freeze({ zion: DEFAULT_PALETTE });

/** Radii nest: the main panel, cards in it, wells in those, then controls. */
export const RADIUS = Object.freeze({ main: 14, card: 12, well: 10, control: 8, chip: 6, pill: 999 });

/**
 * Two families. Sans-serif carries titles, labels and prose; monospace carries
 * data — numbers, models, keys, identifiers — the way the reference grammar
 * mixes them on one line.
 */
export const TYPE = Object.freeze({
  caption: 10, small: 11, body: 12, label: 13, title: 14, heading: 16, stat: 20, display: 22,
});

/** @type {ReturnType<typeof derive>} */
let active;

/**
 * @param {string} name
 * @param {Partial<typeof DEFAULT_PALETTE>} palette
 * @param {{ mono?: string, sans?: string }} fonts
 */
function derive(name, palette, fonts) {
  const base = THEMES[name];
  if (!base) throw new Error(`Unknown theme ${JSON.stringify(name)}; known themes: ${Object.keys(THEMES).join(", ")}`);
  const colors = /** @type {Record<PaletteRole, Color>} */ ({ ...base, ...palette });
  // Reject a malformed color here, once, instead of in whichever build reads it.
  for (const value of Object.values(colors)) channels(value);
  /** @param {Tone} tone */
  const tone = (tone) => {
    const base = tone === "neutral" ? colors.secondary : colors[tone];
    return {
      fg: tone === "neutral" ? colors.foreground : base,
      bg: mix(colors.canvas, base, tone === "neutral" ? 0.08 : 0.1),
      border: mix(colors.canvas, base, tone === "neutral" ? 0.18 : 0.26),
      solid: base,
    };
  };
  return {
    name,
    colors: {
      ...colors,
      hover: alpha(colors.foreground, 0.05),
      selected: alpha(colors.foreground, 0.09),
      pressed: alpha(colors.foreground, 0.13),
      clear: /** @type {Color} */ ("#00000000"),
      scrim: /** @type {Color} */ ("#000000b3"),
    },
    tone,
    radius: RADIUS,
    type: TYPE,
    fonts: { mono: fonts.mono ?? "JetBrains Mono", sans: fonts.sans },
  };
}

/**
 * The active theme. Components read it while they build, so a call to
 * `applyTheme` and one `cx.notify()` restyle the whole window.
 */
export function theme() {
  if (!active) active = derive("zion", {}, {});
  return active;
}

/**
 * Installs the Zion look: its palette as gpui-shell's semantic tokens (so base
 * and component widgets such as inputs and Markdown follow it) and as the
 * colors Zion components read.
 *
 * @param {{ theme?: string, palette?: Partial<typeof DEFAULT_PALETTE>, accent?: string, mono?: string, sans?: string }} [options]
 *   `theme` names one of `THEMES` (default `zion`); `palette` overrides
 *   its roles and `accent` is shorthand for `palette.accent`; `mono` names the
 *   monospace family, which an application usually resolves from the system.
 *   `sans` names the family for words. For Chinese, Japanese or Korean text,
 *   name a CJK family that also draws Latin (Noto Sans CJK SC, PingFang SC):
 *   GPUI lowers a line's baseline to fit a fallback font's taller ascent but
 *   keeps the primary font's line box, so mixed text sits low when its CJK
 *   glyphs come from a fallback. A name given once is kept by later calls
 *   that name only the other family.
 */
export function applyTheme(options = {}) {
  const palette = { ...options.palette, ...(options.accent ? { accent: options.accent } : {}) };
  // Fonts are often resolved one at a time; a call that names one keeps the other.
  const fonts = { mono: options.mono ?? active?.fonts.mono, sans: options.sans ?? active?.fonts.sans };
  active = derive(options.theme ?? "zion", palette, fonts);
  const c = active.colors;
  set_theme({
    appearance: "dark",
    tokens: {
      colors: {
        background: c.main, foreground: c.foreground,
        surface: c.card, surface_foreground: c.foreground,
        primary: c.accent, primary_foreground: c.onLight,
        secondary: c.raised, secondary_foreground: c.foreground,
        muted: c.card, muted_foreground: c.secondary,
        accent: c.selected, accent_foreground: c.bright,
        destructive: c.danger, destructive_foreground: c.onLight,
        border: c.border, input: c.borderStrong, ring: c.accent,
        selection: alpha(c.accent, 0.3),
      },
      radius: { none: 0, sm: RADIUS.chip, md: RADIUS.control, lg: RADIUS.well, xl: RADIUS.card, full: RADIUS.pill },
      spacing: { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
    },
  });
  return active;
}
