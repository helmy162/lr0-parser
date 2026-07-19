export default function StepsCallout({ onOpen }) {
  return (
    <aside className="steps-callout">
      <div className="steps-callout-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h10M4 10h16M4 15h10M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="steps-callout-text">
        <strong>New to LR(0) parsing?</strong>
        <span>See how this automaton and table are built, one stage at a time, with an explanation for every step.</span>
      </div>
      <button type="button" className="button button-primary steps-callout-button" onClick={onOpen}>
        Show step-by-step explanation
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </aside>
  );
}
