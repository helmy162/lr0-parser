import Section from "./Section";
import Explanation from "./Explanation";

export default function GrammarStage({ value, onChange, onGenerate, onReset, errors }) {
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onGenerate();
    }
  };

  return (
    <Section
      id="grammar"
      index={1}
      title="Grammar"
      description="Enter a context-free grammar. Each symbol is a single character. Non-terminals are A to Z; everything else is a terminal."
    >
      <Explanation title="How to write the grammar" visible={true}>
        <ol className="rules">
          <li>Put the start non-terminal alone on the first line.</li>
          <li>Write one production per line, in the form <code>A-&gt;(AB)</code>.</li>
          <li>Don't separate symbols with spaces. Each character is its own symbol.</li>
          <li>Don't add the end-of-input marker <code>$</code> or the augmented rule; the tool adds those for you.</li>
        </ol>
      </Explanation>

      <div className="field">
        <label className="field-label" htmlFor="grammar-input">
          Productions
        </label>
        <textarea
          id="grammar-input"
          className="grammar-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={8}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-describedby="grammar-hint"
        />
        <p className="field-hint" id="grammar-hint">
          Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to generate.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="callout callout-error" role="alert">
          <strong>Check the grammar:</strong>
          <ul>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="button-row">
        <button type="button" className="button button-primary" onClick={onGenerate}>
          Generate parsing table
        </button>
        <button type="button" className="button button-ghost" onClick={onReset}>
          Reset to example
        </button>
      </div>
    </Section>
  );
}
