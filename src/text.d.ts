export type Ink = "bright" | "foreground" | "secondary" | "tertiary" | import("./theme.js").Tone;
/** @typedef {"bright" | "foreground" | "secondary" | "tertiary" | import("./theme.js").Tone} Ink */
/**
 * @param {Ink} ink
 * @returns {import("gpui-kit").Color}
 */
export declare function inkColor(ink: Ink): import("gpui-kit").Color;
declare class TextBase {
    #private;
    /** @param {string} component @param {string} text @param {Ink} ink @param {number} size @param {boolean} mono */
    constructor(component: string, text: string, ink: Ink, size: number, mono: boolean);
    /** @param {Ink} value */
    ink(value: Ink): this;
    /** @param {number} value pixels */
    size(value: number): this;
    bold(): this;
    /** One line, cut with an ellipsis when it does not fit. */
    truncate(): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A page or card title: sans-serif, bright. */
export declare class Heading extends TextBase {
    /** @param {string} text */
    constructor(text: string);
}
/** Body copy: sans-serif in the foreground color. */
export declare class Text extends TextBase {
    /** @param {string} text */
    constructor(text: string);
}
/** Supporting copy and subtitles. */
export declare class Muted extends TextBase {
    /** @param {string} text */
    constructor(text: string);
}
/** Data: numbers, identifiers, models, keys. */
export declare class Mono extends TextBase {
    /** @param {string} text */
    constructor(text: string);
}
/** A section's name: small, uppercase, quiet. */
export declare class SectionLabel extends TextBase {
    /** @param {string} text */
    constructor(text: string);
}
export {};
