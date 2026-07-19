export default function Section({ id, index, title, description, children }) {
  return (
    <section className="stage" id={id} aria-labelledby={`${id}-title`}>
      <header className="stage-head">
        <p className="stage-eyebrow">
          <span className="stage-step">{index}</span> Step {index}
        </p>
        <h2 className="stage-title" id={`${id}-title`}>
          {title}
        </h2>
        {description && <p className="stage-desc">{description}</p>}
      </header>
      {children}
    </section>
  );
}
