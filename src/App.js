import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { analyzeGrammar, parseSentence } from "./lib";
import AppHeader from "./components/AppHeader";
import ProgressRail from "./components/ProgressRail";
import GrammarStage from "./components/GrammarStage";
import ResultStages from "./components/ResultStages";
import StepsCallout from "./components/StepsCallout";
import LearnBar from "./components/LearnBar";
import LegalPage from "./components/LegalPage";
import AppFooter from "./components/AppFooter";
import "./App.css";

const DEFAULT_GRAMMAR = "S\nS->A\nA->(AB)\nA->()\nB->(A)\nB->()";
const VIEW_PATHS = { learn: "/steps", terms: "/terms", privacy: "/privacy" };
const PATH_VIEWS = { "/steps": "learn", "/terms": "terms", "/privacy": "privacy" };
const VIEW_TITLES = {
  quick: "LR(0) Parser: Visualize LR(0) parsing step by step",
  learn: "Step-by-step LR(0) walkthrough · LR(0) Parser",
  terms: "Terms & Conditions · LR(0) Parser",
  privacy: "Privacy Policy · LR(0) Parser",
};
const SECTION_IDS = ["grammar", "augment", "items", "dfa", "table", "parse"];
const QUICK_STEPS = [
  { id: "grammar", label: "Grammar" },
  { id: "augment", label: "Augment" },
  { id: "items", label: "Item sets" },
  { id: "dfa", label: "DFA" },
  { id: "table", label: "Table" },
  { id: "parse", label: "Parse" },
];
const LEARN_STEPS = QUICK_STEPS.slice(1);

function pathToView(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PATH_VIEWS[clean] || "quick";
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = element.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

export default function App() {
  const [grammarText, setGrammarText] = useState(DEFAULT_GRAMMAR);
  const [result, setResult] = useState(null);
  const [sentence, setSentence] = useState("");
  const [parseResult, setParseResult] = useState(null);
  const [view, setView] = useState(() => pathToView(window.location.pathname));
  const [activeSection, setActiveSection] = useState("grammar");
  const [generateTick, setGenerateTick] = useState(0);
  const pendingScroll = useRef(false);
  const pendingScrollTop = useRef(false);

  const showResults = result !== null && result.grammar.errors.length === 0 && result.table !== null;
  const grammarErrors = result?.grammar.errors ?? [];

  const learnFallback = useMemo(
    () => (view === "learn" && !result?.table ? analyzeGrammar(grammarText) : null),
    [view, result, grammarText]
  );
  const learnResult = result?.table ? result : learnFallback;
  const learnReady = view === "learn" && learnResult?.table != null;

  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-K3WB5RH" });
  }, []);

  useEffect(() => {
    const onPopState = () => setView(pathToView(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((nextView) => {
    const path = VIEW_PATHS[nextView] || "/";
    if (window.location.pathname !== path) window.history.pushState(null, "", path);
    pendingScrollTop.current = true;
    setView(nextView);
  }, []);

  useLayoutEffect(() => {
    if (!pendingScrollTop.current) return;
    pendingScrollTop.current = false;
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    document.title = VIEW_TITLES[view] || VIEW_TITLES.quick;
  }, [view]);

  const generate = useCallback(() => {
    setResult(analyzeGrammar(grammarText));
    setParseResult(null);
    pendingScroll.current = true;
    setGenerateTick((tick) => tick + 1);
  }, [grammarText]);

  const resetGrammar = useCallback(() => {
    setGrammarText(DEFAULT_GRAMMAR);
    setResult(null);
    setParseResult(null);
  }, []);

  const runParse = useCallback(() => {
    const active = result?.table ? result : learnResult;
    if (!active?.table) return;
    setParseResult(parseSentence(sentence, active.grammar, active.table.rows));
  }, [result, learnResult, sentence]);

  useEffect(() => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    scrollToSection(showResults ? "augment" : "grammar");
  }, [generateTick, showResults]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [view, showResults, learnReady]);

  const isLegal = view === "terms" || view === "privacy";

  return (
    <div className="app">
      <AppHeader onHome={() => navigate("quick")} />

      {isLegal ? (
        <LegalPage type={view} onHome={() => navigate("quick")} />
      ) : view === "learn" ? (
        <>
          <LearnBar onBack={() => navigate("quick")} />
          {learnReady && <ProgressRail active={activeSection} steps={LEARN_STEPS} />}
          <main className="app-main">
            {learnReady ? (
              <ResultStages
                result={learnResult}
                mode="learn"
                showExplanations
                sentence={sentence}
                onSentenceChange={setSentence}
                onParse={runParse}
                parseResult={parseResult}
                stepOffset={-1}
              />
            ) : (
              <div className="callout callout-error" role="alert" style={{ marginTop: 32 }}>
                <strong>Generate a table first.</strong>
                <p>
                  Head back to the main view, enter a grammar, and choose “Show step-by-step explanation”.
                </p>
              </div>
            )}
          </main>
        </>
      ) : (
        <>
          {showResults && <ProgressRail active={activeSection} steps={QUICK_STEPS} />}
          <main className="app-main">
            <GrammarStage
              value={grammarText}
              onChange={setGrammarText}
              onGenerate={generate}
              onReset={resetGrammar}
              errors={grammarErrors}
            />

            {showResults && (
              <>
                <StepsCallout onOpen={() => navigate("learn")} />
                <ResultStages
                  result={result}
                  mode="quick"
                  showExplanations={false}
                  sentence={sentence}
                  onSentenceChange={setSentence}
                  onParse={runParse}
                  parseResult={parseResult}
                />
              </>
            )}
          </main>
        </>
      )}

      <AppFooter onNavigate={navigate} />
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
