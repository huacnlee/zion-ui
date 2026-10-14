export type Color = import("gpui-kit").Color;
export type Tone = "accent" | "success" | "warning" | "danger" | "info" | "neutral";
export type PaletteRole = "canvas" | "main" | "card" | "raised" | "well" | "border" | "borderStrong" | "dashed" | "foreground" | "bright" | "secondary" | "tertiary" | "light" | "onLight" | "accent" | "success" | "warning" | "danger" | "info";
/** @typedef {import("gpui-kit").Color} Color */
/** @typedef {"accent" | "success" | "warning" | "danger" | "info" | "neutral"} Tone */
/** @typedef {"canvas" | "main" | "card" | "raised" | "well" | "border" | "borderStrong" | "dashed" | "foreground" | "bright" | "secondary" | "tertiary" | "light" | "onLight" | "accent" | "success" | "warning" | "danger" | "info"} PaletteRole */
export declare const TONES: readonly ["accent", "success", "warning", "danger", "info", "neutral"];
/**
 * `color` moved toward `toward` by `amount` (0 keeps `color`, 1 is `toward`).
 * @param {string} color @param {string} toward @param {number} amount
 * @returns {Color}
 */
export declare function mix(color: string, toward: string, amount: number): Color;
/**
 * `color` at an opacity, as `#rrggbbaa`.
 * @param {string} color @param {number} opacity
 * @returns {Color}
 */
export declare function alpha(color: string, opacity: number): Color;
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
export declare const DEFAULT_PALETTE: Readonly<Record<PaletteRole, string>>;
/**
 * Named themes. Each is a complete palette, so switching never mixes two.
 * @type {Readonly<Record<string, Readonly<Record<PaletteRole, string>>>>}
 */
export declare const THEMES: Readonly<Record<string, Readonly<Record<PaletteRole, string>>>>;
/** Radii nest: the main panel, cards in it, wells in those, then controls. */
export declare const RADIUS: Readonly<{
    main: 14;
    card: 12;
    well: 10;
    control: 8;
    chip: 6;
    pill: 999;
}>;
/**
 * Two families. Sans-serif carries titles, labels and prose; monospace carries
 * data — numbers, models, keys, identifiers — the way the reference grammar
 * mixes them on one line.
 */
export declare const TYPE: Readonly<{
    caption: 10;
    small: 11;
    body: 12;
    label: 13;
    title: 14;
    heading: 16;
    stat: 20;
    display: 22;
}>;
/**
 * The active theme. Components read it while they build, so a call to
 * `applyTheme` and one `cx.notify()` restyle the whole window.
 */
export declare function theme(): {
    name: string;
    colors: {
        hover: import("gpui-kit").Color;
        selected: import("gpui-kit").Color;
        pressed: import("gpui-kit").Color;
        clear: Color;
        scrim: Color;
        accent: import("gpui-kit").Color;
        border: import("gpui-kit").Color;
        borderStrong: import("gpui-kit").Color;
        bright: import("gpui-kit").Color;
        canvas: import("gpui-kit").Color;
        card: import("gpui-kit").Color;
        danger: import("gpui-kit").Color;
        dashed: import("gpui-kit").Color;
        foreground: import("gpui-kit").Color;
        info: import("gpui-kit").Color;
        light: import("gpui-kit").Color;
        main: import("gpui-kit").Color;
        onLight: import("gpui-kit").Color;
        raised: import("gpui-kit").Color;
        secondary: import("gpui-kit").Color;
        success: import("gpui-kit").Color;
        tertiary: import("gpui-kit").Color;
        warning: import("gpui-kit").Color;
        well: import("gpui-kit").Color;
    };
    tone: (tone: Tone) => {
        fg: import("gpui-kit").Color;
        bg: import("gpui-kit").Color;
        border: import("gpui-kit").Color;
        solid: import("gpui-kit").Color;
    };
    radius: Readonly<{
        main: 14;
        card: 12;
        well: 10;
        control: 8;
        chip: 6;
        pill: 999;
    }>;
    type: Readonly<{
        caption: 10;
        small: 11;
        body: 12;
        label: 13;
        title: 14;
        heading: 16;
        stat: 20;
        display: 22;
    }>;
    fonts: {
        mono: string;
        sans: string;
    };
};
/**
 * Installs the Zion look: its palette as gpui-shell's semantic tokens (so base
 * and component widgets such as inputs and Markdown follow it) and as the
 * colors Zion components read.
 *
 * @param {{ theme?: string, palette?: Partial<typeof DEFAULT_PALETTE>, accent?: string, mono?: string, sans?: string }} [options]
 *   `theme` names one of `THEMES` (default `zion`); `palette` overrides
 *   its roles and `accent` is shorthand for `palette.accent`; `mono` names the
 *   monospace family, which an application usually resolves from the system.
 */
export declare function applyTheme(options?: {
    theme?: string;
    palette?: Partial<typeof DEFAULT_PALETTE>;
    accent?: string;
    mono?: string;
    sans?: string;
}): {
    name: string;
    colors: {
        hover: import("gpui-kit").Color;
        selected: import("gpui-kit").Color;
        pressed: import("gpui-kit").Color;
        clear: Color;
        scrim: Color;
        accent: import("gpui-kit").Color;
        border: import("gpui-kit").Color;
        borderStrong: import("gpui-kit").Color;
        bright: import("gpui-kit").Color;
        canvas: import("gpui-kit").Color;
        card: import("gpui-kit").Color;
        danger: import("gpui-kit").Color;
        dashed: import("gpui-kit").Color;
        foreground: import("gpui-kit").Color;
        info: import("gpui-kit").Color;
        light: import("gpui-kit").Color;
        main: import("gpui-kit").Color;
        onLight: import("gpui-kit").Color;
        raised: import("gpui-kit").Color;
        secondary: import("gpui-kit").Color;
        success: import("gpui-kit").Color;
        tertiary: import("gpui-kit").Color;
        warning: import("gpui-kit").Color;
        well: import("gpui-kit").Color;
    };
    tone: (tone: Tone) => {
        fg: import("gpui-kit").Color;
        bg: import("gpui-kit").Color;
        border: import("gpui-kit").Color;
        solid: import("gpui-kit").Color;
    };
    radius: Readonly<{
        main: 14;
        card: 12;
        well: 10;
        control: 8;
        chip: 6;
        pill: 999;
    }>;
    type: Readonly<{
        caption: 10;
        small: 11;
        body: 12;
        label: 13;
        title: 14;
        heading: 16;
        stat: 20;
        display: 22;
    }>;
    fonts: {
        mono: string;
        sans: string;
    };
};
