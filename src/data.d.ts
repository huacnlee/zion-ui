export type Tone = import("./theme.js").Tone;
/**
 * A headline number in monospace with a short note in a tone beside it:
 * `4.82 kW  peak 6.1 kW`.
 */
export declare class Stat {
    #private;
    /** @param {string} value */
    constructor(value: string);
    /** @param {string} text */
    note(text: string): this;
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {number} pixels */
    size(pixels: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A short status in a tinted pill: `Online`, `Paused`, `HIGH`. */
export declare class Badge {
    #private;
    /** @param {string} label */
    constructor(label: string);
    /** @param {Tone} value */
    tone(value: Tone): this;
    mono(): this;
    /** Lead with a dot of the tone's color. */
    dot(): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A one-line notice across a card: tinted, centered, with an optional icon. */
export declare class Callout {
    #private;
    /** @param {string} text */
    constructor(text: string);
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {string} asset */
    icon(asset: string): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A thin track with a filled share: progress, a score, a share of a budget. */
export declare class Meter {
    #private;
    /** @param {number} value 0…1 */
    constructor(value: number);
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {number} pixels */
    height(pixels: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A row of vertical ticks, the filled ones in a tone: a score out of N. */
export declare class TickBar {
    #private;
    /** @param {number} value 0…1 */
    constructor(value: number);
    /** @param {number} count */
    ticks(count: number): this;
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {number} pixels */
    height(pixels: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** Shares of a whole as adjoining colored segments, with gaps between. */
export declare class SegmentBar {
    #private;
    /** @param {{ value: number, tone?: Tone, color?: import("gpui-kit").Color }[]} parts */
    constructor(parts: {
        value: number;
        tone?: Tone;
        color?: import("gpui-kit").Color;
    }[]);
    /** @param {number} pixels */
    height(pixels: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * Legend rows: a square swatch, a monospace label, and a value right-aligned,
 * so values line up down the card.
 */
export declare class Legend {
    #private;
    /** @param {{ label: string, value?: string, tone?: Tone, color?: import("gpui-kit").Color }[]} items */
    constructor(items: {
        label: string;
        value?: string;
        tone?: Tone;
        color?: import("gpui-kit").Color;
    }[]);
    /** Lay the items out in one wrapping line instead of rows. */
    inline(): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** Label and value rows with hairlines between: a device's attributes. */
export declare class PropertyList {
    #private;
    /** @param {{ label: string, value: string, tone?: Tone, trailing?: any }[]} rows */
    constructor(rows: {
        label: string;
        value: string;
        tone?: Tone;
        trailing?: any;
    }[]);
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** Columns of small label over monospace value: uptime, temperature, cost… */
export declare class StatStrip {
    #private;
    /** @param {{ label: string, value: string, tone?: Tone }[]} items */
    constructor(items: {
        label: string;
        value: string;
        tone?: Tone;
    }[]);
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * Steps toward a goal: done steps are filled accent circles with a check,
 * the rest dashed circles with their number, joined by a line that is solid
 * between finished steps.
 */
export declare class Steps {
    #private;
    /** @param {{ title: string, detail?: string, done?: boolean }[]} steps */
    constructor(steps: {
        title: string;
        detail?: string;
        done?: boolean;
    }[]);
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A metric tile: label and status badge, a big value, its meaning, a meter. */
export declare class MetricTile {
    #private;
    /** @param {string} label */
    constructor(label: string);
    /** @param {string} text */
    value(text: string): this;
    /** @param {string} text */
    caption(text: string): this;
    /** @param {any} element a built `Badge` */
    badge(element: any): this;
    /** @param {number} fill 0…1 */
    meter(fill: number): this;
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {string} text */
    footnote(text: string): this;
    /** @param {import("gpui-kit").Context} cx */
    build(cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * An empty state: an emblem or illustration, a title, a description that
 * names what fills it, and the content that starts it — steps, settings, a
 * primary action.
 */
export declare class EmptyState {
    #private;
    /** @param {string} title */
    constructor(title: string);
    /** @param {string} text */
    description(text: string): this;
    /** @param {any} element an `IconBadge` or an illustration */
    art(element: any): this;
    /** @param {any[]} elements */
    children(elements: any[]): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/** A tinted panel for one fact and its label: `This week  -6%`. */
export declare class ToneTile {
    #private;
    /** @param {string} label */
    constructor(label: string);
    /** @param {string} text */
    value(text: string): this;
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * Three dots that brighten in turn: work in progress whose length is unknown.
 *
 * The application advances `step` on a timer (a few times a second is enough)
 * and calls `cx.notify()`; each dot's opacity then eases to its new target in
 * native code, so the motion stays smooth without a redraw per frame.
 */
export declare class Pulse {
    #private;
    /** @param {string} id stable, so the dots keep their motion across renders */
    constructor(id: string);
    /** @param {number} value advances by one per tick */
    step(value: number): this;
    /** @param {Tone} value */
    tone(value: Tone): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
/**
 * A thin track with a short bar sweeping back and forth across it, for the
 * edge of a surface that is busy. Like `Pulse`, it moves when the
 * application advances `step`; each step sends the bar to the other end.
 */
export declare class ScanLine {
    #private;
    /** @param {string} id stable, so the bar keeps its motion across renders */
    constructor(id: string);
    /** @param {number} value */
    step(value: number): this;
    /** How long one sweep takes, in milliseconds; match the step interval. @param {number} ms */
    period(ms: number): this;
    /** @param {import("gpui-kit").Context} _cx */
    build(_cx: import("gpui-kit").Context): import("gpui-kit").Element;
}
