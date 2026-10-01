// System diagrams for the Work section, drawn from each repo's README.
// Nodes sit on a 3 × 4 grid (col 0–2, row 0–3; halves allowed). An edge runs
// vertical-then-horizontal by default; "hv" goes horizontal first.

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  route?: "vh" | "hv";
}

export interface Diagram {
  fact: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const diagrams: Record<string, Diagram> = {
  NexusRAG: {
    fact: "Dense and BM25 retrieval, fused with RRF",
    nodes: [
      { id: "src", label: "Sources", sub: "PDF · CSV · web", col: 0, row: 0 },
      { id: "ui", label: "Chat UI", sub: "Next.js · streaming", col: 1, row: 0 },
      { id: "router", label: "Query router", sub: "classify · rewrite", col: 1, row: 1 },
      { id: "dense", label: "Dense", sub: "ChromaDB", col: 0, row: 2 },
      { id: "fusion", label: "RRF fusion", sub: "rank merge", col: 1, row: 2 },
      { id: "sparse", label: "Sparse", sub: "BM25", col: 2, row: 2 },
      { id: "llm", label: "LLM", sub: "context · stream", col: 1, row: 3 },
      { id: "check", label: "Fact check", sub: "faithfulness", col: 2, row: 3 },
    ],
    edges: [
      { from: "src", to: "dense" },
      { from: "ui", to: "router" },
      { from: "router", to: "dense", route: "hv" },
      { from: "router", to: "sparse", route: "hv" },
      { from: "dense", to: "fusion" },
      { from: "sparse", to: "fusion" },
      { from: "fusion", to: "llm" },
      { from: "llm", to: "check" },
    ],
  },
  StreamSense: {
    fact: "5,000+ events a second through Kafka",
    nodes: [
      { id: "prod", label: "Producers", sub: "5k events/s", col: 0, row: 0 },
      { id: "kafka", label: "Kafka", sub: "6 partitions", col: 1, row: 0 },
      { id: "cons", label: "Consumers", sub: "1m · 5m · 15m", col: 2, row: 0 },
      { id: "dlq", label: "Dead letters", sub: "bad events", col: 1, row: 1 },
      { id: "redis", label: "Redis", sub: "hot counters", col: 2, row: 1 },
      { id: "pg", label: "PostgreSQL", sub: "cold history", col: 1, row: 2 },
      { id: "api", label: "FastAPI", sub: "REST", col: 2, row: 2 },
      { id: "dash", label: "Dashboard", sub: "live · 2s poll", col: 2, row: 3 },
    ],
    edges: [
      { from: "prod", to: "kafka" },
      { from: "kafka", to: "cons" },
      { from: "kafka", to: "dlq" },
      { from: "cons", to: "redis" },
      { from: "redis", to: "api" },
      { from: "api", to: "pg" },
      { from: "api", to: "dash" },
    ],
  },
  JobForge: {
    fact: "A task queue built from scratch on Redis Streams",
    nodes: [
      { id: "api", label: "FastAPI", sub: "+ WebSocket", col: 0, row: 0.5 },
      { id: "streams", label: "Streams", sub: "high · normal · low", col: 1, row: 0.5 },
      { id: "workers", label: "Workers", sub: "3 × 4 async", col: 2, row: 0.5 },
      { id: "dash", label: "Dashboard", sub: "React · live", col: 0, row: 1.5 },
      { id: "health", label: "Health", sub: "reclaims stale", col: 1, row: 1.5 },
      { id: "retry", label: "Retries", sub: "backoff ZSET", col: 2, row: 1.5 },
      { id: "dlq", label: "Dead letters", sub: "failed jobs", col: 2, row: 2.5 },
    ],
    edges: [
      { from: "api", to: "streams" },
      { from: "streams", to: "workers" },
      { from: "api", to: "dash" },
      { from: "health", to: "streams" },
      { from: "workers", to: "retry" },
      { from: "retry", to: "dlq" },
    ],
  },
  MLFlowForge: {
    fact: "Fraud models must clear 0.70 AP to ship",
    nodes: [
      { id: "ingest", label: "Ingest", sub: "284k transactions", col: 0, row: 0.5 },
      { id: "validate", label: "Validate", sub: "Great Expectations", col: 1, row: 0.5 },
      { id: "features", label: "Features", sub: "SMOTE · scaling", col: 2, row: 0.5 },
      { id: "registry", label: "Registry", sub: "staging → prod", col: 0, row: 1.5 },
      { id: "gate", label: "Quality gate", sub: "AP ≥ 0.70", col: 1, row: 1.5 },
      { id: "train", label: "Train", sub: "XGBoost · PyTorch", col: 2, row: 1.5 },
      { id: "serve", label: "Serve", sub: "FastAPI", col: 0, row: 2.5 },
      { id: "drift", label: "Drift", sub: "Evidently · PSI", col: 1, row: 2.5 },
      { id: "retrain", label: "Retrain", sub: "on drift", col: 2, row: 2.5 },
    ],
    edges: [
      { from: "ingest", to: "validate" },
      { from: "validate", to: "features" },
      { from: "features", to: "train" },
      { from: "train", to: "gate" },
      { from: "gate", to: "registry" },
      { from: "registry", to: "serve" },
      { from: "serve", to: "drift" },
      { from: "drift", to: "retrain" },
      { from: "retrain", to: "train" },
    ],
  },
  "Multi-Agent Course Builder": {
    fact: "Four agents talking over A2A on Cloud Run",
    nodes: [
      { id: "app", label: "Web app", sub: "progress · results", col: 1, row: 0.5 },
      { id: "orch", label: "Orchestrator", sub: "ADK loop", col: 1, row: 1.5 },
      { id: "research", label: "Researcher", sub: "Google Search", col: 0, row: 2.5 },
      { id: "judge", label: "Judge", sub: "grades research", col: 1, row: 2.5 },
      { id: "builder", label: "Builder", sub: "writes course", col: 2, row: 2.5 },
    ],
    edges: [
      { from: "app", to: "orch" },
      { from: "orch", to: "research", route: "hv" },
      { from: "orch", to: "judge" },
      { from: "orch", to: "builder", route: "hv" },
    ],
  },
  "EduLens AI": {
    fact: "Feedback in under 2 seconds on Llama 3.1",
    nodes: [
      { id: "student", label: "Student", sub: "explains it", col: 0, row: 0.5 },
      { id: "gate", label: "Gatekeeper", sub: "agent", col: 1, row: 0.5 },
      { id: "diag", label: "Diagnostic", sub: "agent", col: 2, row: 0.5 },
      { id: "sm2", label: "Spaced review", sub: "SM-2", col: 0, row: 1.5 },
      { id: "remedy", label: "Remediation", sub: "adaptive", col: 1, row: 1.5 },
      { id: "bloom", label: "Bloom's level", sub: "classifier", col: 2, row: 1.5 },
      { id: "teacher", label: "Teacher view", sub: "live WebSocket", col: 2, row: 2.5 },
    ],
    edges: [
      { from: "student", to: "gate" },
      { from: "gate", to: "diag" },
      { from: "diag", to: "bloom" },
      { from: "bloom", to: "remedy" },
      { from: "remedy", to: "sm2" },
      { from: "bloom", to: "teacher" },
    ],
  },
  "Spend Smart": {
    fact: "Spending charted live as it's logged",
    nodes: [
      { id: "ui", label: "React app", sub: "TypeScript", col: 0, row: 1.5 },
      { id: "auth", label: "Firebase", sub: "auth · data", col: 1, row: 1.5 },
      { id: "budget", label: "Budgets", sub: "by category", col: 2, row: 1 },
      { id: "charts", label: "Charts", sub: "spending trends", col: 2, row: 2 },
    ],
    edges: [
      { from: "ui", to: "auth" },
      { from: "auth", to: "budget", route: "hv" },
      { from: "auth", to: "charts", route: "hv" },
    ],
  },
  "Fake Review Detection": {
    fact: "0.805 AUC on businesses it never saw",
    nodes: [
      { id: "text", label: "Review text", sub: "Yelp", col: 0, row: 1 },
      { id: "sem", label: "Transformer", sub: "semantics", col: 1, row: 1 },
      { id: "user", label: "Reviewer", sub: "history", col: 0, row: 2 },
      { id: "beh", label: "Behavior", sub: "features", col: 1, row: 2 },
      { id: "fusion", label: "ReviewGuard", sub: "fusion", col: 2, row: 1.5 },
    ],
    edges: [
      { from: "text", to: "sem" },
      { from: "user", to: "beh" },
      { from: "sem", to: "fusion", route: "hv" },
      { from: "beh", to: "fusion", route: "hv" },
    ],
  },
};
