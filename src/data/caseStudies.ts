// Case study pages for the featured projects, keyed by project title. Every
// claim and number comes from that project's README.

export interface CaseStudy {
  slug: string;
  summary: string;
  numbers: { value: string; label: string }[];
  decisions: { title: string; body: string }[];
  stack: string[];
}

export const caseStudies: Record<string, CaseStudy> = {
  NexusRAG: {
    slug: "nexusrag",
    summary:
      "A retrieval-augmented generation system that ingests PDFs, CSVs and web pages, finds context with hybrid dense and keyword search, streams grounded answers, and checks every answer for faithfulness to its sources.",
    numbers: [
      { value: "15–20%", label: "better recall on keyword-heavy queries from RRF fusion" },
      { value: "<50 ms", label: "added by keeping a parallel BM25 index" },
      { value: "5 turns", label: "of conversation memory for follow-up questions" },
    ],
    decisions: [
      {
        title: "Hybrid retrieval over dense-only",
        body: "Dense search misses exact keywords and BM25 misses meaning. Reciprocal Rank Fusion merges both rankings, so neither blind spot wins.",
      },
      {
        title: "ChromaDB over FAISS",
        body: "It persists to disk, filters on metadata and runs as a library with no separate server. FAISS needs manual serialization and has no metadata.",
      },
      {
        title: "A rule-based query router",
        body: "Queries are classified as semantic, structured, conversational or follow-up without an LLM call: fast, deterministic and easy to debug.",
      },
    ],
    stack: ["GPT-4o-mini", "OpenAI embeddings", "ChromaDB", "BM25", "FastAPI", "Next.js 14", "Docker Compose"],
  },
  StreamSense: {
    slug: "streamsense",
    summary:
      "A real-time pipeline that pushes e-commerce clickstream events through Kafka, aggregates them in rolling windows and serves a live dashboard, built to exercise consumer-group failover, partitioning, backpressure and dead-letter queues.",
    numbers: [
      { value: "5,000+", label: "events per second ingested" },
      { value: "6", label: "Kafka partitions shared by a consumer group" },
      { value: "~40%", label: "smaller messages with LZ4 compression" },
    ],
    decisions: [
      {
        title: "At-least-once delivery",
        body: "Simpler than exactly-once, and safe here: the aggregations are counters, so a duplicate event changes nothing that matters.",
      },
      {
        title: "A hot path and a cold path",
        body: "Redis answers the dashboard's 2-second polls in under a millisecond, with keys that expire at twice the window. PostgreSQL keeps the history.",
      },
      {
        title: "Failures go to a dead-letter queue",
        body: "Malformed events are routed to their own topic for inspection instead of crashing the pipeline, and a second consumer takes over if one dies.",
      },
    ],
    stack: ["Apache Kafka", "Python", "Redis 7", "PostgreSQL 16", "FastAPI", "Next.js 14", "Recharts", "Docker Compose"],
  },
  JobForge: {
    slug: "jobforge",
    summary:
      "A fully async distributed task queue built from scratch on Redis 7 Streams, with priority queues, exponential-backoff retries, a dead-letter queue, job dependencies, per-type rate limits, a live dashboard and a chaos mode for testing recovery.",
    numbers: [
      { value: "3 × 4", label: "async workers, four jobs in flight each" },
      { value: "O(log N)", label: "to find due retries, whatever the queue size" },
      { value: "0", label: "distributed locks needed to avoid double-processing" },
    ],
    decisions: [
      {
        title: "Consumer groups instead of locks",
        body: "XREADGROUP claims a job atomically for one worker, and stale jobs from a dead worker are reclaimed with XAUTOCLAIM.",
      },
      {
        title: "One stream per priority",
        body: "The high-priority stream is always read first, so urgent work never waits behind a backlog of low-priority jobs.",
      },
      {
        title: "Retries live in a sorted set",
        body: "A separate scheduler owns backoff delays, so workers never sleep, and ZRANGEBYSCORE finds the jobs that are due.",
      },
    ],
    stack: ["Python asyncio", "Redis 7 Streams", "FastAPI", "WebSocket", "React", "pytest", "Docker Compose"],
  },
  MLFlowForge: {
    slug: "mlflowforge",
    summary:
      "An end-to-end MLOps pipeline for credit-card fraud detection: validated ingest, feature engineering, XGBoost and PyTorch training, a model registry with a quality gate, FastAPI serving, drift monitoring and automatic retraining, all orchestrated by Airflow.",
    numbers: [
      { value: "284k", label: "transactions in the training data" },
      { value: "AP ≥ 0.70", label: "required before a model reaches production" },
      { value: "3", label: "drift signals: Wasserstein, PSI and drifted-column share" },
    ],
    decisions: [
      {
        title: "SMOTE on the training split only",
        body: "Oversampling the rare fraud class before the split would leak synthetic rows into evaluation and flatter the model.",
      },
      {
        title: "A quality gate on the registry",
        body: "A model is promoted only if it clears 0.70 average precision on the test set, and the previous production version is archived automatically.",
      },
      {
        title: "Drift triggers retraining",
        body: "Evidently, Wasserstein distance and PSI watch incoming data; crossing a threshold starts a retrain instead of waiting for someone to notice.",
      },
    ],
    stack: ["Airflow", "MLflow", "XGBoost", "PyTorch", "Evidently", "SHAP", "FastAPI", "GitHub Actions"],
  },
  "Multi-Agent Course Builder": {
    slug: "course-builder",
    summary:
      "A team of AI agents that research a topic, judge the research and write a course from it. Each agent runs as its own microservice, and they talk over Google's Agent-to-Agent (A2A) protocol.",
    numbers: [
      { value: "4", label: "agents, each deployed as its own Cloud Run service" },
      { value: "A2A", label: "protocol between agents, found through agent cards" },
    ],
    decisions: [
      {
        title: "One service per agent",
        body: "The researcher, judge and builder deploy and scale on their own; the orchestrator reaches each one as a remote A2A agent.",
      },
      {
        title: "A judge before the builder",
        body: "The orchestrator runs research and judging in an ADK loop, then hands the result to the builder in sequence.",
      },
      {
        title: "Authenticated calls between services",
        body: "A shared httpx client signs service-to-service requests on Cloud Run, and agent card URLs are rewritten for the deployed hosts.",
      },
    ],
    stack: ["Google ADK", "A2A", "Python", "Google Search", "Cloud Run"],
  },
  "EduLens AI": {
    slug: "edulens",
    summary:
      "An adaptive learning platform where students explain a concept in their own words instead of picking an answer. An agent pipeline diagnoses misconceptions, grades the explanation on Bloom's taxonomy, adapts the next question and schedules review with SM-2.",
    numbers: [
      { value: "83.3%", label: "misconception diagnosis accuracy against human grading" },
      { value: "6 × 4", label: "misconception types and Bloom's levels scored" },
      { value: "3.2 s", label: "average feedback latency on Llama 3.1 8B" },
    ],
    decisions: [
      {
        title: "Explain first, not multiple choice",
        body: "Picking an answer tests recognition. Explaining it tests recall and synthesis, which is what the platform is built to measure.",
      },
      {
        title: "A gatekeeper agent goes first",
        body: "Plagiarized or off-topic answers are caught before they reach the diagnostic agent or the gradebook.",
      },
      {
        title: "A live classroom over WebSockets",
        body: "Teachers see each response and its Bloom's level as students type, not after the assignment closes.",
      },
    ],
    stack: ["React 18", "TypeScript", "Groq · Llama 3.1", "WebSockets", "PostgreSQL", "Drizzle ORM"],
  },
  "Fake Review Detection": {
    slug: "reviewguard",
    summary:
      "A two-branch fake review detector for YelpCHI, and an audit of how much of the performance usually reported on that benchmark is real.",
    numbers: [
      { value: "0.805", label: "AUC on businesses never seen in training" },
      { value: "0.951", label: "AUC from a business's fake rate alone: the leak it exposes" },
      { value: "0.965", label: "AUC from the raw timestamp alone, so dates were dropped" },
    ],
    decisions: [
      {
        title: "Evaluate on two axes, not one",
        body: "Every model is scored by split (business- or reviewer-disjoint) and by feature regime, which separates real signal from leakage.",
      },
      {
        title: "Audit the data before modelling",
        body: "The date column is label-contaminated and the shipped behavioral features are noise (≤ 0.005 correlation), so both are excluded.",
      },
      {
        title: "Control for graph shortcuts",
        body: "A GNN reaches 0.816 against 0.706 without a graph, but two degree counts recover 0.788. Most of the gain is a count the split meant to hide.",
      },
    ],
    stack: ["Python", "PyTorch", "scikit-learn", "TF-IDF + SVD", "Focal loss", "GNN"],
  },
};

export const caseStudyBySlug = (slug: string) => {
  const entry = Object.entries(caseStudies).find(([, c]) => c.slug === slug);
  return entry ? { title: entry[0], study: entry[1] } : null;
};
