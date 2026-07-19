export default function LearnBar({ onBack }) {
  return (
    <div className="learn-bar">
      <div className="learn-bar-inner">
        <button type="button" className="button button-ghost learn-back" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to results
        </button>
        <div className="learn-bar-title">
          <strong>Step-by-step walkthrough</strong>
          <span>How the LR(0) automaton and parsing table are built for your grammar.</span>
        </div>
      </div>
    </div>
  );
}
