// @ts-check

/** A fake render context: components only read the theme through zion-ui. */
export const cx = /** @type {any} */ ({ notify() {}, stop_propagation() {} });

/** @param {any} el @param {string} method */
export const calls = (el, method) => el.calls.filter((call) => call.method === method);
/** @param {any} el @param {string} method */
export const arg = (el, method) => calls(el, method).at(-1)?.args[0];

/**
 * Every element under `el`, depth first, reached through `child` and
 * `children` — the structure an application would see rendered.
 * @param {any} el
 * @returns {any[]}
 */
export function descendants(el) {
  const found = [];
  for (const call of el.calls ?? []) {
    if (call.method !== "child" && call.method !== "children") continue;
    const items = call.method === "children" ? call.args[0] : call.args;
    for (const item of items) {
      if (item && typeof item === "object" && "calls" in item) {
        found.push(item, ...descendants(item));
      }
    }
  }
  return found;
}

/** @param {any} el @param {string} name */
export const named = (el, name) => [el, ...descendants(el)].filter((item) => item.name === name);

/** Text children anywhere under `el`. @param {any} el */
export function texts(el) {
  return [el, ...descendants(el)].flatMap((item) => (item.calls ?? [])
    .filter((call) => call.method === "child" && typeof call.args[0] === "string")
    .map((call) => call.args[0]));
}
