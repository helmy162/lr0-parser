import Section from "./Section";
import Explanation from "./Explanation";

export default function AugmentStage({ grammar, showExplanations, index = 2 }) {
  return (
    <Section
      id="augment"
      index={index}
      title="Augment & number"
      description="A fresh start rule is added and every production is numbered. These numbers are the r1, r2… you'll see as reduce actions."
    >
      <Explanation title="Why augment the grammar?" visible={showExplanations}>
        <p>
          We add a new start production <code>{grammar.augmentedStart} → {grammar.startSymbol}</code>. It gives
          the parser a single, unambiguous way to finish: when it can reduce by this rule on the end-of-input
          marker <code>$</code>, the input is accepted.
        </p>
      </Explanation>

      <ol className="productions">
        {grammar.productions.map((production) => (
          <li key={production.index} className={`production${production.index === 0 ? " is-augmented" : ""}`}>
            <span className="production-num">{production.index}</span>
            <span className="production-body">
              <span className="item-lhs">{production.lhs}</span>
              <span className="item-arrow">→</span>
              {production.rhs === "" ? <span className="epsilon">ε</span> : production.rhs}
            </span>
            {production.index === 0 && <span className="production-tag">augmented</span>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
