// @ts-check
import { beforeEach, expect, test } from "bun:test";
import { calls, reset } from "./gpui-stub.js";
import { DEFAULT_PALETTE, THEMES, TONES, alpha, applyTheme, mix, theme } from "zion-ui";

beforeEach(() => { reset(); applyTheme(); });

test("the default accent is green and every tone derives a tint and an edge", () => {
  expect(theme().colors.accent).toBe(DEFAULT_PALETTE.accent);
  for (const tone of TONES) {
    const { fg, bg, border, solid } = theme().tone(tone);
    for (const color of [fg, bg, border, solid]) expect(color).toMatch(/^#[0-9a-f]{6}$/);
    expect(bg).not.toBe(border);
  }
});

test("applyTheme swaps the accent and its derived roles together", () => {
  const before = theme().tone("accent");
  applyTheme({ accent: "#e2b24f" });
  const after = theme().tone("accent");
  expect(after.fg).toBe("#e2b24f");
  expect(after.bg).not.toBe(before.bg);
  expect(after.border).not.toBe(before.border);
});

test("applyTheme installs the palette as gpui-shell's semantic tokens", () => {
  applyTheme({ mono: "Iosevka" });
  const installed = calls.find((call) => call.name === "set_theme")?.args[0];
  expect(installed.appearance).toBe("dark");
  expect(installed.tokens.colors.background).toBe(DEFAULT_PALETTE.main);
  expect(installed.tokens.colors.ring).toBe(DEFAULT_PALETTE.accent);
  expect(theme().fonts.mono).toBe("Iosevka");
});

test("malformed colors are rejected when the theme is applied", () => {
  expect(() => applyTheme({ accent: "gold" })).toThrow(/#rrggbb/);
});

test("mix and alpha", () => {
  expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  expect(alpha("#ffffff", 0.5)).toBe("#ffffff80");
  expect(alpha("#123456", 2)).toBe("#123456ff");
});

test("themes are named; zion is the default and unknown names are refused", () => {
  expect(Object.keys(THEMES)).toEqual(["zion"]);
  expect(theme().name).toBe("zion");
  expect(applyTheme({ theme: "zion" }).colors.accent).toBe(THEMES.zion.accent);
  expect(() => applyTheme({ theme: "plain" })).toThrow(/zion/);
});
