// @ts-check

import { div, svg } from "gpui-kit";
import { Button as BaseButton, Input, h_flex, v_flex } from "gpui-base";
import { optionalCallback, optionalText, requiredText, stableId } from "./internal.js";
import { mix, theme } from "./theme.js";

/** @typedef {"primary" | "secondary" | "outline" | "ghost" | "danger" | "accent"} Variant */
/** @typedef {"sm" | "md" | "lg"} Size */
/** @typedef {(event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void} ClickHandler */

const VARIANTS = /** @type {const} */ (["primary", "secondary", "outline", "ghost", "danger", "accent"]);
const SIZES = /** @type {const} */ ({ sm: { h: 24, px: 8, text: 11, icon: 12, radius: 6 }, md: { h: 30, px: 12, text: 12, icon: 13, radius: 8 }, lg: { h: 36, px: 14, text: 13, icon: 14, radius: 8 } });

/** @param {string} component @param {unknown} value @returns {Variant} */
function variantOf(component, value) {
  if (!VARIANTS.includes(/** @type {any} */ (value))) throw new Error(`${component} variant must be one of ${VARIANTS.join(", ")}`);
  return /** @type {Variant} */ (value);
}
/** @param {string} component @param {unknown} value @returns {Size} */
function sizeOf(component, value) {
  if (!(String(value) in SIZES)) throw new Error(`${component} size must be sm, md or lg`);
  return /** @type {Size} */ (value);
}

/**
 * Every variant's chrome. The border is always 1px and always present, clear
 * where a variant has none, so hover and selection only recolor and nothing
 * beside the control moves.
 * @param {Variant} variant
 */
export function variantChrome(variant) {
  const c = theme().colors;
  switch (variant) {
    case "primary": return { bg: c.light, hover: c.bright, pressed: mix(c.light, c.canvas, 0.12), border: c.light, ink: c.onLight };
    case "secondary": return { bg: c.raised, hover: mix(c.raised, c.foreground, 0.06), pressed: mix(c.raised, c.foreground, 0.1), border: c.clear, ink: c.foreground };
    case "outline": return { bg: c.clear, hover: c.hover, pressed: c.pressed, border: c.borderStrong, ink: c.foreground };
    case "ghost": return { bg: c.clear, hover: c.hover, pressed: c.pressed, border: c.clear, ink: c.foreground };
    case "danger": { const t = theme().tone("danger"); return { bg: t.bg, hover: mix(t.bg, t.solid, 0.08), pressed: mix(t.bg, t.solid, 0.14), border: t.border, ink: t.fg }; }
    case "accent": { const t = theme().tone("accent"); return { bg: t.bg, hover: mix(t.bg, t.solid, 0.08), pressed: mix(t.bg, t.solid, 0.14), border: t.border, ink: t.fg }; }
  }
}

/** @param {string | undefined} asset @param {number} size */
const iconOf = (asset, size) => asset ? svg(asset).size(size).flex_shrink_0() : null;

export class Button {
  #id;
  #label;
  #icon;
  #trailingIcon;
  /** @type {Variant} */
  #variant = "secondary";
  /** @type {Size} */
  #size = "md";
  #disabled = false;
  #full = false;
  #uppercase = false;
  #tooltip;
  /** @type {ClickHandler | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Button", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {string} asset application-root-relative SVG path */
  icon(asset) { this.#icon = asset; return this; }
  /** @param {string} asset application-root-relative SVG path */
  trailingIcon(asset) { this.#trailingIcon = asset; return this; }
  /** @param {Variant} value */
  variant(value) { this.#variant = variantOf("Button", value); return this; }
  /** @param {Size} value */
  size(value) { this.#size = sizeOf("Button", value); return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** Stretch to the parent's width. */
  fullWidth() { this.#full = true; return this; }
  /** Footer commands in the reference grammar: small, uppercase, spaced. */
  uppercase() { this.#uppercase = true; return this; }
  /** @param {string} text */
  tooltip(text) { this.#tooltip = text; return this; }
  /** @param {ClickHandler | undefined} callback */
  onClick(callback) { this.#onClick = optionalCallback("Button", "onClick", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const label = requiredText("Button", "label", this.#label);
    const tooltip = optionalText("Button", "tooltip", this.#tooltip);
    const s = SIZES[this.#size], chrome = variantChrome(this.#variant), disabled = this.#disabled;
    const onClick = this.#onClick;
    return BaseButton.new(this.#id)
      .h(s.h).px(s.px).flex_shrink_0()
      .rounded(s.radius).border(1).border_color(chrome.border).bg(chrome.bg)
      .text_color(chrome.ink).text_size(this.#uppercase ? s.text - 1 : s.text)
      .accessibility_label(label)
      .when(this.#full, (el) => el.w_full())
      .disabled(disabled).when(disabled, (el) => el.opacity(0.45))
      .when(!disabled, (el) => el.hover((style) => style.bg(chrome.hover)).active((style) => style.bg(chrome.pressed)))
      .when(Boolean(tooltip), (el) => el.tooltip(tooltip))
      .when(Boolean(onClick), (el) => el.on_click((event, cx) => onClick(event, cx)))
      .child(h_flex().h_full().w_full().gap(6).items_center().justify_center()
        .when(Boolean(this.#icon), (el) => el.child(iconOf(this.#icon, s.icon)))
        .child(this.#uppercase ? label.toUpperCase() : label)
        .when(Boolean(this.#trailingIcon), (el) => el.child(iconOf(this.#trailingIcon, s.icon))));
  }
}

/** A square button with an icon and an accessible description. */
export class IconButton {
  #id;
  #icon;
  #description;
  /** @type {Variant} */
  #variant = "ghost";
  /** @type {Size} */
  #size = "md";
  #disabled = false;
  #selected = false;
  /** @type {ClickHandler | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("IconButton", id); }
  /** @param {string} asset */
  icon(asset) { this.#icon = asset; return this; }
  /** The accessible name and tooltip. @param {string} text */
  description(text) { this.#description = text; return this; }
  /** @param {Variant} value */
  variant(value) { this.#variant = variantOf("IconButton", value); return this; }
  /** @param {Size} value */
  size(value) { this.#size = sizeOf("IconButton", value); return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** A pressed toggle: the selected fill, kept across hover. @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** @param {ClickHandler | undefined} callback */
  onClick(callback) { this.#onClick = optionalCallback("IconButton", "onClick", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const icon = requiredText("IconButton", "icon", this.#icon);
    const description = requiredText("IconButton", "description", this.#description);
    const s = SIZES[this.#size], chrome = variantChrome(this.#variant), c = theme().colors;
    const bg = this.#selected ? c.selected : chrome.bg, disabled = this.#disabled, onClick = this.#onClick;
    return BaseButton.new(this.#id)
      .size(s.h).flex_shrink_0().rounded(s.radius).border(1).border_color(chrome.border).bg(bg)
      .text_color(this.#selected ? c.bright : chrome.ink)
      .accessibility_label(description).tooltip(description)
      .disabled(disabled).when(disabled, (el) => el.opacity(0.45))
      .when(!disabled, (el) => el.hover((style) => style.bg(this.#selected ? c.selected : chrome.hover)).active((style) => style.bg(chrome.pressed)))
      .when(Boolean(onClick), (el) => el.on_click((event, cx) => onClick(event, cx)))
      .child(h_flex().size_full().items_center().justify_center().child(svg(icon).size(s.icon)));
  }
}

/**
 * One choice out of a few: a recessed track with the chosen option raised.
 * Options keep their width when chosen, so the track never reflows.
 */
export class Segmented {
  #id;
  /** @type {{ id: string, label: string }[]} */
  #options = [];
  #selected;
  #fill = false;
  #mono = false;
  /** @type {((id: string, cx: import("gpui-kit").Context) => void) | undefined} */
  #onSelect;
  #disabled = false;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Segmented", id); }
  /** @param {{ id: string, label: string }[]} values */
  options(values) {
    if (!Array.isArray(values) || !values.length) throw new Error("Segmented options must be a non-empty array");
    this.#options = values.map((option) => ({ id: stableId("Segmented option", option?.id), label: requiredText("Segmented", "option label", option?.label) }));
    return this;
  }
  /** @param {string} id */
  selected(id) { this.#selected = id; return this; }
  /** Share the width equally instead of sizing to the labels. */
  fill() { this.#fill = true; return this; }
  /** Set the labels in the monospace family, for values such as `1×` or `v2`. */
  mono() { this.#mono = true; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {(id: string, cx: import("gpui-kit").Context) => void} callback */
  onSelect(callback) { this.#onSelect = optionalCallback("Segmented", "onSelect", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    if (!this.#options.length) throw new Error("Segmented options must be a non-empty array");
    const t = theme(), c = t.colors, onSelect = this.#onSelect;
    return h_flex().p(2).gap(2).rounded(t.radius.control).bg(c.well).border(1).border_color(c.border)
      .when(this.#fill, (el) => el.w_full())
      .children(this.#options.map((option) => {
        const on = option.id === this.#selected;
        return BaseButton.new(`${this.#id}-${option.id}`)
          .h(24).px(10).rounded(t.radius.chip).border(1)
          .border_color(on ? c.borderStrong : c.clear).bg(on ? c.raised : c.clear)
          .text_size(t.type.small).text_color(on ? c.bright : c.secondary)
          .when(this.#mono, (el) => el.font_family(t.fonts.mono))
          .when(this.#fill, (el) => el.flex_1())
          .accessibility_label(option.label)
          .disabled(this.#disabled).when(this.#disabled, (el) => el.opacity(0.45))
          .when(!on && !this.#disabled, (el) => el.hover((style) => style.text_color(c.foreground)))
          .when(Boolean(onSelect), (el) => el.on_click((_event, cx) => onSelect(option.id, cx)))
          .child(h_flex().size_full().items_center().justify_center().child(option.label));
      }));
  }
}

/**
 * A compact, monospace token: a filter, a suggestion, a tag. Selected chips
 * take the accent tone; a removable chip carries its own × button.
 */
export class Chip {
  #id;
  #label;
  #selected = false;
  #mono = true;
  /** @type {ClickHandler | undefined} */
  #onClick;
  /** @type {ClickHandler | undefined} */
  #onRemove;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Chip", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** Set the label in the sans-serif family instead. */
  sans() { this.#mono = false; return this; }
  /** @param {ClickHandler | undefined} callback */
  onClick(callback) { this.#onClick = optionalCallback("Chip", "onClick", callback); return this; }
  /** @param {ClickHandler | undefined} callback */
  onRemove(callback) { this.#onRemove = optionalCallback("Chip", "onRemove", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const label = requiredText("Chip", "label", this.#label);
    const t = theme(), c = t.colors, accent = t.tone("accent");
    const fg = this.#selected ? accent.fg : c.secondary, onClick = this.#onClick, onRemove = this.#onRemove;
    const body = BaseButton.new(this.#id)
      .h(24).px(8).rounded(t.radius.chip).text_size(t.type.small).text_color(fg)
      .when(this.#mono, (el) => el.font_family(t.fonts.mono))
      .accessibility_label(label)
      .when(!this.#selected, (el) => el.hover((style) => style.text_color(c.foreground)))
      .when(Boolean(onClick), (el) => el.on_click((event, cx) => onClick(event, cx)))
      .child(h_flex().size_full().items_center().child(label));
    return h_flex().flex_shrink_0().items_center().rounded(t.radius.chip).border(1)
      .border_color(this.#selected ? accent.border : c.border).bg(this.#selected ? accent.bg : c.well)
      .child(body)
      .when(Boolean(onRemove), (el) => el.child(BaseButton.new(`${this.#id}-remove`)
        .size(16).mr(4).rounded(4).text_color(fg).accessibility_label(`Remove ${label}`)
        .hover((style) => style.bg(c.hover))
        .on_click((event, cx) => onRemove(event, cx))
        .child(h_flex().size_full().items_center().justify_center().text_size(t.type.small).child("×"))));
  }
}

/** A key or chord, such as `Ctrl K`, set as a quiet monospace cap. */
export class Kbd {
  #keys;
  /** @param {string} keys */
  constructor(keys) { this.#keys = requiredText("Kbd", "keys", keys); }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    return div().flex_shrink_0().px(5).py(1).rounded(4).bg(c.raised).border(1).border_color(c.borderStrong)
      .text_size(t.type.caption).text_color(c.secondary).font_family(t.fonts.mono).child(this.#keys);
  }
}

/** A search or command field: icon, the application's input state, a key hint. */
export class SearchField {
  #id;
  #state;
  #icon;
  #hint;
  /** @type {"card" | "well"} */
  #surface = "card";

  /** @param {string} id @param {import("gpui-base").InputState} state */
  constructor(id, state) {
    this.#id = stableId("SearchField", id);
    if (!state) throw new Error("SearchField needs the application's InputState");
    this.#state = state;
  }
  /** @param {string} asset */
  icon(asset) { this.#icon = asset; return this; }
  /** @param {string} keys such as `Ctrl K` */
  hint(keys) { this.#hint = keys; return this; }
  /** Sit recessed, for a field inside a card. */
  recessed() { this.#surface = "well"; return this; }

  /** @param {import("gpui-kit").Context} cx */
  build(cx) {
    const t = theme(), c = t.colors, hint = optionalText("SearchField", "hint", this.#hint);
    return h_flex().id(this.#id).h(30).px(10).gap(8).items_center().rounded(t.radius.control)
      .bg(this.#surface === "well" ? c.well : c.card).border(1).border_color(c.border)
      .when(Boolean(this.#icon), (el) => el.child(div().text_color(c.secondary).child(svg(this.#icon).size(13))))
      .child(Input.new(this.#state).flex_1().min_w_0().text_size(t.type.body))
      .when(Boolean(hint), (el) => el.child(new Kbd(hint).build(cx)));
  }
}

/** A labelled switch row: title, optional description, and the switch. */
export class ToggleRow {
  #id;
  #title;
  #description;
  #checked = false;
  #disabled = false;
  /** @type {((checked: boolean, cx: import("gpui-kit").Context) => void) | undefined} */
  #onChange;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("ToggleRow", id); }
  /** @param {string} text */
  title(text) { this.#title = text; return this; }
  /** @param {string} text */
  description(text) { this.#description = text; return this; }
  /** @param {boolean} value */
  checked(value) { this.#checked = Boolean(value); return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {(checked: boolean, cx: import("gpui-kit").Context) => void} callback */
  onChange(callback) { this.#onChange = optionalCallback("ToggleRow", "onChange", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const title = requiredText("ToggleRow", "title", this.#title);
    const description = optionalText("ToggleRow", "description", this.#description);
    const t = theme(), c = t.colors, on = this.#checked, onChange = this.#onChange;
    return BaseButton.new(this.#id).w_full().rounded(t.radius.well).bg(c.well).border(1).border_color(c.border)
      .accessibility_label(title).role("switch")
      .disabled(this.#disabled).when(this.#disabled, (el) => el.opacity(0.45))
      .when(Boolean(onChange), (el) => el.on_click((_event, cx) => onChange(!on, cx)))
      .child(h_flex().w_full().px(12).py(9).gap(12).items_center()
        .child(v_flex().flex_1().min_w_0().gap(2).items_start()
          .child(div().text_size(t.type.body).text_color(c.bright).child(title))
          .when(Boolean(description), (el) => el.child(div().text_size(t.type.small).text_color(c.secondary).child(description))))
        .child(h_flex().w(32).h(18).p(3).flex_shrink_0().rounded(t.radius.pill)
          .bg(on ? c.accent : c.raised).when(on, (el) => el.justify_end())
          .child(div().size(12).rounded(t.radius.pill).bg(on ? c.onLight : c.secondary))));
  }
}

/**
 * Rows of commands or choices, for a menu or a select's list. `null` in the
 * items is a separator. A checked row carries an accent ✓.
 */
export class MenuList {
  #id;
  /** @type {({ id: string, label: string, icon?: string, meta?: string, checked?: boolean, danger?: boolean, disabled?: boolean, onSelect?: (cx: import("gpui-kit").Context) => void } | null)[]} */
  #items = [];
  #width = 200;
  #highlight;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("MenuList", id); }
  /** @param {({ id: string, label: string, icon?: string, meta?: string, checked?: boolean, danger?: boolean, disabled?: boolean, onSelect?: (cx: import("gpui-kit").Context) => void } | null)[]} values */
  items(values) { this.#items = values; return this; }
  /** @param {number} pixels */
  width(pixels) { this.#width = pixels; return this; }
  /** The keyboard cursor's row, drawn with the hover fill. @param {string | undefined} id */
  highlight(id) { this.#highlight = id; return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    return v_flex().w(this.#width).p(4).gap(1).rounded(t.radius.well).bg(c.well).border(1).border_color(c.borderStrong)
      .children(this.#items.map((item, index) => {
        if (!item) return div().mx(4).my(3).h(1).bg(c.border);
        const id = stableId("MenuList item", item.id), label = requiredText("MenuList", "item label", item.label);
        const lit = id === this.#highlight, onSelect = item.onSelect;
        return BaseButton.new(`${this.#id}-${id}`).w_full().h(28).rounded(t.radius.chip)
          .bg(lit ? c.raised : c.clear).accessibility_label(label)
          .disabled(Boolean(item.disabled)).when(Boolean(item.disabled), (el) => el.opacity(0.45))
          .when(!item.disabled, (el) => el.hover((style) => style.bg(c.raised)))
          .when(Boolean(onSelect), (el) => el.on_click((_event, cx) => onSelect(cx)))
          .child(h_flex().size_full().px(8).gap(8).items_center()
            .text_size(t.type.body).text_color(item.danger ? t.tone("danger").fg : c.foreground)
            .when(Boolean(item.icon), (el) => el.child(div().text_color(item.danger ? t.tone("danger").fg : c.secondary).child(svg(item.icon).size(13))))
            .child(div().flex_1().min_w_0().truncate().child(label))
            .when(Boolean(item.meta), (el) => el.child(div().flex_shrink_0().text_size(t.type.caption).text_color(c.tertiary).font_family(t.fonts.mono).child(item.meta)))
            .when(Boolean(item.checked), (el) => el.child(div().flex_shrink_0().text_color(c.accent).child("✓"))));
      }));
  }
}

/** The closed face of a select: an optional label, the value and a chevron. */
export class SelectTrigger {
  #id;
  #label;
  #value;
  #mono = false;
  #full = false;
  #open = false;
  #disabled = false;
  /** @type {ClickHandler | undefined} */
  #onClick;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("SelectTrigger", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {string} text */
  value(text) { this.#value = text; return this; }
  mono() { this.#mono = true; return this; }
  fullWidth() { this.#full = true; return this; }
  /** Keep the open state visible while the list is showing. @param {boolean} [value] */
  open(value = true) { this.#open = value; return this; }
  /** @param {boolean} [value] */
  disabled(value = true) { this.#disabled = value; return this; }
  /** @param {ClickHandler | undefined} callback */
  onClick(callback) { this.#onClick = optionalCallback("SelectTrigger", "onClick", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const value = requiredText("SelectTrigger", "value", this.#value);
    const label = optionalText("SelectTrigger", "label", this.#label);
    const t = theme(), c = t.colors, onClick = this.#onClick;
    return BaseButton.new(this.#id).h(30).px(10).flex_shrink_0().rounded(t.radius.control)
      .bg(this.#open ? c.raised : c.well).border(1).border_color(this.#open ? c.dashed : c.borderStrong)
      .accessibility_label(label ? `${label}: ${value}` : value)
      .when(this.#full, (el) => el.w_full())
      .disabled(this.#disabled).when(this.#disabled, (el) => el.opacity(0.45))
      .when(!this.#disabled, (el) => el.hover((style) => style.bg(c.raised)))
      .when(Boolean(onClick), (el) => el.on_click((event, cx) => onClick(event, cx)))
      .child(h_flex().size_full().gap(8).items_center()
        .when(Boolean(label), (el) => el.child(div().flex_1().text_size(t.type.body).text_color(c.secondary).child(label)))
        .child(div().text_size(t.type.body).text_color(c.bright).when(this.#mono, (el) => el.font_family(t.fonts.mono)).child(value))
        .child(div().text_size(t.type.small).text_color(c.secondary).child(this.#open ? "⌃" : "⌄")));
  }
}
