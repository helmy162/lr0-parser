import { analyzeGrammar, formatAction, parseSentence } from "..";

const BRACKET_GRAMMAR = "S\nS->A\nA->(AB)\nA->()\nB->(A)\nB->()";

const EXPRESSION_GRAMMAR = "E\nE->E+T\nE->T\nT->T*F\nT->F\nF->(E)\nF->i";

const action = (rows, state, symbol) => formatAction(rows[state].action[symbol]);

describe("LR(0) analysis of the bracket grammar", () => {
  const { grammar, states, table } = analyzeGrammar(BRACKET_GRAMMAR);

  test("parses and augments the grammar", () => {
    expect(grammar.errors).toHaveLength(0);
    expect(grammar.augmentedStart).toBe("S'");
    expect(grammar.terminals).toEqual(["(", ")"]);
    expect(grammar.nonTerminals).toEqual(["A", "B", "S"]);
  });

  test("builds the canonical collection of 12 states", () => {
    expect(states).toHaveLength(12);
  });

  test("matches the reference ACTION/GOTO table", () => {
    const { rows } = table;
    expect(action(rows, 0, "(")).toBe("s1");
    expect(rows[0].goto).toEqual({ A: 2, S: 3 });
    expect(action(rows, 1, "(")).toBe("s1");
    expect(action(rows, 1, ")")).toBe("s4");
    expect(rows[1].goto).toEqual({ A: 5 });
    expect(action(rows, 2, "$")).toBe("r1");
    expect(action(rows, 3, "$")).toBe("acc");
    expect(action(rows, 4, ")")).toBe("r3");
    expect(action(rows, 5, "(")).toBe("s6");
    expect(action(rows, 7, ")")).toBe("s10");
    expect(action(rows, 8, "$")).toBe("r5");
    expect(action(rows, 10, "(")).toBe("r2");
    expect(action(rows, 11, ")")).toBe("r4");
  });

  test("has no LR(0) conflicts", () => {
    expect(table.conflicts).toHaveLength(0);
  });
});

describe("parsing a sentence", () => {
  const { grammar, table } = analyzeGrammar(BRACKET_GRAMMAR);

  test("accepts () with a correct trace", () => {
    const result = parseSentence("()", grammar, table.rows);
    expect(result.accepted).toBe(true);
    expect(result.steps).toHaveLength(5);
    expect(result.steps.at(-1).action).toBe("acc");
  });

  test("keeps the symbol stack correct through reductions", () => {
    const result = parseSentence("()", grammar, table.rows);
    const reduceStep = result.steps.find((step) => step.action === "r1");
    expect(reduceStep.symbolStack).toEqual(["$", "A"]);
    expect(result.steps.find((step) => step.action === "r3").symbolStack).toEqual(["$", "(", ")"]);
  });

  test("rejects an unbalanced string instead of crashing", () => {
    const result = parseSentence("(", grammar, table.rows);
    expect(result.accepted).toBe(false);
    expect(result.error).toMatch(/not accepted/i);
  });

  test("rejects input containing an unknown terminal", () => {
    const result = parseSentence("z", grammar, table.rows);
    expect(result.accepted).toBe(false);
    expect(result.error).toMatch(/not a terminal/i);
  });
});

describe("conflict detection", () => {
  test("flags the expression grammar as not LR(0)", () => {
    const { table } = analyzeGrammar(EXPRESSION_GRAMMAR);
    expect(table.conflicts.length).toBeGreaterThan(0);
  });
});

describe("grammar validation", () => {
  test("reports an empty grammar", () => {
    const { grammar } = analyzeGrammar("");
    expect(grammar.errors.length).toBeGreaterThan(0);
  });
});
