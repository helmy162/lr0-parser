import { useState } from "react";

export default function Explanation({ title, visible, children }) {
  const [open, setOpen] = useState(true);
  if (!visible) return null;

  return (
    <aside className="explain">
      <button
        type="button"
        className="explain-head"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="explain-title">
          <span aria-hidden="true">💡</span> {title}
        </span>
        <span className="explain-toggle">{open ? "hide" : "show"}</span>
      </button>
      {open && <div className="explain-body">{children}</div>}
    </aside>
  );
}
