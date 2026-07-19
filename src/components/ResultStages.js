import AugmentStage from "./AugmentStage";
import ItemSetsStage from "./ItemSetsStage";
import DfaStage from "./DfaStage";
import TableStage from "./TableStage";
import ParseStage from "./ParseStage";

export default function ResultStages({
  result,
  mode,
  showExplanations,
  sentence,
  onSentenceChange,
  onParse,
  parseResult,
  stepOffset = 0,
}) {
  return (
    <>
      <AugmentStage grammar={result.grammar} showExplanations={showExplanations} index={2 + stepOffset} />
      <ItemSetsStage
        grammar={result.grammar}
        states={result.states}
        transitions={result.transitions}
        mode={mode}
        showExplanations={showExplanations}
        index={3 + stepOffset}
      />
      <DfaStage
        grammar={result.grammar}
        states={result.states}
        transitions={result.transitions}
        table={result.table}
        showExplanations={showExplanations}
        index={4 + stepOffset}
      />
      <TableStage
        grammar={result.grammar}
        table={result.table}
        showExplanations={showExplanations}
        index={5 + stepOffset}
      />
      <ParseStage
        grammar={result.grammar}
        table={result.table}
        sentence={sentence}
        onSentenceChange={onSentenceChange}
        onParse={onParse}
        result={parseResult}
        mode={mode}
        showExplanations={showExplanations}
        index={6 + stepOffset}
      />
    </>
  );
}
