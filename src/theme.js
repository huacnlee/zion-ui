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
 * Ember, the default theme: neutral graphite surfaces and one warm gold
 * accent, like the last glow in a dark fire.
 *
 * Surfaces step by lightness, not by hue, so a screen keeps one temperature and
 * the accent is the only warm thing on it. `canvas` is what navigation sits on,
 * `main` the deeper panel the work happens in, `card` and `raised` the steps
 * above it, and `well` the recess below it that fields and tracks sit in.
 */
/** @type {Readonly<Record<PaletteRole, string>>} */
export const DEFAULT_PALETTE = Object.freeze({
  canvas: "#111111",
  main: "#0b0b0b",
  card: "#171717",
  raised: "#212121",
  well: "#0d0d0d",
  border: "#262626",
  borderStrong: "#363636",
  dashed: "#555555",
  foreground: "#ececec",
  bright: "#ffffff",
  secondary: "#8c8c8c",
  tertiary: "#5d5d5d",
  light: "#f2f2f2",
  onLight: "#111111",
  accent: "#e2b24f",
  success: "#5fd18f",
  warning: "#f0a35a",
  danger: "#f2706d",
  info: "#72a7f5",
});

/**
 * Named themes. Each is a complete palette, so switching never mixes two.
 * @type {Readonly<Record<string, Readonly<Record<PaletteRole, string>>>>}
 */
export const THEMES = Object.freeze({ ember: DEFAULT_PALETTE });

/** Radii nest: the main panel, cards in it, wells in those, then controls. */
export const RADIUS = Object.freeze({ main: 18, card: 16, well: 12, control: 10, chip: 8, pill: 999 });

/**
 * Two families. Sans-serif carries titles, labels and prose; monospace carries
 * data — numbers, models, keys, identifiers — the way the reference grammar
 * mixes them on one line.
 */
export const TYPE = Object.freeze({
  caption: 11, small: 12, body: 13, label: 14, title: 15, heading: 20, display: 28,
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
      bg: mix(colors.canvas, base, tone === "neutral" ? 0.08 : 0.13),
      border: mix(colors.canvas, base, tone === "neutral" ? 0.18 : 0.32),
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
  if (!active) active = derive("ember", {}, {});
  return active;
}

/**
 * Installs the Zion look: its palette as gpui-shell's semantic tokens (so base
 * and component widgets such as inputs and Markdown follow it) and as the
 * colors Zion components read.
 *
 * @param {{ theme?: string, palette?: Partial<typeof DEFAULT_PALETTE>, accent?: string, mono?: string, sans?: string }} [options]
 *   `theme` names one of `THEMES` (default `ember`); `palette` overrides
 *   its roles and `accent` is shorthand for `palette.accent`; `mono` names the
 *   monospace family, which an application usually resolves from the system.
 */
export function applyTheme(options = {}) {
  const palette = { ...options.palette, ...(options.accent ? { accent: options.accent } : {}) };
  active = derive(options.theme ?? "ember", palette, { mono: options.mono, sans: options.sans });
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
