// @ts-check
import { beforeEach, expect, test } from "bun:test";
import { resolvedStyle } from "./gpui-stub.js";
import { arg, calls, cx, descendants, named, texts } from "./helpers.js";
import {
  AppFrame, Badge, Button, Callout, Card, Chip, Divider, EmptyState, IconBadge, IconButton, Kbd, Legend,
  MenuList, Meter, MetricTile, Mono, NavItem, NavSection, PageHeader, PropertyList, SearchField, SectionLabel,
  SegmentBar, Segmented, SelectTrigger, Sidebar, Stat, StatStrip, Steps, TickBar, ToggleRow, ToneTile, applyTheme, theme,
} from "zion-ui";

beforeEach(() => applyTheme());
const el = (name) => /** @type {any} */ ({ name, calls: [], map() {}, child() {} });

test("buttons reserve a 1px border in every variant, so states never resize", () => {
  for (const variant of ["primary", "secondary", "outline", "ghost", "danger", "accent"]) {
    const button = new Button(`b-${variant}`).label("Save").variant(variant).build(cx);
    expect(arg(button, "border")).toBe(1);
    // Hover recolors the fill and nothing else: no border width, no new edge.
    const hoverStyle = calls(button, "hover")[0].style;
    expect(hoverStyle.calls.map((call) => call.method)).toEqual(["bg"]);
    expect(resolvedStyle(button, "hover").border).toBe(1);
  }
});

test("the primary button is light with dark text; disabled drops hover and dims", () => {
  const primary = new Button("go").label("Create").variant("primary").build(cx);
  expect(arg(primary, "bg")).toBe(theme().colors.light);
  expect(arg(primary, "text_color")).toBe(theme().colors.onLight);
  const off = new Button("off").label("Create").disabled().build(cx);
  expect(calls(off, "hover")).toHaveLength(0);
  expect(arg(off, "opacity")).toBe(0.45);
});

test("uppercase footer buttons and icons", () => {
  const button = new Button("share").label("Share").icon("icons/share.svg").uppercase().build(cx);
  expect(texts(button)).toContain("SHARE");
  expect(named(button, "svg")[0].args[0]).toBe("icons/share.svg");
});

test("components validate the arguments an application must supply", () => {
  expect(() => new Button(" ")).toThrow(/id/);
  expect(() => new Button("x").build(cx)).toThrow(/label/);
  expect(() => new IconButton("x").icon("a.svg").build(cx)).toThrow(/description/);
  expect(() => new Button("x").variant("loud")).toThrow(/variant/);
  expect(() => new Badge("x").tone("purple")).toThrow(/tone/);
  expect(() => new Card("c").title("T").build(cx)).toThrow(/body/);
  expect(() => new Segmented("s").build(cx)).toThrow(/options/);
});

test("a selected icon toggle keeps its fill under hover", () => {
  const on = new IconButton("side").icon("a.svg").description("Sidebar").selected().build(cx);
  expect(resolvedStyle(on, "hover").bg).toBe(theme().colors.selected);
});

test("segmented raises the chosen option and reports choices", () => {
  /** @type {string[]} */
  const chosen = [];
  const segmented = new Segmented("range").options([{ id: "day", label: "Day" }, { id: "week", label: "Week" }]).selected("week")
    .onSelect((id) => chosen.push(id)).build(cx);
  const [first, second] = named(segmented, "Button");
  expect(arg(second, "bg")).toBe(theme().colors.raised);
  expect(arg(first, "bg")).toBe(theme().colors.clear);
  expect(arg(first, "border")).toBe(arg(second, "border"));
  arg(first, "on_click")({}, cx);
  expect(chosen).toEqual(["day"]);
});

test("selected chips take the accent tone; removable chips carry their own button", () => {
  /** @type {string[]} */
  const removed = [];
  const chip = new Chip("sunset").label("after sunset").selected().onRemove(() => removed.push("sunset")).build(cx);
  expect(arg(chip, "bg")).toBe(theme().tone("accent").bg);
  const remove = named(chip, "Button").find((button) => button.args[0] === "sunset-remove");
  arg(remove, "on_click")({}, cx);
  expect(removed).toEqual(["sunset"]);
});

test("toggle rows report the flipped value and draw an accent track when on", () => {
  /** @type {boolean[]} */
  const values = [];
  const row = new ToggleRow("precool").title("Pre-cool").description("starts early").checked(true).onChange((value) => values.push(value)).build(cx);
  arg(row, "on_click")({}, cx);
  expect(values).toEqual([false]);
  expect(descendants(row).some((item) => arg(item, "bg") === theme().colors.accent)).toBe(true);
});

test("menu lists draw separators, checks and the keyboard cursor", () => {
  const menu = new MenuList("menu").highlight("b").items([
    { id: "a", label: "Self-consumption", checked: true },
    null,
    { id: "b", label: "Time-of-use", meta: "peak hours" },
  ]).build(cx);
  const rows = named(menu, "Button");
  expect(rows).toHaveLength(2);
  expect(arg(rows[1], "bg")).toBe(theme().colors.raised);
  expect(texts(menu)).toContain("✓");
  expect(texts(menu)).toContain("peak hours");
});

test("meters, tick bars and segment bars size their fills from the data", () => {
  const meter = new Meter(0.64).build(cx);
  expect(arg(descendants(meter)[0], "w")).toBe("64%");
  expect(new Meter(3).build(cx) && arg(descendants(new Meter(3).build(cx))[0], "w")).toBe("100%");
  const ticks = new TickBar(0.5).ticks(10).build(cx);
  const fills = descendants(ticks).map((tick) => arg(tick, "bg"));
  expect(fills.filter((fill) => fill === theme().tone("accent").solid)).toHaveLength(5);
  const bar = new SegmentBar([{ value: 3, tone: "danger" }, { value: 1, tone: "warning" }]).build(cx);
  expect(descendants(bar).map((part) => arg(part, "w"))).toEqual(["75%", "25%"]);
  expect(() => new Meter(Number.NaN)).toThrow(/finite/);
});

test("steps fill finished steps and dash the rest", () => {
  const steps = new Steps([{ title: "Meter linked", done: true }, { title: "Inverter online", done: true }, { title: "Schedule added" }]).build(cx);
  expect(texts(steps).filter((text) => text === "✓")).toHaveLength(2);
  expect(texts(steps)).toContain("3");
  expect(descendants(steps).some((item) => calls(item, "border_dashed").length > 0)).toBe(true);
});

test("cards nest a lighter body inside the shell with concentric radii", () => {
  const card = new Card("output").title("Solar output").subtitle("kilowatts · today").icon("icons/sun.svg")
    .trailing(new Badge("Live").tone("accent").build(cx)).body(el("body")).build(cx);
  const shellRadius = arg(card, "rounded");
  const body = descendants(card).find((item) => arg(item, "bg") === theme().colors.card);
  // Concentric corners: the inset body's radius is the shell's minus the gap.
  expect(arg(body, "rounded")).toBe(shellRadius - arg(card, "p"));
  expect(texts(card)).toEqual(expect.arrayContaining(["Solar output", "kilowatts · today", "Live"]));
  expect(descendants(card).some((item) => calls(item, "border_dashed").length > 0)).toBe(true);
});

test("the frame insets a rounded main panel beside the navigation", () => {
  const frame = new AppFrame("app").sidebar(new Sidebar("nav").brand("Studio").children([
    new NavSection("Recent").build(cx),
    new NavItem("home").label("Home").count(3).selected().build(cx),
  ]).build(cx)).main(el("main")).build(cx);
  const panel = descendants(frame).find((item) => arg(item, "rounded") === theme().radius.main);
  expect(arg(panel, "bg")).toBe(theme().colors.main);
  expect(texts(frame)).toEqual(expect.arrayContaining(["Studio", "Recent", "Home", "3"]));
});

test("nav items expose a secondary press for context menus", () => {
  /** @type {string[]} */
  const pressed = [];
  const item = new NavItem("room-kitchen").label("Kitchen").onSecondaryPress(() => pressed.push("room-kitchen")).build(cx);
  const [right] = calls(item, "on_mouse_down");
  expect(right.args[0]).toBe("right");
  right.args[1]({}, cx);
  expect(pressed).toEqual(["room-kitchen"]);
});

test("data components render their values in monospace", () => {
  const stat = new Stat("4.82 kW").note("peak 6.1 kW").build(cx);
  expect(arg(stat, "font_family")).toBe(theme().fonts.mono);
  expect(texts(stat)).toEqual(["4.82 kW", "peak 6.1 kW"]);
  const strip = new StatStrip([{ label: "Uptime", value: "42 d" }, { label: "Saved", value: "$412", tone: "accent" }]).build(cx);
  expect(texts(strip)).toEqual(["Uptime", "42 d", "Saved", "$412"]);
  const list = new PropertyList([{ label: "firmware", value: "3.2.1", tone: "accent" }, { label: "status", value: "ONLINE" }]).build(cx);
  expect(texts(list)).toEqual(["firmware", "3.2.1", "status", "ONLINE"]);
  const legend = new Legend([{ label: "generated", value: "21.4 kWh", tone: "accent" }]).inline().build(cx);
  expect(texts(legend)).toEqual(["generated", "21.4 kWh"]);
});

test("everything else builds with its content", () => {
  const built = [
    new Badge("Online").tone("success").dot().build(cx),
    new Callout("Heating used 41%").tone("warning").icon("icons/alert.svg").build(cx),
    new Kbd("Ctrl K").build(cx),
    new SearchField("search", {}).icon("icons/search.svg").hint("Ctrl K").build(cx),
    new SelectTrigger("model").label("Model").value("sonnet").mono().open().build(cx),
    new PageHeader("Overview").breadcrumb(["Gallery", "Home"]).badge(new Badge("Live").build(cx)).actions([el("action")]).build(cx),
    new IconBadge("icons/calendar.svg").build(cx),
    new MetricTile("HVAC").value("3.4 kW").caption("Heating and cooling").badge(new Badge("HIGH").tone("danger").build(cx)).meter(0.9).tone("danger").footnote("Top 10%").build(cx),
    new EmptyState("No schedules yet").description("Add a schedule to start.").art(new IconBadge("icons/calendar.svg").build(cx)).children([el("action")]).build(cx),
    new ToneTile("This week").value("-6%").tone("success").build(cx),
    new Divider().dashed().build(cx),
    new Mono("ZN-2041").build(cx),
    new SectionLabel("Battery mode").build(cx),
  ];
  expect(built.every((item) => item && item.calls.length > 0)).toBe(true);
  expect(texts(built[2])).toEqual(["Ctrl K"]);
  expect(texts(built[12])).toEqual(["BATTERY MODE"]);
});
