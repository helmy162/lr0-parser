# LR(0) Parser

An interactive tool that **builds an LR(0) parser step by step**, so students can *see* how a
context-free grammar becomes a DFA and a parsing table, and watch a sentence being parsed on the
stack. Live at **[lr0parser.com](https://lr0parser.com)**.

Most parser generators just print the answer. This one walks through the construction the way a
compilers course teaches it, with a plain-language explanation at every phase.

## Features

- **Six guided phases:** grammar, augment & number, LR(0) item sets, DFA, parsing table, and parse a
  sentence. Jump to any phase from the sticky rail, or scroll straight through.
- **Closure & GOTO, made visible.** Each item set shows its kernel vs. closure items and where every
  symbol transitions next.
- **Interactive DFA.** The item sets are rendered as a pannable automaton with zoom controls; click a
  state to inspect its item set.
- **Colour-coded ACTION/GOTO table** so shift, reduce, accept, and go-to each read at a glance.
- **Conflict detection.** When a grammar isn't LR(0), the clashing cells are flagged and explained
  instead of being silently overwritten.
- **Step-through parsing.** Run a string and step, play, or skip through the stack trace.
- **Quick by default, step-by-step on demand.** The default view shows the full result at once; one
  button reveals a guided walkthrough with explanations at every phase.
- **Light & dark themes**, responsive, keyboard-accessible.

## Grammar format

- The first line is the start non-terminal on its own.
- One production per line, e.g. `A->(AB)`.
- Every character is its own symbol. Non-terminals are `A` to `Z`, everything else is a terminal. Don't
  separate symbols with spaces.
- Don't add the end-of-input marker `$` or the augmented rule; the tool adds them for you.

```
S
S->A
A->(AB)
A->()
B->(A)
B->()
```

## Tech

React (Create React App). The parsing engine lives in [`src/lib`](src/lib) as pure, framework-free
functions (`grammar`, `itemsets`, `table`, `parse`) covered by unit tests; the UI in
[`src/components`](src/components) renders that data as real components. Theming is driven by CSS custom
properties. The DFA is drawn with [`react-graph-vis`](https://github.com/crubier/react-graph-vis).

## Local development

```bash
npm install
npm start      # http://localhost:3000
npm test       # run the parsing-engine tests
npm run build  # production build
```

## Credit

Built by [Mohamed Abdelmaksoud](https://www.linkedin.com/in/helmy16/). If it helped you, you can
[buy me a coffee](https://www.buymeacoffee.com/helmy16).
