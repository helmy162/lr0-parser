import { useCallback, useEffect, useMemo, useState } from "react";
import Section from "./Section";
import Explanation from "./Explanation";
import DfaGraph from "./DfaGraph";
import StateCard from "./StateCard";
import ErrorBoundary from "./ErrorBoundary";

export default function DfaStage({ grammar, states, transitions, table, showExplanations, index = 4 }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setSelectedId(null);
  }, [states]);

  const acceptStates = useMemo(() => {
    const set = new Set();
    table.rows.forEach((row) => {
      if (row.action["$"]?.type === "accept") set.add(row.state);
    });
    return set;
  }, [table]);

  const origins = useMemo(() => {
    const map = {};
    transitions.forEach(({ from, symbol, to }) => {
      if (!(to in map)) map[to] = { from, symbol };
    });
    return map;
  }, [transitions]);

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const selectedState = selectedId !== null ? states[selectedId] : null;

  return (
    <Section
      id="dfa"
      index={index}
      title="DFA of item sets"
      description="Each item set is a state; each GOTO is a labelled transition. Drag nodes to rearrange, use the buttons to zoom, and click a state to see the items inside it."
    >
      <Explanation title="From item sets to a diagram" visible={showExplanations}>
        <p>
          The states you just built become the nodes of a deterministic finite automaton. An edge labelled
          <code> X</code> from I<sub>i</sub> to I<sub>j</sub> means <code>GOTO(Iᵢ, X) = Iⱼ</code>. The start
          state is highlighted; accepting states are filled.
        </p>
      </Explanation>

      <div className="dfa-canvas">
        <ErrorBoundary
          resetKey={states.length}
          fallback={
            <div className="dfa-fallback">
              The diagram couldn't be drawn, but the item sets and table are still correct.
            </div>
          }
        >
          <DfaGraph grammar={grammar} states={states} acceptStates={acceptStates} onSelectState={handleSelect} />
        </ErrorBoundary>
      </div>

      {selectedState ? (
        <div className="dfa-detail">
          <StateCard state={selectedState} grammar={grammar} origin={origins[selectedState.id]} />
        </div>
      ) : (
        <p className="dfa-hint">Click a state in the diagram to see its item set.</p>
      )}
    </Section>
  );
}
