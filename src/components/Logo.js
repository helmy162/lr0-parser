import { useId } from "react";

export function LogoMark({ size = 40, flat = false, className }) {
  const gradientId = `lr-mark-${useId().replace(/:/g, "")}`;
  const fill = flat ? "#059669" : `url(#${gradientId})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="LR(0) Parser"
    >
      {!flat && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      )}
      <rect x="3" y="3" width="58" height="58" rx="17" fill={fill} />
      <text
        x="32"
        y="35"
        fontFamily='ui-monospace, "SF Mono", Menlo, monospace'
        fontSize="25"
        fontWeight="700"
        fill="#fff"
        textAnchor="middle"
        letterSpacing="-1"
      >
        LR
      </text>
      <path d="M19 45 h20" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
      <path
        d="M36 41.5 l5 3.5 -5 3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ size = 40, tagline }) {
  return (
    <div className="brand">
      <LogoMark size={size} />
      <div className="brand-text">
        <h1 className="brand-name">
          LR<span className="brand-paren">(</span>
          <span className="brand-dot">0</span>
          <span className="brand-paren">)</span> Parser
        </h1>
        {tagline && <span className="brand-tag">{tagline}</span>}
      </div>
    </div>
  );
}
