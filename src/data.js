// @ts-check

import { div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { optionalRenderable, optionalText, requiredRenderables, requiredText } from "./internal.js";
import { TONES, mix, theme } from "./theme.js";

/** @typedef {import("./theme.js").Tone} Tone */

/** @param {string} component @param {unknown} value @returns {Tone} */
function toneOf(component, value) {
  if (!TONES.includes(/** @type {any} */ (value))) throw new Error(`${component} tone must be one of ${TONES.join(", ")}`);
  return /** @type {Tone} */ (value);
}
/** @param {string} component @param {unknown} value */
function fraction(component, value) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${component} value must be a finite number`);
  return Math.max(0, Math.min(1, number));
}

/**
 * A headline number in monospace with a short note in a tone beside it:
 * `4.82 kW  peak 6.1 kW`.
 */
export class Stat {
  #value;
  #note;
  /** @type {Tone} */
  #tone = "accent";
  #size;

  /** @param {string} value */
  constructor(value) { this.#value = requiredText("Stat", "value", value); this.#size = theme().type.stat; }
  /** @param {string} text */
  note(text) { this.#note = text; return this; }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("Stat", value); return this; }
  /** @param {number} pixels */
  size(pixels) { this.#size = pixels; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), note = optionalText("Stat", "note", this.#note);
    return h_flex().min_w_0().gap(10).items_end().font_family(t.fonts.mono)
      .child(div().flex_shrink_0().text_size(this.#size).text_color(t.colors.bright).child(this.#value))
      .when(Boolean(note), (el) => el.child(div().min_w_0().truncate().pb(Math.round(this.#size / 8)).text_size(t.type.small).text_color(t.tone(this.#tone).fg).child(note)));
  }
}

/** A short status in a tinted pill: `Online`, `Paused`, `HIGH`. */
export class Badge {
  #label;
  /** @type {Tone} */
  #tone = "neutral";
  #mono = false;
  #dot = false;
  /** @param {string} label */
  constructor(label) { this.#label = requiredText("Badge", "label", label); }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("Badge", value); return this; }
  mono() { this.#mono = true; return this; }
  /** Lead with a dot of the tone's color. */
  dot() { this.#dot = true; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), tone = t.tone(this.#tone);
    return h_flex().flex_shrink_0().h(20).px(8).gap(5).items_center().rounded(t.radius.pill)
      .bg(tone.bg).border(1).border_color(tone.border).text_size(t.type.caption).text_color(tone.fg)
      .when(this.#mono, (el) => el.font_family(t.fonts.mono))
      .when(this.#dot, (el) => el.child(div().size(5).rounded(t.radius.pill).bg(tone.solid)))
      .child(this.#label);
  }
}

/** A one-line notice across a card: tinted, centered, with an optional icon. */
export class Callout {
  #text;
  /** @type {Tone} */
  #tone = "warning";
  #icon;
  /** @param {string} text */
  constructor(text) { this.#text = requiredText("Callout", "text", text); }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("Callout", value); return this; }
  /** @param {string} asset */
  icon(asset) { this.#icon = asset; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), tone = t.tone(this.#tone);
    return h_flex().w_full().min_h(30).px(12).py(6).gap(6).items_center().justify_center().rounded(t.radius.control)
      .bg(tone.bg).text_size(t.type.small).text_color(tone.fg)
      .when(Boolean(this.#icon), (el) => el.child(svg(this.#icon).size(12).flex_shrink_0()))
      .child(div().min_w_0().child(this.#text));
  }
}

/** A thin track with a filled share: progress, a score, a share of a budget. */
export class Meter {
  #value;
  /** @type {Tone} */
  #tone = "accent";
  #height = 4;
  /** @param {number} value 0…1 */
  constructor(value) { this.#value = fraction("Meter", value); }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("Meter", value); return this; }
  /** @param {number} pixels */
  height(pixels) { this.#height = pixels; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), fill = this.#tone === "neutral" ? t.colors.foreground : t.tone(this.#tone).solid;
    return h_flex().w_full().h(this.#height).rounded(t.radius.pill).bg(t.colors.raised).overflow_hidden()
      .child(div().h_full().rounded(t.radius.pill).bg(fill).w(`${Math.round(this.#value * 1000) / 10}%`));
  }
}

/** A row of vertical ticks, the filled ones in a tone: a score out of N. */
export class TickBar {
  #value;
  #ticks = 24;
  /** @type {Tone} */
  #tone = "accent";
  #height = 12;
  /** @param {number} value 0…1 */
  constructor(value) { this.#value = fraction("TickBar", value); }
  /** @param {number} count */
  ticks(count) { this.#ticks = Math.max(1, Math.round(count)); return this; }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("TickBar", value); return this; }
  /** @param {number} pixels */
  height(pixels) { this.#height = pixels; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), on = Math.round(this.#value * this.#ticks);
    const fill = this.#tone === "neutral" ? t.colors.foreground : t.tone(this.#tone).solid;
    return h_flex().h(this.#height).gap(2).items_stretch()
      .children(Array.from({ length: this.#ticks }, (_, index) => div().w(3).rounded(1).bg(index < on ? fill : t.colors.raised)));
  }
}

/** Shares of a whole as adjoining colored segments, with gaps between. */
export class SegmentBar {
  /** @type {{ value: number, tone?: Tone, color?: import("gpui-kit").Color }[]} */
  #parts = [];
  #height = 4;
  /** @param {{ value: number, tone?: Tone, color?: import("gpui-kit").Color }[]} parts */
  constructor(parts) {
    if (!Array.isArray(parts) || !parts.length) throw new Error("SegmentBar parts must be a non-empty array");
    this.#parts = parts.map((part) => ({ ...part, value: Math.max(0, Number(part.value) || 0), tone: part.tone ? toneOf("SegmentBar", part.tone) : undefined }));
  }
  /** @param {number} pixels */
  height(pixels) { this.#height = pixels; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), total = this.#parts.reduce((sum, part) => sum + part.value, 0) || 1;
    return h_flex().w_full().h(this.#height).gap(2)
      .children(this.#parts.filter((part) => part.value > 0).map((part) => div().h_full().rounded(t.radius.pill)
        .bg(part.color ?? (part.tone === "neutral" || !part.tone ? t.colors.borderStrong : t.tone(part.tone).solid))
        .w(`${Math.round((part.value / total) * 1000) / 10}%`)));
  }
}

/**
 * Legend rows: a square swatch, a monospace label, and a value right-aligned,
 * so values line up down the card.
 */
export class Legend {
  /** @type {{ label: string, value?: string, tone?: Tone, color?: import("gpui-kit").Color }[]} */
  #items = [];
  #inline = false;
  /** @param {{ label: string, value?: string, tone?: Tone, color?: import("gpui-kit").Color }[]} items */
  constructor(items) { this.#items = items.map((item) => ({ ...item, label: requiredText("Legend", "label", item?.label), tone: item.tone ? toneOf("Legend", item.tone) : undefined })); }
  /** Lay the items out in one wrapping line instead of rows. */
  inline() { this.#inline = true; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    const swatch = (item) => div().size(8).flex_shrink_0().rounded(2)
      .bg(item.color ?? (item.tone && item.tone !== "neutral" ? t.tone(item.tone).solid : c.tertiary));
    if (this.#inline) {
      return h_flex().flex_wrap().gap(14).items_center().font_family(t.fonts.mono).text_size(t.type.small)
        .children(this.#items.map((item) => h_flex().gap(6).items_center().child(swatch(item))
          .child(div().text_color(c.secondary).child(item.label))
          .when(Boolean(item.value), (el) => el.child(div().text_color(c.bright).child(item.value)))));
    }
    return v_flex().w_full().gap(8).font_family(t.fonts.mono).text_size(t.type.small)
      .children(this.#items.map((item) => h_flex().w_full().gap(8).items_center().child(swatch(item))
        .child(div().flex_1().min_w_0().truncate().text_color(c.secondary).child(item.label))
        .when(Boolean(item.value), (el) => el.child(div().flex_shrink_0().text_color(c.bright).child(item.value)))));
  }
}

/** Label and value rows with hairlines between: a device's attributes. */
export class PropertyList {
  /** @type {{ label: string, value: string, tone?: Tone, trailing?: any }[]} */
  #rows = [];
  /** @param {{ label: string, value: string, tone?: Tone, trailing?: any }[]} rows */
  constructor(rows) {
    this.#rows = rows.map((row) => ({ ...row, label: requiredText("PropertyList", "label", row?.label), value: requiredText("PropertyList", "value", row?.value), tone: row.tone ? toneOf("PropertyList", row.tone) : undefined }));
  }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    return v_flex().w_full().font_family(t.fonts.mono).text_size(t.type.small)
      .children(this.#rows.map((row, index) => {
        const trailing = optionalRenderable("PropertyList", "trailing", row.trailing);
        return h_flex().w_full().min_h(32).gap(12).items_center().when(index > 0, (el) => el.border_t(1).border_color(c.border))
          .child(div().w(120).flex_shrink_0().truncate().text_color(c.secondary).child(row.label))
          .child(div().flex_1().min_w_0().truncate().text_color(row.tone ? t.tone(row.tone).fg : c.bright).child(row.value))
          .when(Boolean(trailing), (el) => el.child(trailing));
      }));
  }
}

/** Columns of small label over monospace value: uptime, temperature, cost… */
export class StatStrip {
  /** @type {{ label: string, value: string, tone?: Tone }[]} */
  #items = [];
  /** @param {{ label: string, value: string, tone?: Tone }[]} items */
  constructor(items) {
    this.#items = items.map((item) => ({ ...item, label: requiredText("StatStrip", "label", item?.label), value: requiredText("StatStrip", "value", item?.value), tone: item.tone ? toneOf("StatStrip", item.tone) : undefined }));
  }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    return h_flex().w_full().flex_wrap().gap(28).items_start()
      .children(this.#items.map((item) => v_flex().gap(3).min_w_0()
        .child(div().text_size(t.type.small).text_color(c.secondary).child(item.label))
        .child(div().text_size(t.type.heading).font_family(t.fonts.mono).text_color(item.tone ? t.tone(item.tone).fg : c.bright).child(item.value))));
  }
}

/**
 * Steps toward a goal: done steps are filled accent circles with a check,
 * the rest dashed circles with their number, joined by a line that is solid
 * between finished steps.
 */
export class Steps {
  /** @type {{ title: string, detail?: string, done?: boolean }[]} */
  #steps = [];
  /** @param {{ title: string, detail?: string, done?: boolean }[]} steps */
  constructor(steps) {
    if (!Array.isArray(steps) || !steps.length) throw new Error("Steps needs at least one step");
    this.#steps = steps.map((step) => ({ ...step, title: requiredText("Steps", "title", step?.title) }));
  }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors, accent = t.tone("accent");
    const circle = (step, index) => step.done
      ? h_flex().size(20).flex_shrink_0().rounded(t.radius.pill).bg(c.accent).text_color(c.onLight).items_center().justify_center().text_size(t.type.caption).child("✓")
      : h_flex().size(20).flex_shrink_0().rounded(t.radius.pill).border(1).border_dashed().border_color(accent.fg).text_color(accent.fg)
        .items_center().justify_center().text_size(t.type.caption).font_family(t.fonts.mono).child(String(index + 1));
    const line = (done) => done ? div().flex_1().h(1).mx(6).bg(c.accent) : div().flex_1().h(0).mx(6).border_t(1).border_dashed().border_color(c.dashed);
    return v_flex().w_full().gap(8)
      .child(h_flex().w_full().px(36).items_center()
        .children(this.#steps.flatMap((step, index) => index
          ? [line(Boolean(step.done && this.#steps[index - 1].done)), circle(step, index)]
          : [circle(step, index)])))
      .child(h_flex().w_full().items_start()
        .children(this.#steps.map((step) => v_flex().flex_1().min_w_0().gap(2).items_center()
          .child(div().text_size(t.type.small).text_color(step.done ? c.bright : c.secondary).child(step.title))
          .when(Boolean(step.detail), (el) => el.child(div().text_size(t.type.caption).font_family(t.fonts.mono).text_color(c.tertiary).child(step.detail))))));
  }
}

/** A metric tile: label and status badge, a big value, its meaning, a meter. */
export class MetricTile {
  #label;
  #value;
  #caption;
  #badge;
  #meter;
  /** @type {Tone} */
  #tone = "accent";
  #footnote;
  /** @param {string} label */
  constructor(label) { this.#label = requiredText("MetricTile", "label", label); }
  /** @param {string} text */
  value(text) { this.#value = text; return this; }
  /** @param {string} text */
  caption(text) { this.#caption = text; return this; }
  /** @param {any} element a built `Badge` */
  badge(element) { this.#badge = element; return this; }
  /** @param {number} fill 0…1 */
  meter(fill) { this.#meter = fraction("MetricTile", fill); return this; }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("MetricTile", value); return this; }
  /** @param {string} text */
  footnote(text) { this.#footnote = text; return this; }
  /** @param {import("gpui-kit").Context} cx */
  build(cx) {
    const t = theme(), c = t.colors, value = requiredText("MetricTile", "value", this.#value);
    const badge = optionalRenderable("MetricTile", "badge", this.#badge);
    return v_flex().flex_1().min_w_0().p(14).gap(7).rounded(t.radius.well).bg(c.well).border(1).border_color(c.border)
      .child(h_flex().gap(8).items_center()
        .child(div().flex_1().min_w_0().truncate().text_size(t.type.small).text_color(c.foreground).child(this.#label))
        .when(Boolean(badge), (el) => el.child(badge)))
      .child(div().text_size(t.type.stat).text_color(c.bright).child(value))
      .when(Boolean(this.#caption), (el) => el.child(div().text_size(t.type.caption).text_color(c.secondary).child(this.#caption)))
      .when(this.#meter !== undefined, (el) => el.child(new Meter(this.#meter).tone(this.#tone).height(3).build(cx)))
      .when(Boolean(this.#footnote), (el) => el.child(div().text_size(t.type.caption).text_color(c.secondary).child(this.#footnote)));
  }
}

/**
 * An empty state: an emblem or illustration, a title, a description that
 * names what fills it, and the content that starts it — steps, settings, a
 * primary action.
 */
export class EmptyState {
  #title;
  #description;
  #art;
  /** @type {any[]} */
  #children = [];
  /** @param {string} title */
  constructor(title) { this.#title = requiredText("EmptyState", "title", title); }
  /** @param {string} text */
  description(text) { this.#description = text; return this; }
  /** @param {any} element an `IconBadge` or an illustration */
  art(element) { this.#art = element; return this; }
  /** @param {any[]} elements */
  children(elements) { this.#children = elements; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    const art = optionalRenderable("EmptyState", "art", this.#art);
    const description = optionalText("EmptyState", "description", this.#description);
    const children = requiredRenderables("EmptyState", "children", this.#children);
    return v_flex().w_full().items_center().gap(6).py(8)
      .when(Boolean(art), (el) => el.child(div().pb(12).child(art)))
      .child(div().text_size(t.type.title).font_medium().text_color(c.bright).child(this.#title))
      .when(Boolean(description), (el) => el.child(div().max_w(440).text_center().text_size(t.type.body).text_color(c.secondary).child(description)))
      .when(children.length > 0, (el) => el.child(v_flex().w_full().pt(12).gap(14).items_center().children(children)));
  }
}

/** A tinted panel for one fact and its label: `This week  -6%`. */
export class ToneTile {
  #label;
  #value;
  /** @type {Tone} */
  #tone = "accent";
  /** @param {string} label */
  constructor(label) { this.#label = requiredText("ToneTile", "label", label); }
  /** @param {string} text */
  value(text) { this.#value = text; return this; }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("ToneTile", value); return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), tone = t.tone(this.#tone), value = requiredText("ToneTile", "value", this.#value);
    return v_flex().flex_1().min_w_0().px(12).py(8).gap(1).rounded(t.radius.control).bg(mix(t.colors.canvas, tone.solid, 0.1))
      .child(div().text_size(t.type.small).text_color(tone.fg).child(this.#label))
      .child(div().text_size(t.type.body).text_color(t.colors.bright).child(value));
  }
}

/**
 * Three dots that brighten in turn: work in progress whose length is unknown.
 *
 * The application advances `step` on a timer (a few times a second is enough)
 * and calls `cx.notify()`; each dot's opacity then eases to its new target in
 * native code, so the motion stays smooth without a redraw per frame.
 */
export class Pulse {
  #id;
  #step = 0;
  /** @type {Tone} */
  #tone = "accent";
  /** @param {string} id stable, so the dots keep their motion across renders */
  constructor(id) { this.#id = requiredText("Pulse", "id", id); }
  /** @param {number} value advances by one per tick */
  step(value) { this.#step = Math.max(0, Math.floor(Number(value) || 0)); return this; }
  /** @param {Tone} value */
  tone(value) { this.#tone = toneOf("Pulse", value); return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), color = this.#tone === "neutral" ? t.colors.foreground : t.tone(this.#tone).solid;
    return h_flex().flex_shrink_0().gap(4).items_center()
      .children([0, 1, 2].map((index) => div().id(`${this.#id}-${index}`).size(5).rounded(t.radius.pill).bg(color)
        .opacity(this.#step % 3 === index ? 1 : 0.22)
        .transition("opacity", { duration: 320, easing: "ease-in-out" })));
  }
}

/**
 * A thin track with a short bar sweeping back and forth across it, for the
 * edge of a surface that is busy. Like `Pulse`, it moves when the
 * application advances `step`; each step sends the bar to the other end.
 */
export class ScanLine {
  #id;
  #step = 0;
  #period = 900;
  /** @param {string} id stable, so the bar keeps its motion across renders */
  constructor(id) { this.#id = requiredText("ScanLine", "id", id); }
  /** @param {number} value */
  step(value) { this.#step = Math.max(0, Math.floor(Number(value) || 0)); return this; }
  /** How long one sweep takes, in milliseconds; match the step interval. @param {number} ms */
  period(ms) { this.#period = Math.max(100, Number(ms) || 900); return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme();
    return div().relative().w_full().h(2).overflow_hidden()
      .child(div().id(this.#id).absolute().top(0).h_full().w("28%").rounded(t.radius.pill).bg(t.colors.accent)
        .left(this.#step % 2 === 0 ? "0%" : "72%")
        .transition("left", { duration: this.#period, easing: "ease-in-out" }));
  }
}
