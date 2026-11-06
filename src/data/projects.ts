// A real capture of the project running (never a mock-up). The still shows in
// hover previews and while the clip loads; the clip, a short muted loop,
// plays in the case study. Files live in public/projects/; how to record
// more is in docs/REDESIGN.md (step 7).
export interface ProjectMedia {
  still: string;
  clip?: string;
  from: string; // the address it was captured at, shown in the frame
  recorded: string; // YYYY-MM-DD
  shows: string; // what happens in it, in words (also the alt text)
}

export interface Project {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  category: 'Web' | 'ML' | 'Research' | 'System' | 'Blockchain';
  links: { github?: string; demo?: string };
  media?: ProjectMedia;
  color: string;
}

export const projects: Project[] = [
  {
    title: 'BEneFIT',
    tagline: 'Stake Your Success, Own Your Fitness.',
    description: 'Stake ETH on a fitness goal and earn it back by meeting it: solo lock-and-release or group redistribution, enforced by smart contracts, with activity checked through APIs.',
    tags: ['Ethereum', 'Solidity', 'Hardhat', 'React'],
    category: 'Blockchain',
    links: { github: 'https://github.com/RohanMukka/BEneFIT' },
    color: '#627EEA'
  },
  {
    title: 'Spend Smart',
    tagline: 'Master Your Money',
    description: 'Split a monthly budget, draw an event card each month, and watch taxes, interest and surprises play out on savings and debt, ending in a score and tips.',
    tags: ['TypeScript', 'Firebase', 'React'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/spendsmart', demo: 'https://spendsmart-three.vercel.app/' },
    color: '#2ecc71'
  },
  {
    title: 'Diagnostic AI',
    tagline: 'Rules First, Learning After',
    description: 'Medical diagnosis that tries OWL ontology and SWRL rules first and falls back to a decision-tree classifier when they are inconclusive: 25% more accurate than either alone.',
    tags: ['Python', 'OWL', 'SWRL', 'scikit-learn'],
    category: 'Research',
    links: { github: 'https://github.com/RohanMukka/A-Robust-Diagnostic-System-Leveraging-Explicit-Domain-Knowledge-and-Learned-Data-Patterns' },
    color: '#3776ab'
  },
  {
    title: 'FitPrep',
    tagline: 'Plan. Eat. Lift.',
    description: 'A 7-day meal and workout plan built from the foods you already have, typed or spoken, with per-meal macros and charts.',
    tags: ['React', 'JavaScript', 'Chart.js'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/fitprep', demo: 'https://fitprep.vercel.app' },
    media: {
      still: '/projects/fitprep.webp',
      from: 'fitprep.vercel.app',
      recorded: '2026-10-01',
      shows: "FitPrep's planner: the foods you have, typed or by voice, a fitness goal and daily calorie and protein targets, then Generate My 7-Day Plan.",
    },
    color: '#1abc9c'
  },
  {
    title: 'IPMS',
    tagline: 'Internship Program Management',
    description: "OU's internship program management system, built as a team. I built the request, tracking and evaluation modules, with automated supervisor and coordinator approvals and reminders.",
    tags: ['React', 'Node.js', 'MongoDB'],
    category: 'System',
    links: { github: 'https://github.com/IPMS-Project/IPMS' },
    color: '#3498db'
  },
  {
    title: 'JAI',
    tagline: 'Job Application Intelligence',
    description: 'A Chrome extension and Next.js dashboard that rewrites your LaTeX résumé for each job description with Gemini, compiles it in Overleaf and autofills the application.',
    tags: ['TypeScript', 'Next.js', 'Gemini', 'MongoDB'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/JAI' },
    color: '#f7df1e'
  },
  {
    title: 'Portfolio',
    tagline: 'Modern Web Identity',
    description: 'A personal portfolio website showcasing work and projects. Built with TypeScript for type-safe development and modern web technologies.',
    tags: ['TypeScript', 'Vercel', 'Responsive'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/portfolio', demo: 'https://portfolio-rohan03.vercel.app/' },
    color: '#3178c6'
  },
  {
    title: 'Emotion Recog',
    tagline: 'Four Emotions from EEG',
    description: 'Classifies four emotions from EEG (GAMEEMO: 28 subjects, 14 channels at 128 Hz) by fusing a random forest on band power with a CNN on the raw signal: about 90% accurate.',
    tags: ['Python', 'CNN', 'Random Forest', 'MNE'],
    category: 'Research',
    links: { github: 'https://github.com/RohanMukka/Multiclass-Emotion-Recognition-from-EEG-Signals' },
    color: '#9b59b6'
  },
  {
    title: 'FeeAutomation',
    tagline: 'Academic Fees, Paid Online',
    description: 'Students see their fee breakdown, pay through Stripe and download receipts; admins manage fee structures, track payments and run reports.',
    tags: ['React', 'Express', 'MySQL', 'Stripe'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/FeeAutomation' },
    color: '#f1c40f'
  },
  {
    title: 'Patient Assistant DB',
    tagline: 'Healthcare Networking',
    description: 'A relational database and Java client for a patient assistance network: clients, volunteers, employees and donors as roles of one Person table, with teams, donations and reports.',
    tags: ['Java', 'JDBC', 'SQL Server'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/Patient-Assistant-Network-Database-System' },
    color: '#e74c3c'
  },
  {
    title: 'Polarization Detection',
    tagline: 'SemEval 2026 · 22 Languages',
    description: 'A SemEval 2026 Task 9 study, with Kamal Poshala and Kushi Reddy Kankar: mBERT, mT5, LoRA adapters and LLM prompting compared across 22 languages. Multilingual LoRA generalized best.',
    tags: ['Python', 'LoRA', 'mT5', 'mBERT'],
    category: 'Research',
    links: { github: 'https://github.com/RohanMukka/Multilingual-Polarization-Detection' },
    color: '#3498db'
  },
  {
    title: 'ReviewGuard',
    tagline: 'Fake Review Detection, Audited',
    description: 'A two-branch fake review detector for YelpCHI, and an audit of the benchmark: a timestamp alone scored 0.965 AUC, so dates were dropped and models were scored on businesses they never saw.',
    tags: ['Python', 'PyTorch', 'GNN'],
    category: 'Research',
    links: { github: 'https://github.com/RohanMukka/Combining-Transformer-Semantics-and-Reviewer-Behavior-for-Fake-Review-Detection-on-Yelp' },
    color: '#c0392b'
  },
  {
    title: 'EduLens AI',
    tagline: 'Adaptive Learning Companion',
    description: 'Uses NLP to analyze student understanding from free-text responses, generates personalized explanations, and adapts learning paths in real time.',
    tags: ['TypeScript', 'NLP', 'AI'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/edulens-ai', demo: 'https://edulens-ai-lep9.onrender.com' },
    media: {
      still: '/projects/edulens-demo.webp',
      clip: '/projects/edulens-demo.mp4',
      from: 'edulens-ai-lep9.onrender.com/#/demo',
      recorded: '2026-10-16',
      shows: "One run of the live Evidence Mode demo on its built-in weak answer: the gatekeeper, diagnostic agent, Bloom's classifier and remediation engine run in turn, the answer scores 22%, and the adaptive response drops the next question to easy.",
    },
    color: '#9b59b6'
  },
  {
    title: 'JobForge',
    tagline: 'Distributed Job Processing',
    description: 'A fault-tolerant task queue built from scratch on Redis Streams: priority queues, exponential-backoff retries, a dead-letter queue, worker heartbeats and a live React dashboard.',
    tags: ['Python', 'Redis', 'React'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/JobForge' },
    color: '#e67e22'
  },
  {
    title: 'MLFlowForge',
    tagline: 'End-to-end MLOps',
    description: 'An MLOps pipeline for fraud detection: Airflow DAGs, an MLflow registry with a quality gate, Evidently drift monitoring, automatic retraining and FastAPI serving.',
    tags: ['Airflow', 'MLflow', 'PyTorch'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/MLFlowForge' },
    color: '#2980b9'
  },
  {
    title: 'Multi-Agent Course Builder',
    tagline: 'Autonomous AI Orchestration',
    description: 'A distributed multi-agent system built with Google’s ADK and A2A protocol. Orchestrates AI microservices to autonomously research and generate courses.',
    tags: ['Python', 'Agents', 'Microservices'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/multi-agent-course-builder' },
    color: '#e74c3c'
  },
  {
    title: 'NexusRAG',
    tagline: 'Production-grade RAG',
    description: 'A RAG system with multi-source ingestion, hybrid retrieval (dense + BM25, fused with RRF), streaming chat, RAGAS-style evaluation and per-claim hallucination detection.',
    tags: ['LLM', 'ChromaDB', 'Next.js'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/NexusRAG' },
    color: '#16a085'
  },
  {
    title: 'SafeFlow',
    tagline: 'Agents for Crowd Safety',
    description: 'Five Google ADK agents on Gemini reroute stadium crowds, dispatch stewards and broadcast alerts, checking their own past traces in Arize Phoenix first and waiting for human approval.',
    tags: ['Google ADK', 'Gemini', 'FastAPI', 'OpenTelemetry'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/SafeFlow' },
    color: '#3498db'
  },
  {
    title: 'StreamSense',
    tagline: 'Real-Time Event Analytics',
    description: 'A Kafka pipeline that ingests 5,000+ synthetic clickstream events a second, aggregates them in rolling windows into Redis and PostgreSQL, and survives a consumer crash.',
    tags: ['Kafka', 'Redis', 'Python'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/StreamSense' },
    color: '#8e44ad'
  }
];

// Shown first (and alone, until "Show all") in the Work section. ReviewGuard
// leads, since auditing its own benchmark is the strongest story here;
// Course Builder is last because its demo is gone.
export const FEATURED_TITLES = [
  "ReviewGuard",
  "NexusRAG",
  "MLFlowForge",
  "SafeFlow",
  "EduLens AI",
  "StreamSense",
  "JobForge",
  "Multi-Agent Course Builder",
];

export const CATEGORIES = ["All", "Web", "ML", "Research", "System", "Blockchain"] as const;
export type Category = (typeof CATEGORIES)[number];

// Featured projects first, in FEATURED_TITLES order, then the rest.
export const orderedProjects = (list: Project[]) => {
  const rank = (p: Project) => {
    const i = FEATURED_TITLES.indexOf(p.title);
    return i === -1 ? FEATURED_TITLES.length : i;
  };
  return [...list].sort((a, b) => rank(a) - rank(b));
};
