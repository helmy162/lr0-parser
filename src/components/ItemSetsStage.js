import { useEffect, useMemo, useState } from "react";
import Section from "./Section";
import Explanation from "./Explanation";
import StateCard from "./StateCard";

export default function ItemSetsStage({ grammar, states, transitions, mode, showExplanations, index = 3 }) {
  const origins = useMemo(() => {
    const map = {};
    transitions.forEach(({ from, symbol, to }) => {
      if (!(to in map)) map[to] = { from, symbol };
    });
    return map;
  }, [transitions]);

  const stepped = mode === "learn";
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
  }, [states]);

  const shown = stepped ? states.slice(0, visibleCount) : states;
  const atEnd = visibleCount >= states.length;

  return (
    <Section
      id="items"
      index={index}
      title="Item sets"
      description="The canonical collection of LR(0) item sets (the states of the DFA), built with closure and GOTO."
    >
      <Explanation title="How each state is built" visible={showExplanations}>
        <p>
          <b>Closure:</b> whenever the dot sits just before a non-terminal (like <code>A → (·A B )</code>), add
          that non-terminal's productions with the dot at the front. Repeat until nothing new appears.
        </p>
        <p>
          <b>GOTO:</b> to leave a state on a symbol X, move the dot past every X, then take the closure of the
          result. That set is the state you transition to on X.
        </p>
      </Explanation>

      <div className="state-grid">
        {shown.map((state) => (
          <StateCard key={state.id} state={state} grammar={grammar} origin={origins[state.id]} />
        ))}
      </div>

      {stepped && (
        <div className="stepper">
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setVisibleCount((count) => Math.max(1, count - 1))}
            disabled={visibleCount <= 1}
          >
            ‹ Prev state
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setVisibleCount((count) => Math.min(states.length, count + 1))}
            disabled={atEnd}
          >
            Next state ›
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setVisibleCount(states.length)}
            disabled={atEnd}
          >
            Show all {states.length}
          </button>
          <span className="stepper-count">
            State {Math.min(visibleCount, states.length)} of {states.length}
          </span>
        </div>
      )}
    </Section>
  );
}
