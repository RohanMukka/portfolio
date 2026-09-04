import React, { useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import { ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';
import { useTilt } from '../lib/useTilt';
import './Projects.css';

interface Project {
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  category: 'Web' | 'ML' | 'System' | 'Blockchain';
  links: { github?: string; demo?: string };
  image: string;
  color: string;
}

const projects: Project[] = [
  {
    title: 'BEneFIT',
    tagline: 'Stake Your Success, Own Your Fitness.',
    description: 'Decentralized fitness accountability with ETH staking and smart contracts. Users stake ETH and earn it back by completing workout goals verified by oracles.',
    tags: ['Ethereum', 'Web3', 'React', 'Solidity'],
    category: 'Blockchain',
    links: { github: 'https://github.com/RohanMukka/BEneFIT' },
    image: '',
    color: '#627EEA'
  },
  {
    title: 'Spend Smart',
    tagline: 'Master Your Money',
    description: 'Personal finance tracker with TypeScript and Firebase. Features real-time visualization of spending habits and budget categorization.',
    tags: ['TypeScript', 'Firebase', 'React'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/spendsmart', demo: 'https://spendsmart-three.vercel.app/' },
    image: '',
    color: '#2ecc71'
  },
  {
    title: 'Diagnostic AI',
    tagline: 'Hybrid ML Logic',
    description: 'A robust diagnostic system leveraging explicit domain knowledge and learned data patterns for high-precision diagnostic insights.',
    tags: ['Python', 'ML', 'Diagnostics'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/A-Robust-Diagnostic-System-Leveraging-Explicit-Domain-Knowledge-and-Learned-Data-Patterns' },
    image: '',
    color: '#3776ab'
  },
  {
    title: 'FitPrep',
    tagline: 'Plan. Eat. Lift.',
    description: 'Comprehensive fitness planning platform for individualized nutrition and workout tracking. Deployed with optimal edge performance.',
    tags: ['React', 'Health', 'TypeScript'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/fitprep', demo: 'https://fitprep.vercel.app' },
    image: '',
    color: '#1abc9c'
  },
  {
    title: 'IPMS',
    tagline: 'Project Management Redefined',
    description: 'Integrated Project Management System featuring enterprise-grade tracking and collaborative workspace environments.',
    tags: ['JavaScript', 'System', 'Teamwork'],
    category: 'System',
    links: { github: 'https://github.com/IPMS-Project/IPMS' },
    image: '',
    color: '#3498db'
  },
  {
    title: 'JAI',
    tagline: 'Job Application Intelligence',
    description: 'High-performance framework focused on JavaScript AI integration and neural pattern recognition development.',
    tags: ['TypeScript', 'AI', 'JavaScript'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/JAI' },
    image: '',
    color: '#f7df1e'
  },
  {
    title: 'Portfolio',
    tagline: 'Modern Web Identity',
    description: 'A personal portfolio website showcasing work and projects. Built with TypeScript for type-safe development and modern web technologies.',
    tags: ['TypeScript', 'Vercel', 'Responsive'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/portfolio', demo: 'https://portfolio-rohan03.vercel.app/' },
    image: '',
    color: '#3178c6'
  },
  {
    title: 'Emotion Recog',
    tagline: 'AI That Feels',
    description: 'Deep learning classification of human emotions through high-resolution EEG signal interpretation and signal processing.',
    tags: ['Python', 'DL', 'Biosensor'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multiclass-Emotion-Recognition-from-EEG-Signals' },
    image: '',
    color: '#9b59b6'
  },
  {
    title: 'FeeAutomation',
    tagline: 'FinTech Optimization',
    description: 'Enterprise automation tool for fee processing, financial management, and automated transaction auditing.',
    tags: ['JavaScript', 'Finance', 'Automation'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/FeeAutomation' },
    image: '',
    color: '#f1c40f'
  },
  {
    title: 'Patient Assistant DB',
    tagline: 'Healthcare Networking',
    description: 'A robust database management system designed to connect, manage, and scale patient and healthcare assistant networks.',
    tags: ['Java', 'Database', 'Healthcare', 'SQL'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/Patient-Assistant-Network-Database-System' },
    image: '',
    color: '#e74c3c'
  },
  {
    title: 'Polarization Detection',
    tagline: 'Multilingual NLP',
    description: 'A machine learning pipeline for analyzing text across multiple languages to detect social and political sentiment polarization.',
    tags: ['Python', 'NLP', 'Machine Learning'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multilingual-Polarization-Detection' },
    image: '',
    color: '#3498db'
  },
  {
    title: 'Fake Review Detection',
    tagline: 'Transformer Semantics',
    description: 'Fake Review Detection on Yelp using a combination of Transformer Semantics and Reviewer Behavior modeling.',
    tags: ['Python', 'NLP', 'Transformers'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Combining-Transformer-Semantics-and-Reviewer-Behavior-for-Fake-Review-Detection-on-Yelp' },
    image: '/fake_review_project.webp',
    color: '#c0392b'
  },
  {
    title: 'EduLens AI',
    tagline: 'Adaptive Learning Companion',
    description: 'Uses NLP to analyze student understanding from free-text responses, generates personalized explanations, and adapts learning paths in real time.',
    tags: ['TypeScript', 'NLP', 'AI'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/edulens-ai', demo: 'https://edulens-ai-lep9.onrender.com' },
    image: '',
    color: '#9b59b6'
  },
  {
    title: 'JobForge',
    tagline: 'Distributed Job Processing',
    description: 'Fault-tolerant background job processing system — Redis Streams, priority queues, exponential backoff, worker health checks, and a real-time React dashboard.',
    tags: ['Python', 'Redis', 'React'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/JobForge' },
    image: '',
    color: '#e67e22'
  },
  {
    title: 'MLFlowForge',
    tagline: 'End-to-end MLOps',
    description: 'MLOps pipeline for fraud detection — Airflow DAGs, MLflow model registry, Evidently drift monitoring, automated retraining, FastAPI serving.',
    tags: ['Airflow', 'MLflow', 'PyTorch'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/MLFlowForge' },
    image: '',
    color: '#2980b9'
  },
  {
    title: 'Multi-Agent Course Builder',
    tagline: 'Autonomous AI Orchestration',
    description: 'A distributed multi-agent system built with Google’s ADK and A2A protocol. Orchestrates AI microservices to autonomously research and generate courses.',
    tags: ['Python', 'Agents', 'Microservices'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/multi-agent-course-builder', demo: 'https://course-creator-205520880647.us-west1.run.app/' },
    image: '',
    color: '#e74c3c'
  },
  {
    title: 'NexusRAG',
    tagline: 'Production-grade RAG',
    description: 'RAG system with multi-source ingestion, hybrid retrieval (dense + BM25 + reranking), streaming chat, RAGAS evaluation dashboard, and hallucination detection.',
    tags: ['LLM', 'ChromaDB', 'NextJS'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/NexusRAG' },
    image: '',
    color: '#16a085'
  },
  {
    title: 'SafeFlow',
    tagline: 'Data Safety Management',
    description: 'A comprehensive data flow and safety management application featuring real-time stream control and processing.',
    tags: ['Python', 'Pipeline', 'Safety'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/SafeFlow', demo: 'https://safeflow-frontend-2trn3wwwia-uc.a.run.app/' },
    image: '',
    color: '#3498db'
  },
  {
    title: 'StreamSense',
    tagline: 'Real-Time Event Analytics',
    description: 'Event streaming analytics platform processing 5k+ events/sec with Kafka, Flink-style processing, Redis, FastAPI, and Next.js.',
    tags: ['Kafka', 'Redis', 'Python'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/StreamSense' },
    image: '',
    color: '#8e44ad'
  }
];

/** Only assets we ship ourselves are rendered as images; everything else gets
 *  generated cover art rather than a third-party photo. */
const isLocalAsset = (src: string) => src.startsWith("/");

const initials = (title: string) => {
  const words = title.split(/[\s-]+/).filter(Boolean);
  const mark =
    words.length > 1
      ? words.slice(0, 2).map((word) => word[0]).join("")
      : title.slice(0, 2);
  return mark.toUpperCase();
};

const ProjectCard = ({ project }: { project: Project }) => {
  const tilt = useTilt(8);

  return (
    <article className="pcard group">
      <div className="pcard-rig" {...tilt}>
        <div className="pcard-art">
          {isLocalAsset(project.image) ? (
            <img src={project.image} alt="" loading="lazy" decoding="async" />
          ) : (
            <div
              className="pcard-canvas"
              style={{ ["--art" as string]: project.color }}
            >
              <span className="pcard-glyph">{initials(project.title)}</span>
            </div>
          )}
          <div className="pcard-scrim" />
        </div>

        <div className="pcard-glare" />

        <span
          className="pcard-badge px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] surface"
          data-elev="3"
        >
          {project.category}
        </span>

        <div className="pcard-actions">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="surface lift flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-primary-text"
              data-elev="4"
            >
              <Github size={15} />
              Code
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="lift flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-accent"
            >
              <ExternalLink size={15} />
              Demo
            </a>
          )}
        </div>

        <div className="pcard-plate">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-text mb-1">
            {project.title}
          </h3>
          <p className="text-primary-secondary text-xs font-semibold tracking-[0.14em] uppercase mb-3">
            {project.tagline}
          </p>
          <div
            className="pcard-rule mb-4"
            style={{ backgroundColor: project.color }}
          />

          <div className="pcard-detail">
            <div>
              <p className="text-primary-secondary text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-surface-subtle text-primary-text border border-glass-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'All' | 'Web' | 'ML' | 'System' | 'Blockchain'>('All');

  const filteredProjects = projects.filter(p => filter === 'All' || p.category === filter);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.firstElementChild?.clientWidth || 400;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      const currentScroll = container.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal
  className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-text mb-4">
              Featured Projects
            </h2>
            <p className="text-primary-secondary max-w-xl text-lg">
              Experimental work, open source contributions, and personal tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-surface-subtle p-1.5 rounded-2xl border border-glass-border">
            {['All', 'Web', 'ML', 'System', 'Blockchain'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  filter === cat 
                  ? 'bg-primary-text text-background shadow-lg scale-105' 
                  : 'text-primary-secondary hover:text-primary-text hover:bg-bg-elevated/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="surface surface-glass lift p-4 rounded-full text-primary-text"
              data-elev="2"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="surface surface-glass lift p-4 rounded-full text-primary-text"
              data-elev="2"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </Reveal>

        {/* Cards deliberately do not use <Reveal>: it triggers on vertical
            intersection, so cards parked off-screen to the right of this
            horizontal scroller would sit at opacity 0 until dragged into view. */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto overflow-y-visible gap-8 py-8 px-6 -mx-6 snap-x snap-mandatory scrollbar-none scroll-smooth"
          >
            {filteredProjects.map((project) => (
              <div
                key={project.title}
                className="min-w-[85vw] md:min-w-[450px] snap-center flex-shrink-0"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
