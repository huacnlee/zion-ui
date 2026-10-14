// @ts-check

import { div, svg } from "gpui-kit";
import { Button as BaseButton, h_flex, v_flex } from "gpui-base";
import { optionalCallback, optionalRenderable, optionalText, requiredRenderable, requiredRenderables, requiredText, stableId } from "./internal.js";
import { theme } from "./theme.js";

/** The sidebar drag in progress, per frame id: where it started. */
const drags = new Map();
const SLIDE = /** @type {const} */ ({ duration: 200, easing: "ease-out" });

/**
 * The window: navigation on the canvas, and the work in a deeper rounded panel
 * inset from the window's edges. The sidebar can collapse, sliding shut, and
 * can be dragged wider or narrower; its width belongs to the application,
 * which receives every change and passes the current width back in.
 */
export class AppFrame {
  #id;
  #sidebar;
  #main;
  #sidebarWidth = 232;
  #collapsed = false;
  /** @type {{ min: number, max: number, onResize: (width: number, cx: import("gpui-kit").Context) => void } | undefined} */
  #resize;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("AppFrame", id); }
  /** @param {any} element the navigation, usually a built `Sidebar` */
  sidebar(element) { this.#sidebar = element; return this; }
  /** @param {any} element the work area's content */
  main(element) { this.#main = element; return this; }
  /** @param {number} pixels */
  sidebarWidth(pixels) { this.#sidebarWidth = pixels; return this; }
  /** Slide the sidebar shut; it keeps its width for when it opens. @param {boolean} [value] */
  collapsed(value = true) { this.#collapsed = value; return this; }
  /**
   * Let the sidebar's edge be dragged. `onResize` receives each new width,
   * already clamped to `min`…`max`; store it and pass it back to `sidebarWidth`.
   * @param {{ min?: number, max?: number, onResize: (width: number, cx: import("gpui-kit").Context) => void }} options
   */
  resizable(options) {
    const onResize = optionalCallback("AppFrame", "onResize", options?.onResize);
    if (!onResize) throw new Error("AppFrame resizable needs an onResize callback");
    this.#resize = { min: options.min ?? 180, max: options.max ?? 420, onResize };
    return this;
  }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors, id = this.#id, resize = this.#resize;
    const sidebar = optionalRenderable("AppFrame", "sidebar", this.#sidebar);
    const main = requiredRenderable("AppFrame", "main", this.#main);
    const width = resize ? Math.min(resize.max, Math.max(resize.min, this.#sidebarWidth)) : this.#sidebarWidth;
    const open = Boolean(sidebar) && !this.#collapsed, dragging = drags.has(id);
    return h_flex().id(id).size_full().min_w_0().items_stretch().bg(c.canvas).text_color(c.foreground)
      .when(Boolean(t.fonts.sans), (el) => el.font_family(t.fonts.sans))
      .when(Boolean(resize), (el) => el
        .on_mouse_move((event, cx) => {
          const drag = drags.get(id);
          if (!drag) return;
          const next = Math.round(Math.min(resize.max, Math.max(resize.min, drag.width + event.position.x - drag.x)));
          if (next !== drag.last) { drag.last = next; resize.onResize(next, cx); }
        })
        .on_mouse_up("left", (_event, cx) => { if (drags.delete(id)) cx.notify(); }))
      // The column keeps the sidebar at full width inside a clipping box that
      // animates, so the navigation slides rather than reflowing as it goes.
      .when(Boolean(sidebar), (el) => el.child(div().flex_shrink_0().h_full().overflow_hidden().w(open ? width : 0)
        .when(!dragging, (el) => el.transition("width", SLIDE))
        .child(v_flex().w(width).h_full().min_h_0().child(sidebar))))
      .when(open && Boolean(resize), (el) => el.child(div().id(`${id}-resize`).w(6).h_full().flex_shrink_0().cursor_col_resize()
        .on_mouse_down("left", (event, cx) => { drags.set(id, { x: event.position.x, width, last: width }); cx.notify(); })
        .child(div().mx(2).w(2).h_full().rounded(1).bg(dragging ? c.borderStrong : c.clear).hover((style) => style.bg(c.border)))))
      .child(div().flex_1().min_w_0().min_h_0().p(6).when(open, (el) => el.pl(0))
        .child(v_flex().size_full().min_h_0().rounded(t.radius.main).bg(c.main).border(1).border_color(c.border).overflow_hidden().child(main)));
  }
}

/**
 * The navigation column: a brand row, an optional search field, then sections
 * of `NavItem`s, with a footer pinned to the bottom.
 */
export class Sidebar {
  #id;
  #brand;
  #brandMark;
  #brandAction;
  #search;
  /** @type {any[]} */
  #children = [];
  #footer;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Sidebar", id); }
  /** @param {string} name the application's name */
  brand(name) { this.#brand = name; return this; }
  /** @param {string} asset an SVG drawn dark on the light brand tile */
  brandMark(asset) { this.#brandMark = asset; return this; }
  /** A control at the end of the brand row, such as the sidebar toggle. @param {any} element */
  brandAction(element) { this.#brandAction = element; return this; }
  /** @param {any} element a built `SearchField` */
  search(element) { this.#search = element; return this; }
  /** @param {any[]} elements built `NavItem`s, `NavSection`s or anything else */
  children(elements) { this.#children = elements; return this; }
  /** @param {any} element */
  footer(element) { this.#footer = element; return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    const brand = optionalText("Sidebar", "brand", this.#brand);
    const children = requiredRenderables("Sidebar", "children", this.#children);
    const footer = optionalRenderable("Sidebar", "footer", this.#footer);
    const search = optionalRenderable("Sidebar", "search", this.#search);
    const brandAction = optionalRenderable("Sidebar", "brandAction", this.#brandAction);
    return v_flex().id(this.#id).size_full().min_h_0().px(10).pt(12).pb(10).gap(10)
      .when(Boolean(brand), (el) => el.child(h_flex().h(30).px(4).gap(8).items_center()
        .child(h_flex().size(22).flex_shrink_0().rounded(6).bg(c.light).text_color(c.onLight).items_center().justify_center()
          .when(Boolean(this.#brandMark), (el) => el.child(svg(this.#brandMark).size(13))))
        .child(div().flex_1().min_w_0().truncate().text_size(t.type.label).font_medium().text_color(c.bright).child(brand))
        .when(Boolean(brandAction), (el) => el.child(brandAction))))
      .when(Boolean(search), (el) => el.child(search))
      .child(v_flex().id(`${this.#id}-items`).flex_1().min_h_0().overflow_y_scrollbar().gap(1).children(children))
      .when(Boolean(footer), (el) => el.child(footer));
  }
}

/** A heading over a group of navigation items, with an optional action. */
export class NavSection {
  #title;
  #action;
  /** @param {string} title */
  constructor(title) { this.#title = requiredText("NavSection", "title", title); }
  /** @param {any} element usually a small `IconButton` */
  action(element) { this.#action = element; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), action = optionalRenderable("NavSection", "action", this.#action);
    return h_flex().h(26).mt(8).px(8).items_center()
      .child(div().flex_1().text_size(t.type.caption).text_color(t.colors.tertiary).child(this.#title))
      .when(Boolean(action), (el) => el.child(action));
  }
}

/** One destination: icon, label, optional count, and a persistent selected fill. */
export class NavItem {
  #id;
  #label;
  #icon;
  #count;
  #indicator;
  #selected = false;
  #muted = false;
  /** @type {((event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void) | undefined} */
  #onClick;
  /** @type {((event: any, cx: import("gpui-kit").Context) => void) | undefined} */
  #onSecondary;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("NavItem", id); }
  /** @param {string} text */
  label(text) { this.#label = text; return this; }
  /** @param {string} asset */
  icon(asset) { this.#icon = asset; return this; }
  /** @param {string | number} value a count or short status, set in monospace */
  count(value) { this.#count = String(value); return this; }
  /** A small accent dot: activity in progress. @param {boolean} [value] */
  indicator(value = true) { this.#indicator = value; return this; }
  /** @param {boolean} [value] */
  selected(value = true) { this.#selected = value; return this; }
  /** Secondary text, for items listed under a section. @param {boolean} [value] */
  muted(value = true) { this.#muted = value; return this; }
  /** @param {(event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void} callback */
  onClick(callback) { this.#onClick = optionalCallback("NavItem", "onClick", callback); return this; }
  /** A right-button press, for a context menu. @param {(event: any, cx: import("gpui-kit").Context) => void} callback */
  onSecondaryPress(callback) { this.#onSecondary = optionalCallback("NavItem", "onSecondaryPress", callback); return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const label = requiredText("NavItem", "label", this.#label);
    const t = theme(), c = t.colors, on = this.#selected, onClick = this.#onClick, onSecondary = this.#onSecondary;
    const ink = on ? c.bright : this.#muted ? c.secondary : c.foreground;
    // Pointer listeners other than click belong on an element the shell owns,
    // so the row wraps its Button.
    return div().w_full().flex_shrink_0()
      .when(Boolean(onSecondary), (el) => el.on_mouse_down("right", (event, cx) => onSecondary(event, cx)))
      .child(BaseButton.new(this.#id).w_full().h(30).rounded(t.radius.control).bg(on ? c.raised : c.clear)
        .accessibility_label(label)
        .when(!on, (el) => el.hover((style) => style.bg(c.hover)))
        .when(Boolean(onClick), (el) => el.on_click((event, cx) => onClick(event, cx)))
        .child(h_flex().size_full().px(8).gap(8).items_center().text_size(t.type.body).text_color(ink)
          .when(Boolean(this.#icon), (el) => el.child(div().text_color(on ? c.bright : c.secondary).child(svg(this.#icon).size(14))))
          .child(div().flex_1().min_w_0().truncate().child(label))
          .when(Boolean(this.#indicator), (el) => el.child(div().size(5).flex_shrink_0().rounded(t.radius.pill).bg(c.accent)))
          .when(Boolean(this.#count), (el) => el.child(div().flex_shrink_0().px(5).rounded(4).bg(c.raised)
            .text_size(t.type.caption).text_color(c.secondary).font_family(t.fonts.mono).child(this.#count)))));
  }
}

/**
 * The top of a page in the main panel: a breadcrumb, a large title with an
 * optional status badge, and trailing actions.
 */
export class PageHeader {
  #title;
  /** @type {string[]} */
  #breadcrumb = [];
  #badge;
  /** @type {any[]} */
  #actions = [];
  #meta;
  #leading;
  #compact = false;

  /** @param {string} title */
  constructor(title) { this.#title = requiredText("PageHeader", "title", title); }
  /** A control before the title, such as the sidebar toggle. @param {any} element */
  leading(element) { this.#leading = element; return this; }
  /** A smaller title, for pages whose title is content, such as a document or chat name. */
  compact() { this.#compact = true; return this; }
  /** @param {string[]} parts */
  breadcrumb(parts) { this.#breadcrumb = parts.map((part) => requiredText("PageHeader", "breadcrumb part", part)); return this; }
  /** @param {any} element usually a built `Badge` */
  badge(element) { this.#badge = element; return this; }
  /** Quiet text beside the title, such as a count. @param {string} text */
  meta(text) { this.#meta = text; return this; }
  /** @param {any[]} elements */
  actions(elements) { this.#actions = elements; return this; }

  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const t = theme(), c = t.colors;
    const badge = optionalRenderable("PageHeader", "badge", this.#badge);
    const actions = requiredRenderables("PageHeader", "actions", this.#actions);
    const meta = optionalText("PageHeader", "meta", this.#meta);
    const leading = optionalRenderable("PageHeader", "leading", this.#leading);
    const size = this.#compact ? t.type.heading : t.type.display;
    return h_flex().w_full().flex_shrink_0().px(this.#compact ? 16 : 24).pt(this.#compact ? 12 : 18).pb(this.#compact ? 10 : 14).gap(12).items_end()
      .child(v_flex().flex_1().min_w_0().gap(4)
        .when(this.#breadcrumb.length > 0, (el) => el.child(h_flex().gap(6).items_center().text_size(t.type.small).text_color(c.secondary)
          .children(this.#breadcrumb.flatMap((part, index) => index ? [div().text_color(c.tertiary).child("/"), div().child(part)] : [div().child(part)]))))
        .child(h_flex().min_w_0().gap(10).items_center()
          // A leading control lines up with the title, not with the breadcrumb.
          .when(Boolean(leading), (el) => el.child(div().flex_shrink_0().child(leading)))
          // The title keeps a readable minimum; the meta text gives way first.
          .child(div().min_w(96).flex_shrink(1).truncate().text_size(size).font_medium().text_color(c.bright).child(this.#title))
          .when(Boolean(badge), (el) => el.child(badge))
          .when(Boolean(meta), (el) => el.child(div().min_w_0().flex_shrink(6).truncate().text_size(t.type.body).text_color(c.secondary).child(meta)))))
      .when(actions.length > 0, (el) => el.child(h_flex().flex_shrink_0().gap(8).items_center().children(actions)));
  }
}

/** A square badge with a dashed edge around an icon: a card's emblem. */
export class IconBadge {
  #icon;
  #size = 28;
  /** @param {string} asset */
  constructor(asset) { this.#icon = requiredText("IconBadge", "icon", asset); }
  /** @param {number} pixels */
  size(pixels) { this.#size = pixels; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const c = theme().colors;
    return h_flex().size(this.#size).flex_shrink_0().rounded(Math.round(this.#size / 4.5)).border(1).border_dashed().border_color(c.dashed)
      .items_center().justify_center().text_color(c.bright).child(svg(this.#icon).size(Math.round(this.#size * 0.5)));
  }
}

/**
 * The card: a darker shell carrying an emblem, a title and subtitle and a
 * trailing slot, around an inset body panel a step lighter, with an optional
 * footer under it. Radii nest so the body's corners sit concentric inside the
 * shell's.
 */
export class Card {
  #id;
  #title;
  #subtitle;
  #icon;
  #trailing;
  #body;
  #footer;
  #padded = true;
  #fill = false;

  /** @param {string} id */
  constructor(id) { this.#id = stableId("Card", id); }
  /** @param {string} text */
  title(text) { this.#title = text; return this; }
  /** @param {string} text */
  subtitle(text) { this.#subtitle = text; return this; }
  /** @param {string} asset shown in a dashed `IconBadge` */
  icon(asset) { this.#icon = asset; return this; }
  /** @param {any} element a `Chip`, a `Segmented`, a `Badge`… */
  trailing(element) { this.#trailing = element; return this; }
  /** @param {any} element */
  body(element) { this.#body = element; return this; }
  /** @param {any} element */
  footer(element) { this.#footer = element; return this; }
  /** Let the body run to the panel's edges. */
  flush() { this.#padded = false; return this; }
  /** Grow to fill the parent's height. */
  fill() { this.#fill = true; return this; }

  /** @param {import("gpui-kit").Context} cx */
  build(cx) {
    const t = theme(), c = t.colors;
    const title = optionalText("Card", "title", this.#title);
    const subtitle = optionalText("Card", "subtitle", this.#subtitle);
    const trailing = optionalRenderable("Card", "trailing", this.#trailing);
    const body = requiredRenderable("Card", "body", this.#body);
    const footer = optionalRenderable("Card", "footer", this.#footer);
    const header = title || this.#icon || trailing;
    return v_flex().id(this.#id).min_w_0().rounded(t.radius.card + 3).bg(c.well).border(1).border_color(c.border).p(3)
      .when(this.#fill, (el) => el.flex_1().min_h_0())
      .when(Boolean(header), (el) => el.child(h_flex().px(13).pt(10).pb(11).gap(10).items_center()
        .when(Boolean(this.#icon), (el) => el.child(new IconBadge(this.#icon).size(28).build(cx)))
        .child(v_flex().flex_1().min_w_0().gap(1)
          .when(Boolean(title), (el) => el.child(div().truncate().text_size(t.type.title).text_color(c.bright).child(title)))
          .when(Boolean(subtitle), (el) => el.child(div().truncate().text_size(t.type.small).text_color(c.secondary).child(subtitle))))
        .when(Boolean(trailing), (el) => el.child(trailing))))
      .child(v_flex().min_w_0().rounded(t.radius.card).bg(c.card).border(1).border_color(c.border)
        .when(this.#fill, (el) => el.flex_1().min_h_0())
        .when(this.#padded, (el) => el.p(16)).child(body))
      .when(Boolean(footer), (el) => el.child(h_flex().px(13).pt(9).pb(7).gap(8).items_center().child(footer)));
  }
}

/** A hairline, solid or dashed, horizontal or vertical. */
export class Divider {
  #dashed = false;
  #vertical = false;
  dashed() { this.#dashed = true; return this; }
  vertical() { this.#vertical = true; return this; }
  /** @param {import("gpui-kit").Context} _cx */
  build(_cx) {
    const c = theme().colors;
    if (this.#dashed) {
      return div().when(this.#vertical, (el) => el.h_full().w(0).border_l(1)).when(!this.#vertical, (el) => el.w_full().h(0).border_t(1))
        .border_dashed().border_color(c.borderStrong);
    }
    return div().bg(c.border).when(this.#vertical, (el) => el.w(1).h_full()).when(!this.#vertical, (el) => el.h(1).w_full());
  }
}
