# Zion UI

Dark, quiet presentation components for [gpui-shell](https://github.com/longbridge/gpui-kit) applications: near-black surfaces stepped by lightness, one muted phosphor accent, sans-serif for words and monospace for data, and cards that nest an inset body inside a darker shell.

<img width="1923" height="1331" alt="image" src="https://github.com/user-attachments/assets/665c2986-9102-43c6-ad92-27dee93d7826" />

The library owns presentation. The application owns copy, stable ids, callbacks, state and asset paths, and passes them in.

## Use it

Declare the dependency in `gpui-shell.json`:

```json
{
  "id": "com.example.studio",
  "name": "Studio",
  "entry": "main.js",
  "dependencies": {
    "zion-ui": "huacnlee/zion-ui"
  }
}
```

Apply the theme once, then build components with the render context:

```js
import { View } from "gpui-kit";
import { v_flex } from "gpui-base";
import { AppFrame, Badge, Button, Card, NavItem, PageHeader, Sidebar, Stat, applyTheme } from "zion-ui";

export default class Studio extends View {
  init(_props, _cx) {
    applyTheme();
    this.page = "overview";
  }

  render(cx) {
    const sidebar = new Sidebar("nav").brand("Studio").children([
      new NavItem("overview").label("Overview").icon("icons/grid.svg").selected(this.page === "overview")
        .onClick((_event, cx) => { this.page = "overview"; cx.notify(); }).build(cx),
    ]).build(cx);

    const main = v_flex().size_full()
      .child(new PageHeader("Overview").badge(new Badge("Live").tone("accent").dot().build(cx)).build(cx))
      .child(new Card("output").title("Solar output").subtitle("kilowatts · today").icon("icons/sun.svg")
        .body(new Stat("4.82 kW").note("peak 6.1 kW").build(cx))
        .footer(new Button("export").label("Export").variant("outline").size("sm").build(cx))
        .build(cx));

    return new AppFrame("studio").sidebar(sidebar).main(main).build(cx);
  }
}
```

Icons are SVG paths relative to the application root, which is where gpui-shell resolves `svg()`; the library ships none of its own.

## Theme

Themes are named. The default, **zion**, is a phosphor screen: near-black surfaces with a faint green cast, a green accent, and amber, red and blue for warnings, danger and information, all at one OKLCH lightness and chroma so none is louder than another; `THEMES` lists what is available.

`applyTheme(options)` installs the palette as gpui-shell's semantic tokens, so base and component widgets — inputs, Markdown, scrollbars — follow it, and makes it the palette every Zion component reads while it builds.

```js
applyTheme();                              // zion: a phosphor screen with a green accent
applyTheme({ theme: "zion" });         // the same, by name
applyTheme({ accent: "#e2b24f" });         // another accent; tints and edges follow
applyTheme({ mono: "JetBrains Mono" });    // the monospace family for data
applyTheme({ palette: { canvas: "#0f0f10" } });
```

| Role | Use |
| --- | --- |
| `canvas` | What navigation sits on |
| `main` | The deeper rounded panel the work happens in |
| `card`, `raised` | Steps above it: card bodies, selected rows, bubbles |
| `well` | The recess below it: card shells, fields, tracks |
| `foreground`, `bright`, `secondary`, `tertiary` | Text from body to quiet |
| `accent` | The one accent: emphasis, selection, live state |
| `success`, `warning`, `danger`, `info` | Meanings only |

Every tone — `accent`, `success`, `warning`, `danger`, `info`, `neutral` — derives a tinted background and an edge from its color (`theme().tone("danger")`), so badges, callouts and tiles stay consistent when the accent changes. Radii nest (`main` 18 → `card` 16 → `well` 12 → `control` 10 → `chip` 8) so inset corners stay concentric.

## Components

**Layout** — `AppFrame` (navigation beside an inset rounded main panel; the sidebar slides shut with `collapsed()` and drags wider or narrower with `resizable()`), `Sidebar` (brand, search, items, footer), `NavSection`, `NavItem` (icon, count, activity dot, selected fill, context-menu press), `PageHeader` (leading control, breadcrumb, title — large or `compact()` — badge, meta, actions), `Card` (dashed emblem, title, subtitle, trailing slot, inset body, footer), `IconBadge`, `Divider`.

**Controls** — `Button` (`primary` light, `secondary` dark, `outline`, `ghost`, `danger`, `accent`; three sizes; uppercase footer form), `IconButton` (with selected toggle state), `Segmented`, `Chip` (selectable, removable), `Kbd`, `SearchField` (icon, application `InputState`, key hint), `ToggleRow`, `MenuList` (icons, meta, checks, separators, keyboard cursor), `SelectTrigger`.

**Data** — `Stat` (monospace headline with a toned note), `Badge`, `Callout`, `Meter`, `TickBar`, `SegmentBar`, `Legend`, `PropertyList`, `StatStrip`, `Steps`, `MetricTile`, `ToneTile`, `EmptyState`, and `Pulse` and `ScanLine` for work in progress (they move through native transitions when the application advances their `step`).

**Text** — `Heading`, `Text`, `Muted`, `Mono`, `SectionLabel`.

Every state of a control keeps its size: borders are always reserved and only change color, so hover and selection never move a neighbor.

## Gallery

`examples/gallery` shows every component with sample data. The repository root is the gallery application — its `gpui-shell.json` and `main.js` load the gallery, which imports the library straight from `src/` — so a change to a component shows up on the next reload:

```sh
gpui-shell dev -d .
```

## Development

```sh
bun test        # regenerates src/*.d.ts, then runs the tests
```

`src/*.d.ts` are generated from the JSDoc in `src/` and committed, because gpui-shell fetches this repository as a Git dependency and runs no build step. `typings/gpui-kit.d.ts` declares only the gpui surface the library touches, and `tests/gpui-stub.js` stands in for it under Bun.

## License

MIT
