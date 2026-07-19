import { isNonTerminal } from "./grammar";

const sameItem = (a, b) => a.prod === b.prod && a.dot === b.dot;

const includesItem = (items, item) => items.some((existing) => sameItem(existing, item));

function closure(seed, grammar) {
  const items = seed.map((item) => ({ ...item }));

  for (let i = 0; i < items.length; i++) {
    const { prod, dot } = items[i];
    const rhs = grammar.productions[prod].rhsSymbols;
    if (dot >= rhs.length) continue;

    const next = rhs[dot];
    if (!isNonTerminal(next)) continue;

    grammar.productions.forEach((production) => {
      if (production.lhs !== next) return;
      const candidate = { prod: production.index, dot: 0 };
      if (!includesItem(items, candidate)) items.push(candidate);
    });
  }

  return items;
}

function advanceOn(items, symbol, grammar) {
  const kernel = [];
  items.forEach(({ prod, dot }) => {
    const rhs = grammar.productions[prod].rhsSymbols;
    if (dot < rhs.length && rhs[dot] === symbol) kernel.push({ prod, dot: dot + 1 });
  });
  return kernel;
}

function sortItems(items) {
  return [...items].sort((a, b) => a.prod - b.prod || a.dot - b.dot);
}

function sameItemSet(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = sortItems(a);
  const sortedB = sortItems(b);
  return sortedA.every((item, index) => sameItem(item, sortedB[index]));
}

export function buildCanonicalCollection(grammar) {
  const startKernel = [{ prod: 0, dot: 0 }];
  const states = [{ id: 0, kernel: startKernel, items: closure(startKernel, grammar), goto: {} }];
  const transitions = [];

  for (let i = 0; i < states.length; i++) {
    const state = states[i];

    grammar.symbols.forEach((symbol) => {
      const kernel = advanceOn(state.items, symbol, grammar);
      if (kernel.length === 0) return;

      const items = closure(kernel, grammar);
      let target = states.findIndex((candidate) => sameItemSet(candidate.items, items));
      if (target === -1) {
        target = states.length;
        states.push({ id: target, kernel, items, goto: {} });
      }

      state.goto[symbol] = target;
      transitions.push({ from: state.id, symbol, to: target });
    });
  }

  return { states, transitions };
}

export function closureItems(state, grammar) {
  return state.items.filter((item) => !includesItem(state.kernel, item));
}

export function isComplete(item, grammar) {
  return item.dot >= grammar.productions[item.prod].rhsSymbols.length;
}

export function itemToParts(item, grammar) {
  const production = grammar.productions[item.prod];
  return {
    lhs: production.lhs,
    before: production.rhsSymbols.slice(0, item.dot),
    after: production.rhsSymbols.slice(item.dot),
  };
}

export function formatItem(item, grammar) {
  const { lhs, before, after } = itemToParts(item, grammar);
  return `${lhs} → ${before.join("")}·${after.join("")}`;
}
