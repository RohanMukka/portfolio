export interface Project {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  category: 'Web' | 'ML' | 'System' | 'Blockchain';
  links: { github?: string; demo?: string };
  image?: string; // screenshot of a live UI, for projects without a diagram
  color: string;
}

export const projects: Project[] = [
  {
    title: 'BEneFIT',
    tagline: 'Stake Your Success, Own Your Fitness.',
    description: 'Decentralized fitness accountability with ETH staking and smart contracts. Users stake ETH and earn it back by completing workout goals verified by oracles.',
    tags: ['Ethereum', 'Web3', 'React', 'Solidity'],
    category: 'Blockchain',
    links: { github: 'https://github.com/RohanMukka/BEneFIT' },
    color: '#627EEA'
  },
  {
    title: 'Spend Smart',
    tagline: 'Master Your Money',
    description: 'Personal finance tracker with TypeScript and Firebase. Features real-time visualization of spending habits and budget categorization.',
    tags: ['TypeScript', 'Firebase', 'React'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/spendsmart', demo: 'https://spendsmart-three.vercel.app/' },
    color: '#2ecc71'
  },
  {
    title: 'Diagnostic AI',
    tagline: 'Hybrid ML Logic',
    description: 'A robust diagnostic system leveraging explicit domain knowledge and learned data patterns for high-precision diagnostic insights.',
    tags: ['Python', 'ML', 'Diagnostics'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/A-Robust-Diagnostic-System-Leveraging-Explicit-Domain-Knowledge-and-Learned-Data-Patterns' },
    color: '#3776ab'
  },
  {
    title: 'FitPrep',
    tagline: 'Plan. Eat. Lift.',
    description: 'Comprehensive fitness planning platform for individualized nutrition and workout tracking. Deployed with optimal edge performance.',
    tags: ['React', 'Health', 'TypeScript'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/fitprep', demo: 'https://fitprep.vercel.app' },
    image: '/projects/fitprep.png',
    color: '#1abc9c'
  },
  {
    title: 'IPMS',
    tagline: 'Project Management Redefined',
    description: 'Integrated Project Management System featuring enterprise-grade tracking and collaborative workspace environments.',
    tags: ['JavaScript', 'System', 'Teamwork'],
    category: 'System',
    links: { github: 'https://github.com/IPMS-Project/IPMS' },
    color: '#3498db'
  },
  {
    title: 'JAI',
    tagline: 'Job Application Intelligence',
    description: 'High-performance framework focused on JavaScript AI integration and neural pattern recognition development.',
    tags: ['TypeScript', 'AI', 'JavaScript'],
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
    tagline: 'AI That Feels',
    description: 'Deep learning classification of human emotions through high-resolution EEG signal interpretation and signal processing.',
    tags: ['Python', 'DL', 'Biosensor'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multiclass-Emotion-Recognition-from-EEG-Signals' },
    color: '#9b59b6'
  },
  {
    title: 'FeeAutomation',
    tagline: 'FinTech Optimization',
    description: 'Enterprise automation tool for fee processing, financial management, and automated transaction auditing.',
    tags: ['JavaScript', 'Finance', 'Automation'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/FeeAutomation' },
    color: '#f1c40f'
  },
  {
    title: 'Patient Assistant DB',
    tagline: 'Healthcare Networking',
    description: 'A robust database management system designed to connect, manage, and scale patient and healthcare assistant networks.',
    tags: ['Java', 'Database', 'Healthcare', 'SQL'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/Patient-Assistant-Network-Database-System' },
    color: '#e74c3c'
  },
  {
    title: 'Polarization Detection',
    tagline: 'Multilingual NLP',
    description: 'A machine learning pipeline for analyzing text across multiple languages to detect social and political sentiment polarization.',
    tags: ['Python', 'NLP', 'Machine Learning'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multilingual-Polarization-Detection' },
    color: '#3498db'
  },
  {
    title: 'Fake Review Detection',
    tagline: 'Transformer Semantics',
    description: 'Fake Review Detection on Yelp using a combination of Transformer Semantics and Reviewer Behavior modeling.',
    tags: ['Python', 'NLP', 'Transformers'],
    category: 'ML',
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
    color: '#9b59b6'
  },
  {
    title: 'JobForge',
    tagline: 'Distributed Job Processing',
    description: 'Fault-tolerant background job processing system — Redis Streams, priority queues, exponential backoff, worker health checks, and a real-time React dashboard.',
    tags: ['Python', 'Redis', 'React'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/JobForge' },
    color: '#e67e22'
  },
  {
    title: 'MLFlowForge',
    tagline: 'End-to-end MLOps',
    description: 'MLOps pipeline for fraud detection — Airflow DAGs, MLflow model registry, Evidently drift monitoring, automated retraining, FastAPI serving.',
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
    links: { github: 'https://github.com/RohanMukka/multi-agent-course-builder', demo: 'https://course-creator-205520880647.us-west1.run.app/' },
    color: '#e74c3c'
  },
  {
    title: 'NexusRAG',
    tagline: 'Production-grade RAG',
    description: 'RAG system with multi-source ingestion, hybrid retrieval (dense + BM25 + reranking), streaming chat, RAGAS evaluation dashboard, and hallucination detection.',
    tags: ['LLM', 'ChromaDB', 'NextJS'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/NexusRAG' },
    color: '#16a085'
  },
  {
    title: 'SafeFlow',
    tagline: 'Data Safety Management',
    description: 'A comprehensive data flow and safety management application featuring real-time stream control and processing.',
    tags: ['Python', 'Pipeline', 'Safety'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/SafeFlow', demo: 'https://safeflow-frontend-2trn3wwwia-uc.a.run.app/' },
    color: '#3498db'
  },
  {
    title: 'StreamSense',
    tagline: 'Real-Time Event Analytics',
    description: 'Event streaming analytics platform processing 5k+ events/sec with Kafka, Flink-style processing, Redis, FastAPI, and Next.js.',
    tags: ['Kafka', 'Redis', 'Python'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/StreamSense' },
    color: '#8e44ad'
  }
];

// Shown first (and alone, until "Show all") in the Work section.
export const FEATURED_TITLES = [
  "NexusRAG",
  "StreamSense",
  "JobForge",
  "MLFlowForge",
  "Multi-Agent Course Builder",
  "EduLens AI",
  "Spend Smart",
  "Fake Review Detection",
];

export const CATEGORIES = ["All", "Web", "ML", "System", "Blockchain"] as const;
export type Category = (typeof CATEGORIES)[number];

// Featured projects first, in FEATURED_TITLES order, then the rest.
export const orderedProjects = (list: Project[]) => {
  const rank = (p: Project) => {
    const i = FEATURED_TITLES.indexOf(p.title);
    return i === -1 ? FEATURED_TITLES.length : i;
  };
  return [...list].sort((a, b) => rank(a) - rank(b));
};
