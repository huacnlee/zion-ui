// @ts-check

import { div } from "gpui-kit";
import { requiredText } from "./internal.js";
import { theme } from "./theme.js";

/** @typedef {"bright" | "foreground" | "secondary" | "tertiary" | import("./theme.js").Tone} Ink */

/**
 * @param {Ink} ink
 * @returns {import("gpui-kit").Color}
 */
export function inkColor(ink) {
  const t = theme();
  if (ink === "bright" || ink === "foreground" || ink === "secondary" || ink === "tertiary") return t.colors[ink];
  return t.tone(ink).fg;
}

class TextBase {
  #text;
  /** @type {Ink} */
  #ink;
  #size;
  #bold = false;
  #truncate = false;
  #mono;
  /** @param {string} component @param {string} text @param {Ink} ink @param {number} size @param {boolean} mono */
  constructor(component, text, ink, size, mono) {
    this.#text = requiredText(component, "text", text);
    this.#ink = ink;
    this.#size = size;
    this.#mono = mono;
  }
  /** @param {Ink} value */
  ink(value) { this.#ink = value; return this; }
  /** @param {number} value pixels */
  size(value) { this.#size = value; return this; }
  bold() { this.#bold = true; return this; }
  /** One line, cut with an ellipsis when it does not fit. */
  truncate() { this.#truncate = true; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme();
    return div()
      .text_size(this.#size)
      .text_color(inkColor(this.#ink))
      .when(this.#mono, (el) => el.font_family(t.fonts.mono))
      .when(!this.#mono && Boolean(t.fonts.sans), (el) => el.font_family(t.fonts.sans))
      .when(this.#bold, (el) => el.font_medium())
      .when(this.#truncate, (el) => el.min_w_0().truncate())
      .child(this.#text);
  }
}

/** A page or card title: sans-serif, bright. */
export class Heading extends TextBase {
  /** @param {string} text */
  constructor(text) { super("Heading", text, "bright", theme().type.title, false); }
}

/** Body copy: sans-serif in the foreground color. */
export class Text extends TextBase {
  /** @param {string} text */
  constructor(text) { super("Text", text, "foreground", theme().type.body, false); }
}

/** Supporting copy and subtitles. */
export class Muted extends TextBase {
  /** @param {string} text */
  constructor(text) { super("Muted", text, "secondary", theme().type.small, false); }
}

/** Data: numbers, identifiers, models, keys. */
export class Mono extends TextBase {
  /** @param {string} text */
  constructor(text) { super("Mono", text, "foreground", theme().type.small, true); }
}

/** A section's name: small, uppercase, quiet. */
export class SectionLabel extends TextBase {
  /** @param {string} text */
  constructor(text) { super("SectionLabel", String(text).toUpperCase(), "secondary", theme().type.caption, false); }
}
