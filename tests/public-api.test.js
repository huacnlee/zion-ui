// @ts-check
import { expect, test } from "bun:test";
import * as zion from "zion-ui";

const EXPORTS = [
  "AppFrame", "Badge", "Button", "Callout", "Card", "Chip", "DEFAULT_PALETTE", "Divider", "EmptyState", "Heading",
  "IconBadge", "IconButton", "Kbd", "Legend", "MenuList", "Meter", "MetricTile", "Mono", "Muted", "NavItem",
  "NavSection", "PageHeader", "PropertyList", "RADIUS", "SearchField", "SectionLabel", "SegmentBar", "Segmented",
  "SelectTrigger", "Sidebar", "Stat", "StatStrip", "Steps", "THEMES", "TONES", "TYPE", "Tag", "Text", "TickBar", "ToggleRow",
  "ToneTile", "alpha", "applyTheme", "inkColor", "mix", "theme", "variantChrome",
];

test("the public surface is exactly the registered names", () => {
  expect(Object.keys(zion).sort()).toEqual([...EXPORTS].sort());
});

test("the committed declarations cover the public API", async () => {
  const source = await Bun.file(new URL("../src/index.d.ts", import.meta.url)).text();
  for (const name of EXPORTS) expect(source).toContain(name);
});
