// @ts-check
import { View, div } from "gpui-kit";
import { h_flex, v_flex, InputState, Popup } from "gpui-base";
import {
  AppFrame, Badge, Button, Tag, Callout, Card, Chip, Divider, EmptyState, IconBadge, IconButton, Kbd, Legend, MenuList,
  MetricTile, NavItem, NavSection, PageHeader, PropertyList, SearchField, SectionLabel, SegmentBar, Segmented,
  SelectTrigger, Sidebar, Stat, StatStrip, Steps, TickBar, ToggleRow, ToneTile, applyTheme, theme,
} from "../../src/index.js";

// A gallery of every zion-ui component. The numbers are made up for the
// gallery; nothing here reads or changes real data.

// Asset paths resolve against the application root, which is the repository.
const icon = (name) => `examples/gallery/icons/${name}.svg`;
const PAGES = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "devices", label: "Devices", icon: "device", count: 3 },
  { id: "schedules", label: "Schedules", icon: "calendar" },
  { id: "settings", label: "Settings", icon: "sliders" },
];

export default class Gallery extends View {
  init(_props, _cx) {
    applyTheme();
    this.page = "overview";
    this.sidebarOpen = true;
    this.sidebarWidth = 232;
    this.range = "day";
    this.filters = new Set(["after sunset"]);
    this.precool = true;
    this.notify = false;
    this.mode = "self";
    this.selectOpen = false;
    this.search = InputState.new({ placeholder: "Search" });
  }

  render(cx) {
    const sidebar = new Sidebar("nav").brand("Zion UI").brandMark(icon("mark")).brandAction(this.toggle(cx))
      .search(new SearchField("nav-search", this.search).icon(icon("search")).hint("Ctrl K").build(cx))
      .children([
        ...PAGES.map((page) => {
          const item = new NavItem(`nav-${page.id}`).label(page.label).icon(icon(page.icon)).selected(this.page === page.id)
            .onClick((_event, cx) => { this.page = page.id; cx.notify(); });
          if (page.count) item.count(page.count);
          return item.build(cx);
        }),
        new NavSection("Rooms").action(new IconButton("add-room").icon(icon("plus")).description("Add a room").size("sm").build(cx)).build(cx),
        new NavItem("room-studio").label("Studio").indicator().muted().build(cx),
        new NavItem("room-kitchen").label("Kitchen").muted().build(cx),
        new NavItem("room-garage").label("Garage").muted().build(cx),
      ])
      .footer(new Legend([{ label: "theme", value: theme().name, tone: "accent" }]).inline().build(cx))
      .build(cx);

    const main = v_flex().size_full().min_h_0()
      .child(this.header(cx).badge(new Badge("Online").tone("accent").dot().build(cx))
        .actions([
          new Button("export").label("Export").icon(icon("share")).variant("outline").build(cx),
          new IconButton("layout").icon(icon("list")).description("Change layout").variant("secondary").build(cx),
        ]).build(cx))
      .child(div().id("content").flex_1().min_h_0().overflow_y_scrollbar().px(28).pb(28)
        .child(v_flex().gap(20)
          .child(h_flex().gap(20).items_start()
            .child(this.output(cx))
            .child(this.automation(cx)))
          .child(this.circuits(cx))
          .child(h_flex().gap(20).items_start()
            .child(this.inverter(cx))
            .child(this.schedules(cx)))));

    return new AppFrame("gallery").sidebar(sidebar).main(main).collapsed(!this.sidebarOpen).sidebarWidth(this.sidebarWidth)
      .resizable({ min: 180, max: 360, onResize: (width, cx) => { this.sidebarWidth = width; cx.notify(); } })
      .build(cx);
  }

  // The sidebar toggle lives in the sidebar while it is open and moves to the
  // start of the page title once it is shut.
  toggle(cx) {
    return new IconButton("toggle-sidebar").icon(icon("panel-left")).size("sm")
      .description(this.sidebarOpen ? "Hide sidebar" : "Show sidebar")
      .onClick((_event, cx) => { this.sidebarOpen = !this.sidebarOpen; cx.notify(); }).build(cx);
  }

  header(cx) {
    const header = new PageHeader("Overview").breadcrumb(["Gallery", "Home energy"]);
    if (!this.sidebarOpen) header.leading(this.toggle(cx));
    return header;
  }

  output(cx) {
    return new Card("output").title("Solar output").subtitle("kilowatts · today").icon(icon("sun"))
      .trailing(new Segmented("range").options([{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }])
        .selected(this.range).onSelect((id, cx) => { this.range = id; cx.notify(); }).build(cx))
      .body(v_flex().gap(18)
        .child(new Stat("4.82 kW").note("peak 6.1 kW at 12:40").build(cx))
        .child(v_flex().gap(8)
          .child(new TickBar(0.68).ticks(36).height(28).build(cx))
          .child(new TickBar(0.45).ticks(36).height(14).tone("neutral").build(cx)))
        .child(new Legend([
          { label: "generated", value: "21.4 kWh · $3.20", tone: "accent" },
          { label: "consumed", value: "14.9 kWh", color: theme().colors.foreground },
          { label: "exported (31%)", value: "6.5 kWh · $0.97" },
        ]).build(cx)))
      .build(cx);
  }

  automation(cx) {
    const chips = ["weekdays", "after sunset", "away", "eco"];
    const modes = [
      { id: "self", label: "Self-consumption" },
      { id: "tou", label: "Time-of-use", meta: "peak 17–21" },
      { id: "backup", label: "Backup only", meta: "storms" },
    ];
    const current = modes.find((item) => item.id === this.mode);
    return new Card("automation").title("Automation").subtitle("rules · whole house").icon(icon("bolt"))
      .body(v_flex().gap(14)
        .child(new SectionLabel("When").build(cx))
        .child(h_flex().flex_wrap().gap(8).children(chips.map((name) => new Chip(`chip-${name.replace(/\s/g, "-")}`).label(name)
          .selected(this.filters.has(name))
          .onClick((_event, cx) => { this.filters.has(name) ? this.filters.delete(name) : this.filters.add(name); cx.notify(); })
          .build(cx))))
        .child(new ToggleRow("precool").title("Pre-cool before peak").description("starts 30 min early").checked(this.precool)
          .onChange((value, cx) => { this.precool = value; cx.notify(); }).build(cx))
        .child(new ToggleRow("notify").title("Notify on export").checked(this.notify)
          .onChange((value, cx) => { this.notify = value; cx.notify(); }).build(cx))
        .child(new SectionLabel("Battery mode").build(cx))
        .child(Popup.new("mode-popup", new SelectTrigger("mode").value(current.label).chevron(icon("chevron-down")).open(this.selectOpen)
            .onClick((_event, cx) => { this.selectOpen = !this.selectOpen; cx.notify(); }).build(cx))
          .anchor("top_left")
          .when(this.selectOpen, (el) => el.content(new MenuList("mode-list").width(240).items(modes.map((item) => ({
            ...item, checked: item.id === this.mode,
            onSelect: (cx) => { this.mode = item.id; this.selectOpen = false; cx.notify(); },
          }))).build(cx))))
        .child(h_flex().gap(8).pt(4)
          .child(new Button("reset").label("Reset").variant("secondary").build(cx))
          .child(new Button("save").label("Save").variant("primary").build(cx))
          .child(new Button("remove").label("Remove rule").variant("danger").build(cx))))
      .build(cx);
  }

  circuits(cx) {
    return new Card("circuits").title("Circuit health").subtitle("average draw · last 7 days").icon(icon("bolt"))
      .trailing(new Tag("12 circuits").build(cx))
      .body(v_flex().gap(16)
        .child(h_flex().gap(12)
          .child(new MetricTile("HVAC").value("3.4 kW").caption("Heating and cooling").badge(new Badge("HIGH").tone("danger").mono().build(cx)).meter(0.85).tone("danger").footnote("Top 10% of similar homes").build(cx))
          .child(new MetricTile("Water heater").value("1.1 kW").caption("Tank, 190 L").badge(new Badge("WATCH").tone("warning").mono().build(cx)).meter(0.55).tone("warning").footnote("Up 12% on last week").build(cx))
          .child(new MetricTile("Lighting").value("0.2 kW").caption("All rooms").badge(new Badge("GOOD").tone("success").mono().build(cx)).meter(0.15).tone("success").footnote("Below this month's target").build(cx)))
        .child(h_flex().gap(12)
          .child(new ToneTile("This week").value("-6%").tone("success").build(cx))
          .child(new ToneTile("Budget left").value("$48").tone("warning").build(cx))
          .child(new ToneTile("Sensors").value("11 of 12").tone("info").build(cx)))
        .child(v_flex().gap(8)
          .child(new SectionLabel("Usage by circuit · 92 kWh").build(cx))
          .child(new SegmentBar([{ value: 41, tone: "danger" }, { value: 22, tone: "warning" }, { value: 14, tone: "info" }, { value: 9, tone: "success" }, { value: 6 }]).build(cx)))
        .child(new Callout("Heating and cooling used 41% of this week's energy").icon(icon("alert")).build(cx)))
      .build(cx);
  }

  inverter(cx) {
    const copy = (id) => new IconButton(id).icon(icon("copy")).description("Copy value").size("sm").build(cx);
    return new Card("inverter").title("Inverter · east roof").subtitle("serial ZN-2041 · synced 12:08").icon(icon("device"))
      .trailing(new Badge("Throttled").mono().build(cx))
      .body(v_flex().gap(18)
        .child(new StatStrip([{ label: "Uptime", value: "42 d" }, { label: "Temperature", value: "51 °C" }, { label: "Efficiency", value: "96.4%" }, { label: "Saved", value: "$412", tone: "accent" }]).build(cx))
        .child(new Divider().dashed().build(cx))
        .child(new PropertyList([
          { label: "firmware", value: "3.2.1", tone: "accent", trailing: copy("copy-firmware") },
          { label: "status", value: "THERMAL_LIMIT", trailing: copy("copy-status") },
          { label: "panels", value: "14 × 410 W", trailing: copy("copy-panels") },
          { label: "last sync", value: "2 min ago", tone: "accent", trailing: copy("copy-sync") },
        ]).build(cx)))
      .footer(h_flex().w_full().gap(8).justify_end()
        .child(new Button("copy-serial").label("Copy serial").variant("outline").size("sm").uppercase().build(cx))
        .child(new Button("share").label("Share").icon(icon("share")).variant("secondary").size("sm").uppercase().build(cx)))
      .build(cx);
  }

  schedules(cx) {
    return new Card("schedules").title("Schedules").subtitle("devices · automations").icon(icon("calendar"))
      .trailing(new Tag("0 schedules").build(cx))
      .body(new EmptyState("No schedules yet").art(new IconBadge(icon("calendar")).size(56).build(cx))
        .description("Your meter and inverter are connected. Add a schedule to move heavy loads into the sunny hours.")
        .children([
          new Steps([{ title: "Meter linked", detail: "v1.8", done: true }, { title: "Inverter online", detail: "14 panels", done: true }, { title: "Schedule added", detail: "not yet" }]).build(cx),
          new Button("add-schedule").label("Add a schedule").icon(icon("plus")).variant("primary").size("lg").build(cx),
        ]).build(cx))
      .build(cx);
  }
}
