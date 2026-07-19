import Item from "./Item";
import { closureItems } from "../lib";

export default function StateCard({ state, grammar, origin }) {
  const extras = closureItems(state, grammar);
  const gotoEntries = Object.entries(state.goto);

  return (
    <article className="state-card">
      <header className="state-card-head">
        <b>State I{state.id}</b>
        {origin ? (
          <span className="state-from">
            = GOTO(I{origin.from}, <span className="sym">{origin.symbol}</span>)
          </span>
        ) : (
          <span className="state-from">start state</span>
        )}
      </header>

      <div className="state-items">
        {state.kernel.map((item) => (
          <div className="state-item" key={`k-${item.prod}-${item.dot}`}>
            <Item item={item} grammar={grammar} />
            <span className="state-tag tag-kernel">kernel</span>
          </div>
        ))}
        {extras.map((item) => (
          <div className="state-item is-closure" key={`c-${item.prod}-${item.dot}`}>
            <Item item={item} grammar={grammar} />
            <span className="state-tag tag-closure">closure</span>
          </div>
        ))}
      </div>

      {gotoEntries.length > 0 && (
        <div className="state-gotos">
          {gotoEntries.map(([symbol, target]) => (
            <span className="goto-chip" key={symbol}>
              {symbol} <span aria-hidden="true">→</span> I{target}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
