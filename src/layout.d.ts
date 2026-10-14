/**
 * The window: navigation on the canvas, and the work in a deeper rounded panel
 * inset from the window's edges. The sidebar can collapse, sliding shut, and
 * can be dragged wider or narrower; its width belongs to the application,
 * which receives every change and passes the current width back in.
 */
export declare class AppFrame {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {any} element the navigation, usually a built `Sidebar` */
    sidebar(element: any): this;
    /** @param {any} element the work area's content */
    main(element: any): this;
    /** @param {number} pixels */
    sidebarWidth(pixels: number): this;
    /** Slide the sidebar shut; it keeps its width for when it opens. @param {boolean} [value] */
    collapsed(value?: boolean): this;
    /**
     * Let the sidebar's edge be dragged. `onResize` receives each new width,
     * already clamped to `min`…`max`; store it and pass it back to `sidebarWidth`.
     * @param {{ min?: number, max?: number, onResize: (width: number, cx: import("gpui-kit").Context) => void }} options
     */
    resizable(options: {
        min?: number;
        max?: number;
        onResize: (width: number, cx: import("gpui-kit").Context) => void;
    }): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * The navigation column: a brand row, an optional search field, then sections
 * of `NavItem`s, with a footer pinned to the bottom.
 */
export declare class Sidebar {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} name the application's name */
    brand(name: string): this;
    /** @param {string} asset an SVG drawn dark on the light brand tile */
    brandMark(asset: string): this;
    /** @param {any} element a built `SearchField` */
    search(element: any): this;
    /** @param {any[]} elements built `NavItem`s, `NavSection`s or anything else */
    children(elements: any[]): this;
    /** @param {any} element */
    footer(element: any): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A heading over a group of navigation items, with an optional action. */
export declare class NavSection {
    #private;
    /** @param {string} title */
    constructor(title: string);
    /** @param {any} element usually a small `IconButton` */
    action(element: any): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** One destination: icon, label, optional count, and a persistent selected fill. */
export declare class NavItem {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} asset */
    icon(asset: string): this;
    /** @param {string | number} value a count or short status, set in monospace */
    count(value: string | number): this;
    /** A small accent dot: activity in progress. @param {boolean} [value] */
    indicator(value?: boolean): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** Secondary text, for items listed under a section. @param {boolean} [value] */
    muted(value?: boolean): this;
    /** @param {(event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void} callback */
    onClick(callback: (event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void): this;
    /** A right-button press, for a context menu. @param {(event: any, cx: import("gpui-kit").Context) => void} callback */
    onSecondaryPress(callback: (event: any, cx: import("gpui-kit").Context) => void): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * The top of a page in the main panel: a breadcrumb, a large title with an
 * optional status badge, and trailing actions.
 */
export declare class PageHeader {
    #private;
    /** @param {string} title */
    constructor(title: string);
    /** A control before the title, such as the sidebar toggle. @param {any} element */
    leading(element: any): this;
    /** A smaller title, for pages whose title is content, such as a document or chat name. */
    compact(): this;
    /** @param {string[]} parts */
    breadcrumb(parts: string[]): this;
    /** @param {any} element usually a built `Badge` */
    badge(element: any): this;
    /** Quiet text beside the title, such as a count. @param {string} text */
    meta(text: string): this;
    /** @param {any[]} elements */
    actions(elements: any[]): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A square badge with a dashed edge around an icon: a card's emblem. */
export declare class IconBadge {
    #private;
    /** @param {string} asset */
    constructor(asset: string);
    /** @param {number} pixels */
    size(pixels: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * The card: a darker shell carrying an emblem, a title and subtitle and a
 * trailing slot, around an inset body panel a step lighter, with an optional
 * footer under it. Radii nest so the body's corners sit concentric inside the
 * shell's.
 */
export declare class Card {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    title(text: string): this;
    /** @param {string} text */
    subtitle(text: string): this;
    /** @param {string} asset shown in a dashed `IconBadge` */
    icon(asset: string): this;
    /** @param {any} element a `Chip`, a `Segmented`, a `Badge`… */
    trailing(element: any): this;
    /** @param {any} element */
    body(element: any): this;
    /** @param {any} element */
    footer(element: any): this;
    /** Let the body run to the panel's edges. */
    flush(): this;
    /** Grow to fill the parent's height. */
    fill(): this;
    /** @param {import("gpui-kit").Context} cx */
    build(cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A hairline, solid or dashed, horizontal or vertical. */
export declare class Divider {
    #private;
    dashed(): this;
    vertical(): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
