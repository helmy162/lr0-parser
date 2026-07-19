import { useMemo, useRef } from "react";
import Graph from "react-graph-vis";
import { formatItem } from "../lib";
import { useTheme } from "../theme";

const PALETTES = {
  light: {
    node: "#ffffff",
    nodeBorder: "#0d9488",
    text: "#0b1a15",
    start: "#d6f7e4",
    startBorder: "#059669",
    accept: "#059669",
    acceptText: "#ffffff",
    edge: "#5b6e66",
    edgeLabel: "#047857",
  },
  dark: {
    node: "#13211c",
    nodeBorder: "#4dd6c7",
    text: "#e6f2ec",
    start: "#123524",
    startBorder: "#34d399",
    accept: "#34d399",
    acceptText: "#062018",
    edge: "#8aa398",
    edgeLabel: "#4dd6c7",
  },
};

const LEVEL_GAP = 210;
const ROW_GAP = 96;
const MIN_SCALE = 0.35;
const MAX_SCALE = 2.4;

function layoutByLevel(states) {
  const level = { 0: 0 };
  const queue = [0];
  while (queue.length > 0) {
    const from = queue.shift();
    Object.values(states[from].goto).forEach((to) => {
      if (level[to] === undefined) {
        level[to] = level[from] + 1;
        queue.push(to);
      }
    });
  }

  const rowByLevel = {};
  const position = {};
  states.forEach((state) => {
    const column = level[state.id] ?? 0;
    const row = rowByLevel[column] ?? 0;
    rowByLevel[column] = row + 1;
    position[state.id] = { x: column * LEVEL_GAP, row };
  });

  states.forEach((state) => {
    const column = level[state.id] ?? 0;
    const count = rowByLevel[column];
    position[state.id].y = (position[state.id].row - (count - 1) / 2) * ROW_GAP;
  });

  return position;
}

function ZoomIcon({ variant }) {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.6" />
      <line x1="13.2" y1="13.2" x2="17.5" y2="17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5.7" y1="8.5" x2="11.3" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {variant === "in" && (
        <line x1="8.5" y1="5.7" x2="8.5" y2="11.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function FitIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 7.5V4h3.5M12.5 4H16v3.5M16 12.5V16h-3.5M7.5 16H4v-3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DfaGraph({ grammar, states, acceptStates, onSelectState }) {
  const { theme } = useTheme();
  const palette = PALETTES[theme] ?? PALETTES.light;
  const networkRef = useRef(null);

  const graph = useMemo(() => {
    const position = layoutByLevel(states);

    const nodes = states.map((state) => {
      const isStart = state.id === 0;
      const isAccept = acceptStates.has(state.id);
      const color = isAccept ? palette.accept : isStart ? palette.start : palette.node;
      const border = isAccept ? palette.accept : isStart ? palette.startBorder : palette.nodeBorder;
      return {
        id: state.id,
        label: `I${state.id}`,
        title: state.items.map((item) => formatItem(item, grammar)).join("\n"),
        x: position[state.id].x,
        y: position[state.id].y,
        color: { background: color, border, highlight: { background: color, border: palette.startBorder } },
        font: { color: isAccept ? palette.acceptText : palette.text },
        borderWidth: isStart || isAccept ? 3 : 1.5,
      };
    });

    const edges = states.flatMap((state) =>
      Object.entries(state.goto).map(([symbol, target]) => ({
        id: `${state.id}-${symbol}-${target}`,
        from: state.id,
        to: target,
        label: symbol,
      }))
    );

    return { nodes, edges };
  }, [states, grammar, acceptStates, palette]);

  const options = useMemo(
    () => ({
      autoResize: true,
      height: "100%",
      width: "100%",
      nodes: {
        shape: "box",
        margin: 10,
        shadow: false,
        font: { face: "ui-monospace, Menlo, monospace", size: 15 },
      },
      edges: {
        arrows: "to",
        color: { color: palette.edge, highlight: palette.startBorder },
        font: { color: palette.edgeLabel, background: "rgba(0,0,0,0)", face: "ui-monospace, Menlo, monospace", size: 15, strokeWidth: 0 },
        smooth: { type: "cubicBezier", roundness: 0.55 },
        selfReference: { size: 24, angle: Math.PI / 2 },
      },
      layout: { improvedLayout: false },
      physics: { enabled: false },
      interaction: { hover: true, dragNodes: true, dragView: true, zoomView: false, tooltipDelay: 120 },
    }),
    [palette]
  );

  const events = useMemo(
    () => ({
      click: (params) => {
        onSelectState(params.nodes.length > 0 ? params.nodes[0] : null);
      },
    }),
    [onSelectState]
  );

  const zoomBy = (factor) => {
    const network = networkRef.current;
    if (!network) return;
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, network.getScale() * factor));
    network.moveTo({ scale, animation: { duration: 150 } });
  };

  const fit = () => networkRef.current?.fit({ animation: { duration: 150 } });

  return (
    <>
      <Graph
        key={`${states.length}-${theme}`}
        graph={graph}
        options={options}
        events={events}
        getNetwork={(network) => {
          networkRef.current = network;
          network.once("afterDrawing", () => network.fit({ animation: false }));
        }}
        style={{ height: "100%", width: "100%" }}
      />
      <div className="dfa-controls">
        <button type="button" className="dfa-zoom" onClick={() => zoomBy(1.3)} aria-label="Zoom in">
          <ZoomIcon variant="in" />
        </button>
        <button type="button" className="dfa-zoom" onClick={() => zoomBy(1 / 1.3)} aria-label="Zoom out">
          <ZoomIcon variant="out" />
        </button>
        <button type="button" className="dfa-zoom" onClick={fit} aria-label="Fit to view">
          <FitIcon />
        </button>
      </div>
    </>
  );
}
