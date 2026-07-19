import { isNonTerminal } from "./grammar";
import { isComplete } from "./itemsets";

const sameEntry = (a, b) => {
  if (!a || !b || a.type !== b.type) return false;
  return a.to === b.to && a.prod === b.prod;
};

export function buildParseTable(grammar, states, transitions) {
  const actionColumns = [...grammar.terminals, "$"];
  const gotoColumns = grammar.nonTerminals;

  const rows = states.map((state) => ({ state: state.id, action: {}, goto: {} }));
  const conflicts = [];

  const setAction = (stateId, symbol, entry) => {
    const cell = rows[stateId].action[symbol];
    if (cell && !sameEntry(cell, entry)) {
      cell.conflict = true;
      entry.conflict = true;
      conflicts.push({ state: stateId, symbol, kinds: [cell.type, entry.type].sort() });
      return;
    }
    rows[stateId].action[symbol] = entry;
  };

  transitions.forEach(({ from, symbol, to }) => {
    if (isNonTerminal(symbol)) {
      rows[from].goto[symbol] = to;
    } else {
      setAction(from, symbol, { type: "shift", to });
    }
  });

  states.forEach((state) => {
    state.items.forEach((item) => {
      if (!isComplete(item, grammar)) return;
      if (item.prod === 0) {
        setAction(state.id, "$", { type: "accept" });
      } else {
        actionColumns.forEach((symbol) => setAction(state.id, symbol, { type: "reduce", prod: item.prod }));
      }
    });
  });

  return { rows, actionColumns, gotoColumns, conflicts };
}

export function formatAction(entry) {
  if (!entry) return "";
  if (entry.type === "shift") return `s${entry.to}`;
  if (entry.type === "reduce") return `r${entry.prod}`;
  if (entry.type === "accept") return "acc";
  return "";
}
