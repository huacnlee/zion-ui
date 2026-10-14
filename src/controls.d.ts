export type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
export type Size = "sm" | "md" | "lg";
export type ClickHandler = (event: import("gpui-kit").ClickEvent, cx: import("gpui-kit").Context) => void;
/**
 * Every variant's chrome. The border is always 1px and always present, clear
 * where a variant has none, so hover and selection only recolor and nothing
 * beside the control moves.
 * @param {Variant} variant
 */
export declare function variantChrome(variant: Variant): {
    bg: import("gpui-kit").Color;
    hover: import("gpui-kit").Color;
    pressed: import("gpui-kit").Color;
    border: import("gpui-kit").Color;
    ink: import("gpui-kit").Color;
};
export declare class Button {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} asset application-root-relative SVG path */
    icon(asset: string): this;
    /** @param {string} asset application-root-relative SVG path */
    trailingIcon(asset: string): this;
    /** @param {Variant} value */
    variant(value: Variant): this;
    /** @param {Size} value */
    size(value: Size): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** Stretch to the parent's width. */
    fullWidth(): this;
    /** Footer commands in the reference grammar: small, uppercase, spaced. */
    uppercase(): this;
    /** @param {string} text */
    tooltip(text: string): this;
    /** @param {ClickHandler | undefined} callback */
    onClick(callback: ClickHandler | undefined): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A square button with an icon and an accessible description. */
export declare class IconButton {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} asset */
    icon(asset: string): this;
    /** The accessible name and tooltip. @param {string} text */
    description(text: string): this;
    /** @param {Variant} value */
    variant(value: Variant): this;
    /** @param {Size} value */
    size(value: Size): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** A pressed toggle: the selected fill, kept across hover. @param {boolean} [value] */
    selected(value?: boolean): this;
    /** @param {ClickHandler | undefined} callback */
    onClick(callback: ClickHandler | undefined): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * One choice out of a few: a recessed track with the chosen option raised.
 * Options keep their width when chosen, so the track never reflows.
 */
export declare class Segmented {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {{ id: string, label: string }[]} values */
    options(values: {
        id: string;
        label: string;
    }[]): this;
    /** @param {string} id */
    selected(id: string): this;
    /** Share the width equally instead of sizing to the labels. */
    fill(): this;
    /** Set the labels in the monospace family, for values such as `1×` or `v2`. */
    mono(): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {(id: string, cx: import("gpui-kit").Context) => void} callback */
    onSelect(callback: (id: string, cx: import("gpui-kit").Context) => void): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * A compact, monospace token: a filter, a suggestion, a tag. Selected chips
 * take the accent tone; a removable chip carries its own × button.
 */
export declare class Chip {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {boolean} [value] */
    selected(value?: boolean): this;
    /** Set the label in the sans-serif family instead. */
    sans(): this;
    /** @param {ClickHandler | undefined} callback */
    onClick(callback: ClickHandler | undefined): this;
    /** @param {ClickHandler | undefined} callback */
    onRemove(callback: ClickHandler | undefined): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A key or chord, such as `Ctrl K`, set as a quiet monospace cap. */
export declare class Kbd {
    #private;
    /** @param {string} keys */
    constructor(keys: string);
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A count or fact beside a title, such as `12 circuits`: a dark monospace tag. */
export declare class Tag {
    #private;
    /** @param {string} text */
    constructor(text: string);
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A search or command field: icon, the application's input state, a key hint. */
export declare class SearchField {
    #private;
    /** @param {string} id @param {import("gpui-base").InputState} state */
    constructor(id: string, state: import("gpui-base").InputState);
    /** @param {string} asset */
    icon(asset: string): this;
    /** @param {string} keys such as `Ctrl K` */
    hint(keys: string): this;
    /** Sit recessed, for a field inside a card. */
    recessed(): this;
    /** @param {import("gpui-kit").Context} cx */
    build(cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A labelled switch row: title, optional description, and the switch. */
export declare class ToggleRow {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    title(text: string): this;
    /** @param {string} text */
    description(text: string): this;
    /** @param {boolean} value */
    checked(value: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {(checked: boolean, cx: import("gpui-kit").Context) => void} callback */
    onChange(callback: (checked: boolean, cx: import("gpui-kit").Context) => void): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * Rows of commands or choices, for a menu or a select's list. `null` in the
 * items is a separator. A checked row carries an accent ✓.
 */
export declare class MenuList {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {({ id: string, label: string, icon?: string, meta?: string, checked?: boolean, danger?: boolean, disabled?: boolean, onSelect?: (cx: import("gpui-kit").Context) => void } | null)[]} values */
    items(values: ({
        id: string;
        label: string;
        icon?: string;
        meta?: string;
        checked?: boolean;
        danger?: boolean;
        disabled?: boolean;
        onSelect?: (cx: import("gpui-kit").Context) => void;
    } | null)[]): this;
    /** @param {number} pixels */
    width(pixels: number): this;
    /** The keyboard cursor's row, drawn with the hover fill. @param {string | undefined} id */
    highlight(id: string | undefined): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** The closed face of a select: an optional label, the value and a chevron. */
export declare class SelectTrigger {
    #private;
    /** @param {string} id */
    constructor(id: string);
    /** @param {string} text */
    label(text: string): this;
    /** @param {string} text */
    value(text: string): this;
    mono(): this;
    fullWidth(): this;
    /** Keep the open state visible while the list is showing. @param {boolean} [value] */
    open(value?: boolean): this;
    /** @param {boolean} [value] */
    disabled(value?: boolean): this;
    /** @param {ClickHandler | undefined} callback */
    onClick(callback: ClickHandler | undefined): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
