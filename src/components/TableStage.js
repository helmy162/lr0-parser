import Section from "./Section";
import Explanation from "./Explanation";
import { formatAction } from "../lib";

const ACTION_CLASS = { shift: "cell-s", reduce: "cell-r", accept: "cell-a" };

function ActionCell({ entry }) {
  if (!entry) return <td className="cell-empty" />;
  const className = `${ACTION_CLASS[entry.type] ?? ""}${entry.conflict ? " cell-conflict" : ""}`;
  return (
    <td className={className}>
      {formatAction(entry)}
      {entry.conflict && <span className="conflict-mark" title="conflict"> ⚠</span>}
    </td>
  );
}

export default function TableStage({ grammar, table, showExplanations, index = 5 }) {
  const { rows, actionColumns, gotoColumns, conflicts } = table;

  return (
    <Section
      id="table"
      index={index}
      title="Parsing table"
      description="ACTION tells the parser to shift or reduce on a terminal; GO-TO gives the next state after reducing to a non-terminal."
    >
      <Explanation title="Where each cell comes from" visible={showExplanations}>
        <ul className="rules">
          <li>
            <b className="cell-s inline-tag">shift</b>: if <code>GOTO(Iᵢ, a) = Iⱼ</code> for a terminal
            <code> a</code>, then <code>ACTION[i, a] = sⱼ</code>.
          </li>
          <li>
            <b className="cell-r inline-tag">reduce</b>: if an item <code>A → α·</code> (dot at the end) is in
            <code> Iᵢ</code>, then <code>ACTION[i, a] = rₖ</code> for every terminal. LR(0) uses no lookahead, so
            the reduce fills the whole row.
          </li>
          <li>
            <b className="cell-a inline-tag">accept</b>: the item <code>{grammar.augmentedStart} → {grammar.startSymbol}·</code> gives
            <code> ACTION[i, $] = acc</code>.
          </li>
          <li>
            <b className="cell-g inline-tag">go-to</b>: if <code>GOTO(Iᵢ, A) = Iⱼ</code> for a non-terminal
            <code> A</code>, then <code>GOTO[i, A] = j</code>.
          </li>
        </ul>
      </Explanation>

      {conflicts.length > 0 && (
        <div className="callout callout-warn" role="alert">
          <strong>This grammar is not LR(0).</strong>
          <p>
            A cell needs two different actions at once, so a plain LR(0) parser can't decide what to do. The clashing cells are marked ⚠ below.
          </p>
          <ul>
            {conflicts.map((conflict, index) => (
              <li key={`${conflict.state}-${conflict.symbol}-${index}`}>
                State {conflict.state}: {conflict.kinds.join("/")} conflict on <code>{conflict.symbol}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="table-scroll">
        <table className="parse-table">
          <thead>
            <tr>
              <th rowSpan={2} className="col-state">
                State
              </th>
              <th colSpan={actionColumns.length} className="col-group">
                Action
              </th>
              {gotoColumns.length > 0 && (
                <th colSpan={gotoColumns.length} className="col-group">
                  Go-To
                </th>
              )}
            </tr>
            <tr>
              {actionColumns.map((symbol) => (
                <th key={`a-${symbol}`}>{symbol}</th>
              ))}
              {gotoColumns.map((symbol) => (
                <th key={`g-${symbol}`}>{symbol}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.state}>
                <td className="col-state">{row.state}</td>
                {actionColumns.map((symbol) => (
                  <ActionCell key={`a-${symbol}`} entry={row.action[symbol]} />
                ))}
                {gotoColumns.map((symbol) => (
                  <td key={`g-${symbol}`} className={row.goto[symbol] !== undefined ? "cell-g" : "cell-empty"}>
                    {row.goto[symbol] !== undefined ? row.goto[symbol] : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
