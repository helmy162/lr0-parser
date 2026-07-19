import { itemToParts } from "../lib";

export default function Item({ item, grammar }) {
  const { lhs, before, after } = itemToParts(item, grammar);
  return (
    <span className="item">
      <span className="item-lhs">{lhs}</span>
      <span className="item-arrow">→</span>
      {before.join("")}
      <span className="item-dot">·</span>
      {after.join("")}
    </span>
  );
}
