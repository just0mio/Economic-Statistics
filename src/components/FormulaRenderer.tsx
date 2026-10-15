import katex from "katex";
export default function FormulaRenderer({ formula }: { formula: string }) {
  return (
    <div
      className="formula"
      role="math"
      aria-label={formula}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          trust: false,
          output: "htmlAndMathml",
        }),
      }}
    />
  );
}
