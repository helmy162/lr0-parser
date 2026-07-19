const NON_TERMINAL = /^[A-Z]$/;
const RULE = /^([A-Z])\s*(?:->|→)\s*(.*)$/;

export function isNonTerminal(symbol) {
  return NON_TERMINAL.test(symbol);
}

export function isTerminal(symbol) {
  return symbol !== "$" && !isNonTerminal(symbol);
}

function toSymbols(rhs) {
  return rhs === "" ? [] : rhs.split("");
}

export function parseGrammar(text) {
  const errors = [];
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { errors: ["Enter a start symbol on the first line, then one production per line."] };
  }

  const startSymbol = lines[0];
  if (!isNonTerminal(startSymbol)) {
    errors.push(`The first line must be a single start non-terminal (A to Z), but got "${startSymbol}".`);
  }

  const augmentedStart = `${startSymbol}'`;
  const productions = [{ index: 0, lhs: augmentedStart, rhs: startSymbol, rhsSymbols: toSymbols(startSymbol) }];

  for (let i = 1; i < lines.length; i++) {
    const match = RULE.exec(lines[i].replace(/\s+/g, ""));
    if (!match) {
      errors.push(`Could not read rule "${lines[i]}". Use the form  A->…  with a single non-terminal on the left.`);
      continue;
    }
    const rhs = match[2];
    productions.push({ index: productions.length, lhs: match[1], rhs, rhsSymbols: toSymbols(rhs) });
  }

  if (productions.length === 1) {
    errors.push("Add at least one production rule, e.g.  S->a");
  }

  const symbolSet = new Set();
  productions.forEach((production) => production.rhsSymbols.forEach((symbol) => symbolSet.add(symbol)));
  const symbols = [...symbolSet].sort();
  const nonTerminals = symbols.filter(isNonTerminal);
  const terminals = symbols.filter(isTerminal);

  return {
    startSymbol,
    augmentedStart,
    productions,
    symbols,
    nonTerminals,
    terminals,
    errors,
  };
}
