import { formatAction } from "./table";

const MAX_STEPS = 5000;

export function normalizeSentence(sentence) {
  const clean = sentence.replace(/\s+/g, "");
  const body = clean.endsWith("$") ? clean.slice(0, -1) : clean;
  return { tokens: body.split(""), display: `${body}$` };
}

export function parseSentence(sentence, grammar, rows) {
  const terminals = new Set(grammar.terminals);
  const { tokens } = normalizeSentence(sentence);

  const invalid = tokens.find((token) => !terminals.has(token));
  if (invalid !== undefined) {
    return {
      accepted: false,
      steps: [],
      error: `"${invalid}" is not a terminal in this grammar. Terminals are: ${grammar.terminals.join(" ") || "(none)"}.`,
    };
  }

  const input = [...tokens, "$"];
  const stateStack = [0];
  const symbolStack = ["$"];
  const steps = [];
  let cursor = 0;

  for (let guard = 0; guard < MAX_STEPS; guard++) {
    const state = stateStack[stateStack.length - 1];
    const lookahead = input[cursor];
    const entry = state !== undefined ? rows[state].action[lookahead] : undefined;

    const step = {
      index: steps.length + 1,
      stateStack: [...stateStack],
      symbolStack: [...symbolStack],
      input: input.slice(cursor).join(""),
      action: formatAction(entry),
      goto: null,
    };

    if (!entry) {
      return {
        accepted: false,
        steps,
        error: `State ${state} has no action on "${lookahead}". "${normalizeSentence(sentence).display}" is not accepted by this grammar.`,
      };
    }

    if (entry.type === "accept") {
      step.action = "acc";
      steps.push(step);
      return { accepted: true, steps };
    }

    if (entry.type === "shift") {
      steps.push(step);
      symbolStack.push(lookahead);
      stateStack.push(entry.to);
      cursor += 1;
      continue;
    }

    const production = grammar.productions[entry.prod];
    const popCount = production.rhsSymbols.length;
    for (let i = 0; i < popCount; i++) {
      stateStack.pop();
      symbolStack.pop();
    }
    symbolStack.push(production.lhs);
    const gotoState = rows[stateStack[stateStack.length - 1]].goto[production.lhs];
    if (gotoState === undefined) {
      return {
        accepted: false,
        steps,
        error: `Missing GOTO for ${production.lhs} in state ${stateStack[stateStack.length - 1]}.`,
      };
    }
    step.goto = gotoState;
    steps.push(step);
    stateStack.push(gotoState);
  }

  return { accepted: false, steps, error: "Stopped after too many steps. The grammar may loop on this input." };
}
