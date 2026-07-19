import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import Explanation from "./Explanation";

function describeStep(step, grammar) {
  const top = step.stateStack[step.stateStack.length - 1];
  const lookahead = step.input[0];

  if (step.action === "acc") {
    return `State ${top} sees “$” and the table says accept, so the string is valid.`;
  }
  if (step.action.startsWith("s")) {
    return `State ${top} reads “${lookahead}”. ACTION[${top}, ${lookahead}] = ${step.action}: shift “${lookahead}” and push state ${step.action.slice(1)}.`;
  }
  const production = grammar.productions[Number(step.action.slice(1))];
  const count = production.rhsSymbols.length;
  return `State ${top}, lookahead “${lookahead}”. ACTION = ${step.action}: reduce by ${production.index} (${production.lhs} → ${production.rhs || "ε"}); pop ${count} symbol${count === 1 ? "" : "s"}, push ${production.lhs}, then GO-TO ${step.goto}.`;
}

function InputPill({ input }) {
  const [head, ...rest] = input.split("");
  return (
    <span className="input-pill">
      <span className="input-head">{head}</span>
      <span className="input-rest">{rest.join("")}</span>
    </span>
  );
}

export default function ParseStage({ grammar, sentence, onSentenceChange, onParse, result, mode, showExplanations, index = 6 }) {
  const stepped = mode === "learn";
  const steps = result?.steps ?? [];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const count = result?.steps?.length ?? 0;
    setActive(count > 0 ? count - 1 : 0);
    setPlaying(false);
  }, [result]);

  useEffect(() => {
    if (!playing) return undefined;
    if (active >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    timer.current = setTimeout(() => setActive((value) => value + 1), 850);
    return () => clearTimeout(timer.current);
  }, [playing, active, steps.length]);

  const startPlay = () => {
    if (active >= steps.length - 1) setActive(0);
    setPlaying(true);
  };

  const shownSteps = stepped ? steps.slice(0, active + 1) : steps;
  const currentStep = steps[active];

  const submit = (event) => {
    event.preventDefault();
    onParse();
  };

  return (
    <Section
      id="parse"
      index={index}
      title="Parse a sentence"
      description="Run a string through the table. The parser shifts and reduces on a stack until it accepts or gets stuck."
    >
      <Explanation title="How the driver works" visible={showExplanations}>
        <p>
          The parser keeps a stack of states. It looks up <code>ACTION[top state, next symbol]</code>: on a
          shift it pushes the symbol and a new state; on a reduce it pops the right-hand side, pushes the
          left-hand side, and follows GO-TO. It stops at <code>acc</code> or when no action exists.
        </p>
      </Explanation>

      <form className="field" onSubmit={submit}>
        <label className="field-label" htmlFor="sentence-input">
          Sentence
        </label>
        <div className="button-row">
          <input
            id="sentence-input"
            className="sentence-input"
            value={sentence}
            onChange={(event) => onSentenceChange(event.target.value)}
            placeholder="()"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <button type="submit" className="button button-primary">
            Parse
          </button>
        </div>
        <p className="field-hint">The end marker <code>$</code> is added automatically.</p>
      </form>

      {result && result.error && (
        <div className="callout callout-error" role="alert">
          <strong>Rejected.</strong> {result.error}
        </div>
      )}

      {result && result.accepted && (
        <div className="callout callout-accept" role="status">
          <strong>Accepted.</strong> “{sentence.replace(/\s+/g, "") || ""}” is a valid sentence of this grammar.
        </div>
      )}

      {steps.length > 0 && (
        <>
          {stepped && currentStep && (
            <div className="parse-current">
              <div className="parse-config">
                <span className="config-label">input</span>
                <InputPill input={currentStep.input} />
              </div>
              <div className="parse-config">
                <span className="config-label">state stack</span>
                <span className="stack">
                  {currentStep.stateStack.map((value, index) => (
                    <span className="stack-chip" key={index}>
                      {value}
                    </span>
                  ))}
                </span>
              </div>
              <div className="parse-config">
                <span className="config-label">symbol stack</span>
                <span className="stack">
                  {currentStep.symbolStack.map((value, index) => (
                    <span className="stack-chip" key={index}>
                      {value}
                    </span>
                  ))}
                </span>
              </div>
              <p className="parse-note">
                <span className="parse-note-step">Step {currentStep.index}</span> {describeStep(currentStep, grammar)}
              </p>
            </div>
          )}

          <div className="table-scroll">
            <table className="parse-table trace-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>State stack</th>
                  <th>Symbol stack</th>
                  <th>Input</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shownSteps.map((step, index) => (
                  <tr key={step.index} className={stepped && index === active ? "is-current" : ""}>
                    <td className="col-state">{step.index}</td>
                    <td>{step.stateStack.join(" ")}</td>
                    <td>{step.symbolStack.join(" ")}</td>
                    <td>{step.input}</td>
                    <td className={`trace-action action-${step.action[0]}`}>{step.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stepped && (
            <div className="stepper">
              <button type="button" className="button button-ghost" onClick={() => { setPlaying(false); setActive(0); }} disabled={active === 0}>
                ⏮ First
              </button>
              <button type="button" className="button button-ghost" onClick={() => { setPlaying(false); setActive((value) => Math.max(0, value - 1)); }} disabled={active === 0}>
                ◀ Back
              </button>
              <button type="button" className="button button-primary" onClick={() => { setPlaying(false); setActive((value) => Math.min(steps.length - 1, value + 1)); }} disabled={active >= steps.length - 1}>
                Step ▶
              </button>
              <button type="button" className="button button-ghost" onClick={() => (playing ? setPlaying(false) : startPlay())} disabled={steps.length <= 1}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="button button-ghost" onClick={() => { setPlaying(false); setActive(steps.length - 1); }} disabled={active >= steps.length - 1}>
                Skip to result ⏭
              </button>
              <span className="stepper-count">
                Step {active + 1} of {steps.length}
              </span>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
