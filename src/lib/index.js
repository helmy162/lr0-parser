import { parseGrammar } from "./grammar";
import { buildCanonicalCollection } from "./itemsets";
import { buildParseTable } from "./table";

export { isNonTerminal, isTerminal, parseGrammar } from "./grammar";
export { closureItems, isComplete, itemToParts, formatItem } from "./itemsets";
export { formatAction } from "./table";
export { parseSentence, normalizeSentence } from "./parse";

export function analyzeGrammar(text) {
  const grammar = parseGrammar(text);
  if (grammar.errors.length > 0) {
    return { grammar, states: [], transitions: [], table: null };
  }

  const { states, transitions } = buildCanonicalCollection(grammar);
  const table = buildParseTable(grammar, states, transitions);

  return { grammar, states, transitions, table };
}
