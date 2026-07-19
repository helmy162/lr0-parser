const ALL_STEPS = [
  { id: "grammar", label: "Grammar" },
  { id: "augment", label: "Augment" },
  { id: "items", label: "Item sets" },
  { id: "dfa", label: "DFA" },
  { id: "table", label: "Table" },
  { id: "parse", label: "Parse" },
];

export default function ProgressRail({ active, steps = ALL_STEPS }) {
  return (
    <nav className="rail" aria-label="Sections">
      <div className="rail-inner">
        <ol className="rail-list">
          {steps.map((step, index) => (
            <li key={step.id} className={`rail-step${step.id === active ? " is-active" : ""}`}>
              <a href={`#${step.id}`}>
                <span className="rail-num">{index + 1}</span>
                <span className="rail-label">{step.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
