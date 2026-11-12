import React, { useEffect, useId, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import data from "../../../data/proof/reviewguard.json";
import { EASE, Label, pad, Rise } from "../shared";

// ReviewGuard's results, for a visitor to work through: pick what the model
// sees, how it's tested and where its business profiles come from, and the
// score moves to what the repo measured for exactly that. Every number comes
// from src/data/proof/reviewguard.json, which scripts/proof/reviewguard.mjs
// writes from the repo's own metrics files; a setup the repo never ran says
// so rather than showing a guess.

type Input = "text" | "behavior" | "graph" | "timestamp" | "fakeRate";
type Split = "reviewer" | "business";
type Profiles = "inductive" | "transductive";
type Score = { mean: number; sd: number; folds: number[] };
type Row = { auc: Score; ap: Score | null; f1: Score | null; recall: Score | null };
type Setup = { inputs: Input[]; split: Split; profiles: Profiles };

const runs = data.runs as Record<Split, Record<Profiles, Record<string, Row>>>;
const { audit } = data;
const row = (split: Split, profiles: Profiles, model: string): Row | undefined => runs[split][profiles][model];
const auc = (split: Split, profiles: Profiles, model: string) => row(split, profiles, model)!.auc.mean;
const f3 = (n: number) => n.toFixed(3);
const source = (file: string) => `${data.repo}/blob/${data.commit}/results/metrics/${file}`;

const INPUTS: { id: Input; label: string; leak?: boolean }[] = [
  { id: "text", label: "Review text" },
  { id: "behavior", label: "Reviewer and business behavior" },
  { id: "graph", label: "Graph edges" },
  { id: "timestamp", label: "Timestamp", leak: true },
  { id: "fakeRate", label: "Business fake rate", leak: true },
];
const LEAKS = new Set<Input>(["timestamp", "fakeRate"]);

const SPLITS: { id: Split; label: string; hint: string }[] = [
  { id: "reviewer", label: "Reviewer-disjoint", hint: "a business can be in training and test" },
  { id: "business", label: "Business-disjoint", hint: "test businesses are never seen in training" },
];
const PROFILES: { id: Profiles; label: string; hint: string }[] = [
  { id: "inductive", label: "Training rows only", hint: "the strict, usual way" },
  { id: "transductive", label: "Every review, no labels", hint: "what a platform has for a new listing" },
];

// The model the repo trained on each set of inputs.
const MODEL: Record<string, string> = {
  text: "Text-only MLP",
  behavior: "Behavior-only MLP",
  "behavior+text": "ReviewGuard (Fusion)",
  "behavior+graph": "Relation GNN",
  graph: "R-S-R degree alone",
};

type Result =
  | { kind: "score"; model: string; score: Score; other?: number; leak?: false }
  | { kind: "leak"; model: string; value: number; how: string; leak: true }
  | { kind: "none"; why: string };

const resolve = ({ inputs, split, profiles }: Setup): Result => {
  if (inputs.includes("timestamp")) return { kind: "leak", leak: true, model: "A random forest on the raw timestamp", value: audit.timestampAuc, how: "scored by the data audit on one random 80/20 split" };
  if (inputs.includes("fakeRate")) return { kind: "leak", leak: true, model: "The business's fake rate, used as the score", value: audit.fakeRateAuc, how: "scored by the data audit against every review's label" };
  if (!inputs.length) return { kind: "none", why: "Pick at least one input." };
  const model = MODEL[[...inputs].sort().join("+")];
  if (!model) return { kind: "none", why: "Not run: the graph model was given the behavior features, never the text." };
  const found = row(split, profiles, model);
  if (!found) return { kind: "none", why: "Not run: the graph models were only run with profiles from training rows." };
  const other = row(split === "business" ? "reviewer" : "business", profiles, model);
  return { kind: "score", model, score: found.auc, other: other?.auc.mean };
};

// Folds on which `a` scores below `b`, same split and profiles.
const foldsBelow = (a: string, b: string, split: Split, profiles: Profiles) => {
  const x = row(split, profiles, a)!.auc.folds;
  const y = row(split, profiles, b)!.auc.folds;
  return x.filter((v, i) => v < y[i]).length;
};

// The story, in six setups. Each caption is what that setup shows, with the
// numbers read from the data.
const STORIES: { title: string; setup: Setup; caption: string }[] = [
  {
    title: "The usual split",
    setup: { inputs: ["behavior"], split: "reviewer", profiles: "inductive" },
    caption: "No reviewer is in both training and test, but a business can be. Behavior alone looks strong.",
  },
  {
    title: "Unseen businesses",
    setup: { inputs: ["behavior"], split: "business", profiles: "inductive" },
    caption: `Now no business is on both sides, and the score falls by ${f3(auc("reviewer", "inductive", "Behavior-only MLP") - auc("business", "inductive", "Behavior-only MLP"))}. It looks as if the model had only learned which businesses get faked.`,
  },
  {
    title: "Profiles a platform has",
    setup: { inputs: ["behavior"], split: "business", profiles: "transductive" },
    caption: `Business profiles built from every review, labels never touched. The split now costs ${f3(auc("reviewer", "transductive", "Behavior-only MLP") - auc("business", "transductive", "Behavior-only MLP"))}, not ${f3(auc("reviewer", "inductive", "Behavior-only MLP") - auc("business", "inductive", "Behavior-only MLP"))}: most of the fall was information withheld, not leakage.`,
  },
  {
    title: "Add the text",
    setup: { inputs: ["behavior", "text"], split: "business", profiles: "transductive" },
    caption: `The fusion model scores below behavior alone (${f3(auc("business", "transductive", "Behavior-only MLP"))}) on ${foldsBelow("ReviewGuard (Fusion)", "Behavior-only MLP", "business", "transductive")} of 5 folds. Reported as a loss.`,
  },
  {
    title: "Add the graph",
    setup: { inputs: ["behavior", "graph"], split: "business", profiles: "inductive" },
    caption: `${f3(auc("business", "inductive", "Behavior-only MLP"))} without the graph. A plain MLP given only two degree counts reaches ${f3(auc("business", "inductive", "Behavior MLP + graph degree"))}: most of the gain is a count the split meant to hide.`,
  },
  {
    title: "The timestamp",
    setup: { inputs: ["timestamp"], split: "business", profiles: "inductive" },
    caption: `Too good. The data spans ${audit.timestampSpanDays} days and every timestamp has the same seconds value: the times were generated from the label. Dropped from every experiment.`,
  },
];

const FAKE_RATE_CAPTION = `The share of a business's reviews that are fake. It's computed from the labels, so it can never be an input: ${audit.businessesWithNoFakes} of ${audit.businesses.toLocaleString("en-US")} businesses have none at all.`;

const same = (a: Setup, b: Setup) =>
  a.split === b.split && a.profiles === b.profiles && a.inputs.length === b.inputs.length && a.inputs.every((i) => b.inputs.includes(i));

// Where an AUC sits on the scale, which runs from a coin flip to perfect.
const at = (v: number) => `${Math.max(0, Math.min(1, (v - 0.5) / 0.5)) * 100}%`;

type ToggleProps = { on: boolean; disabled?: boolean; leak?: boolean; onClick: () => void; children: React.ReactNode };

const Toggle: React.FC<ToggleProps> = ({ on, disabled, leak, onClick, children }) => (
  <button
    type="button"
    aria-pressed={on}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
      on
        ? leak
          ? "border-leak bg-leak text-background"
          : "border-primary-text bg-primary-text text-background"
        : "border-primary-text/20 text-primary-text enabled:hover:border-primary-text/60"
    }`}
  >
    {children}
  </button>
);

const Group = ({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) => {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
      {note && <p className="mt-3 text-xs text-primary-secondary">{note}</p>}
    </div>
  );
};

// The AUC, counting to its new value.
const Count = ({ value }: { value: number }) => {
  const mv = useMotionValue(value);
  const text = useTransform(mv, f3);
  useEffect(() => {
    const run = animate(mv, value, { duration: 0.7, ease: EASE });
    return () => run.stop();
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
};

// A marker positioned along the scale with a transform, not `left`, so it
// slides without a layout per frame: the layer spans the whole track and
// moves by a share of its own width.
type AlongProps = { value: number; className?: string; children: React.ReactNode };

const Along: React.FC<AlongProps> = ({ value, className = "", children }) => (
  <span
    className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
    style={{ transform: `translateX(${at(value)})` }}
    aria-hidden="true"
  >
    {children}
  </span>
);

const Readout = ({ result, setup, caption }: { result: Result; setup: Setup; caption: string }) => {
  const value = result.kind === "score" ? result.score.mean : result.kind === "leak" ? result.value : null;
  const tone = result.kind === "leak" ? "text-leak" : "text-primary-text";
  const fill = result.kind === "leak" ? "bg-leak" : "bg-accent";
  const otherSplit = setup.split === "business" ? "reviewer-disjoint" : "business-disjoint";
  const spoken =
    result.kind === "none" ? result.why : `AUC ${f3(value!)}, ${result.model}${result.kind === "leak" ? ", a leak" : ""}.`;

  return (
    // On phones it comes first, right under the stories, so a tap shows its
    // result without scrolling.
    <div className="glass-card order-first md:order-none rounded-3xl p-6 md:p-8 [overflow-x:clip]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary">
          {result.kind === "none" ? "No result" : result.model}
        </p>
        {result.kind === "leak" && (
          <span className="shrink-0 rounded-full border border-leak px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-leak">
            Leak
          </span>
        )}
      </div>

      <p className={`mt-4 font-display font-bold text-6xl md:text-7xl tracking-[-0.04em] tabular-nums transition-colors duration-500 ${value === null ? "text-primary-tertiary" : tone}`}>
        {value === null ? "—" : <Count value={value} />}
      </p>
      <p className="mt-1 text-xs text-primary-secondary">
        AUC-ROC{result.kind === "score" && ` · five-fold mean ± ${f3(result.score.sd)}`}
        {result.kind === "leak" && ` · ${result.how}`}
      </p>

      {/* The scale: a coin flip at the left, perfect at the right. */}
      <div className="relative mt-10 mb-8 h-2 rounded-full bg-primary-text/10">
        <span
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${fill}`}
          style={{ transform: `scaleX(${value === null ? 0 : (value - 0.5) / 0.5})` }}
          aria-hidden="true"
        />
        {result.kind === "score" &&
          result.score.folds.map((fold, i) => (
            <Along key={i} value={fold}>
              <span className="absolute -top-4 left-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-primary-text/70" />
            </Along>
          ))}
        {result.kind === "score" && result.other !== undefined && (
          <Along value={result.other}>
            <span className="absolute top-1/2 left-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-text bg-background" />
          </Along>
        )}
        <span className="absolute -bottom-6 left-0 text-[10px] tabular-nums text-primary-tertiary" aria-hidden="true">
          0.5 coin flip
        </span>
        <span className="absolute -bottom-6 right-0 text-[10px] tabular-nums text-primary-tertiary" aria-hidden="true">
          1.0 perfect
        </span>
      </div>

      {result.kind === "score" && (
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-primary-secondary" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-0.5 rounded-full bg-primary-text/70" /> each fold
          </span>
          {result.other !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-primary-text" /> same inputs, {otherSplit}: {f3(result.other)}
            </span>
          )}
        </p>
      )}

      <p className="mt-6 min-h-[4.5rem] text-base leading-relaxed text-primary-text">{caption}</p>
      <p className="sr-only" aria-live="polite">
        {spoken}
      </p>
    </div>
  );
};

const COLUMNS: { key: keyof Omit<Row, "auc"> | "auc"; label: string }[] = [
  { key: "auc", label: "AUC-ROC" },
  { key: "ap", label: "Avg. precision" },
  { key: "f1", label: "Macro-F1" },
  { key: "recall", label: "Recall (fake)" },
];
const TABLE_MODELS = ["TF-IDF + LinearSVM", "TF-IDF + LogReg", "Behavior + LogReg", "Behavior + RandomForest", "Text-only MLP", "Behavior-only MLP", "ReviewGuard (Fusion)"];

const Results = ({ split, profiles, highlight }: { split: Split; profiles: Profiles; highlight?: string }) => {
  const rows = TABLE_MODELS.map((m) => [m, row(split, profiles, m)!] as const);
  const best = Object.fromEntries(COLUMNS.map(({ key }) => [key, Math.max(...rows.map(([, r]) => r[key]?.mean ?? -1))]));
  const file = `real_yelpchi_results_by_${split === "business" ? "product" : "user"}${profiles === "transductive" ? "_transductive" : ""}.json`;
  return (
    <figure className="mt-16 md:mt-20">
      <figcaption className="mb-6 max-w-3xl text-sm leading-relaxed text-primary-secondary">
        <span className="font-semibold text-primary-text">
          All seven models, {SPLITS.find((s) => s.id === split)!.label.toLowerCase()}, profiles from{" "}
          {profiles === "inductive" ? "training rows only" : "every review"}.
        </span>{" "}
        Five folds, mean ± s.d. Every model's threshold is tuned on a held-out validation slice for Macro-F1. It follows the split and
        profiles chosen above.
      </figcaption>
      {/* Focusable, so a keyboard can scroll it sideways on a phone. */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Results for all seven models"
        className="overflow-x-auto overscroll-x-contain rounded-2xl border border-primary-text/10 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <table className="w-full min-w-[40rem] text-left text-sm tabular-nums">
          <thead>
            <tr className="border-b border-primary-text/10 text-xs uppercase tracking-[0.15em] text-primary-secondary">
              <th scope="col" className="px-5 py-4 font-bold">
                Model
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" className="px-5 py-4 font-bold text-right">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([model, r]) => (
              <tr
                key={model}
                className={`border-b border-primary-text/5 last:border-0 transition-colors duration-300 ${model === highlight ? "bg-accent/10" : ""}`}
              >
                <th scope="row" className="px-5 py-3.5 font-semibold text-primary-text whitespace-nowrap">
                  {model}
                </th>
                {COLUMNS.map(({ key }) => {
                  const s = r[key];
                  const top = s && s.mean === best[key];
                  return (
                    <td key={key} className={`px-5 py-3.5 text-right whitespace-nowrap ${top ? "font-bold text-primary-text" : "text-primary-secondary"}`}>
                      {s ? (
                        <>
                          {f3(s.mean)} <span className="text-xs text-primary-tertiary">± {f3(s.sd)}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        href={source(file)}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-secondary hover:text-accent transition-colors"
      >
        Source: results/metrics/{file}
        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
      </a>
    </figure>
  );
};

const ReviewGuardProof = () => {
  const [setup, setSetup] = useState<Setup>(STORIES[0].setup);
  const result = resolve(setup);
  const story = STORIES.findIndex((s) => same(s.setup, setup));
  const leaking = result.kind === "leak";

  const caption =
    story >= 0
      ? STORIES[story].caption
      : result.kind === "none"
        ? result.why
        : result.kind === "leak"
          ? setup.inputs.includes("fakeRate")
            ? FAKE_RATE_CAPTION
            : STORIES[5].caption
          : setup.inputs.length === 1 && setup.inputs[0] === "text"
            ? "Text uses no business profiles, so it scores exactly the same either way; the repo's checks assert that."
            : `${result.model}. Flip the split or the profiles to see what each one costs.`;

  // Leaks were only ever scored on their own: turning one on clears the
  // rest, and turning anything else on clears the leak.
  const toggle = (id: Input) =>
    setSetup((s) => {
      if (LEAKS.has(id)) return { ...s, inputs: s.inputs.includes(id) ? [] : [id] };
      const inputs = s.inputs.filter((i) => !LEAKS.has(i));
      return { ...s, inputs: inputs.includes(id) ? inputs.filter((i) => i !== id) : [...inputs, id] };
    });

  return (
    <section className="pt-20 md:pt-32" aria-labelledby="reviewguard-results">
      <Rise>
        <Label>Results</Label>
      </Rise>
      <Rise delay={0.05}>
        <h2 id="reviewguard-results" className="max-w-4xl font-display font-bold text-4xl md:text-6xl tracking-[-0.04em] leading-[0.95] text-primary-text">
          Find the leaks yourself.
        </h2>
        <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-primary-secondary">
          Choose what the model sees and how it's tested. Each score is what the repo measured for exactly that setup, with every fold
          marked; a setup it never ran says so instead of guessing.
        </p>
      </Rise>

      <Rise delay={0.1}>
        <ol className="mt-12 flex flex-wrap gap-2" aria-label="Walk through the results">
          {STORIES.map((s, i) => (
            <li key={s.title}>
              <button
                type="button"
                aria-pressed={story === i}
                onClick={() => setSetup(s.setup)}
                className={`inline-flex items-baseline gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  story === i ? "bg-primary-text text-background" : "bg-surface-subtle text-primary-text hover:bg-primary-text/10"
                }`}
              >
                <span className="text-[10px] tabular-nums tracking-widest opacity-70">{pad(i + 1)}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </Rise>

      <Rise delay={0.15} className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12">
        <div className="flex flex-col gap-8">
          <Group label="What the model sees" note="Leaks were only ever scored on their own.">
            {INPUTS.map((input) => (
              <Toggle key={input.id} on={setup.inputs.includes(input.id)} leak={input.leak} onClick={() => toggle(input.id)}>
                {input.label}
                {input.leak && <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-70">leak</span>}
              </Toggle>
            ))}
          </Group>
          <Group label="How it's tested" note={leaking ? "Neither split: the leaks were scored once, by the data audit." : SPLITS.find((s) => s.id === setup.split)!.hint}>
            {SPLITS.map((s) => (
              <Toggle key={s.id} on={setup.split === s.id} disabled={leaking} onClick={() => setSetup((x) => ({ ...x, split: s.id }))}>
                {s.label}
              </Toggle>
            ))}
          </Group>
          <Group
            label="Business profiles built from"
            note={leaking ? "No profiles: the leak is the whole input." : PROFILES.find((p) => p.id === setup.profiles)!.hint}
          >
            {PROFILES.map((p) => (
              <Toggle key={p.id} on={setup.profiles === p.id} disabled={leaking} onClick={() => setSetup((x) => ({ ...x, profiles: p.id }))}>
                {p.label}
              </Toggle>
            ))}
          </Group>
        </div>
        <Readout result={result} setup={setup} caption={caption} />
      </Rise>

      <Rise delay={0.05}>
        <Results split={setup.split} profiles={setup.profiles} highlight={result.kind === "score" ? result.model : undefined} />
      </Rise>
    </section>
  );
};

export default ReviewGuardProof;
