# Working on Zion UI

## What belongs here

The library owns presentation. The application owns copy, stable ids,
callbacks, navigation, domain state and asset paths, so a component takes those
as arguments and never invents them. Icons are application-root-relative SVG
paths, because that is where gpui-shell resolves `svg()`.

## Rules every component keeps

- Read colors from `theme()` while building, never at import time, so
  `applyTheme()` and one `cx.notify()` restyle a whole window.
- Every state keeps its size. Reserve the 1px border in every variant and
  change only its color; hover and selection recolor, they never add an edge.
- Words are sans-serif; data — numbers, ids, models, keys — is monospace via
  `theme().fonts.mono`.
- Meaning comes from tones (`accent`, `success`, `warning`, `danger`, `info`,
  `neutral`); never paint a status with a literal color.
- Radii nest: an inset surface uses the next tier down from its container.
- Pointer listeners other than click go on an element the shell owns (a `div`
  or flex wrapper), not on a base `Button`, which ignores them.

## Before committing

```sh
bun test        # runs `bun run types` first
```

A new export needs its name in `tests/public-api.test.js` and a test in
`tests/components.test.js`. Anything new reached from `gpui-kit` or
`gpui-base` needs a declaration in `typings/gpui-kit.d.ts` and a stub in
`tests/gpui-stub.js`. Show new components in `examples/gallery`.
