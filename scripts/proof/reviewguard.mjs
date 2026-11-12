// Writes src/data/proof/reviewguard.json: the scores behind ReviewGuard's
// case study, taken from the metrics files in the project's own repo at one
// commit. The site never types a result by hand, as the repo's paper tables
// aren't typed either (its src/make_tables.py reads the same files).
//
//   node scripts/proof/reviewguard.mjs [commit]
//
// Every score is a five-fold mean with its folds, rounded to three places
// as the repo's tables print them.
import fs from "node:fs";
import path from "node:path";

const REPO = "RohanMukka/Combining-Transformer-Semantics-and-Reviewer-Behavior-for-Fake-Review-Detection-on-Yelp";
const COMMIT = process.argv[2] ?? "b76e328d44134de8c171c8c27b20f863653fb5c9";
const OUT = path.resolve("src/data/proof/reviewguard.json");

const get = async (file) => {
  const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${COMMIT}/results/metrics/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  // Python's json module writes NaN for a metric a model doesn't have.
  return JSON.parse((await res.text()).replace(/\bNaN\b/g, "null"));
};

const r3 = (x) => (typeof x === "number" && Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null);
const score = (m) => ({ mean: r3(m.mean), sd: r3(m.std), folds: m.folds.map(r3) });

const summarize = (summary, models) =>
  Object.fromEntries(
    models.map((name) => {
      const m = summary[name];
      if (!m) throw new Error(`missing model ${name}`);
      return [
        name,
        {
          auc: score(m.auc_roc),
          ap: m.average_precision ? score(m.average_precision) : null,
          f1: m.macro_f1 ? score(m.macro_f1) : null,
          recall: m.recall_fake ? score(m.recall_fake) : null,
        },
      ];
    }),
  );

const MODELS = ["TF-IDF + LinearSVM", "TF-IDF + LogReg", "Behavior + LogReg", "Behavior + RandomForest", "Text-only MLP", "Behavior-only MLP", "ReviewGuard (Fusion)"];
const SPLITS = { business: "product", reviewer: "user" };

const runs = {};
for (const [split, key] of Object.entries(SPLITS)) {
  const inductive = await get(`real_yelpchi_results_by_${key}.json`);
  const transductive = await get(`real_yelpchi_results_by_${key}_transductive.json`);
  const gnn = await get(`gnn_results_by_${key}.json`);
  const degree = await get(`degree_control_by_${key}.json`);
  runs[split] = {
    inductive: {
      ...summarize(inductive.summary, MODELS),
      ...summarize(gnn.summary, ["Relation GNN"]),
      ...summarize(degree.summary, ["Behavior MLP + graph degree", "R-S-R degree alone"]),
    },
    transductive: summarize(transductive.summary, MODELS),
  };
}

const audit = await get("data_integrity_audit.json");
const data = {
  repo: `https://github.com/${REPO}`,
  commit: COMMIT,
  runs,
  audit: {
    timestampAuc: r3(audit.timestamps.auc_from_timestamp_alone),
    timestampSpanDays: audit.timestamps.span_days,
    timestampDistinctSeconds: audit.timestamps.distinct_seconds_values,
    fakeRateAuc: r3(audit.business_identity.auc_of_product_fake_rate_as_predictor),
    businesses: audit.business_identity.n_products,
    businessesWithNoFakes: audit.business_identity.products_with_zero_fakes,
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data) + "\n");
console.log(`wrote ${path.relative(process.cwd(), OUT)} (${fs.statSync(OUT).size} bytes) from ${COMMIT.slice(0, 7)}`);
