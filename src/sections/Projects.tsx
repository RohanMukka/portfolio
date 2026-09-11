import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, ExternalLink } from 'lucide-react';

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
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    color: '#627EEA'
  },
  {
    title: 'Spend Smart',
    tagline: 'Master Your Money',
    description: 'Personal finance tracker with TypeScript and Firebase. Features real-time visualization of spending habits and budget categorization.',
    tags: ['TypeScript', 'Firebase', 'React'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/spendsmart', demo: 'https://spendsmart-three.vercel.app/' },
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1626&auto=format&fit=crop',
    color: '#2ecc71'
  },
  {
    title: 'Diagnostic AI',
    tagline: 'Hybrid ML Logic',
    description: 'A robust diagnostic system leveraging explicit domain knowledge and learned data patterns for high-precision diagnostic insights.',
    tags: ['Python', 'ML', 'Diagnostics'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/A-Robust-Diagnostic-System-Leveraging-Explicit-Domain-Knowledge-and-Learned-Data-Patterns' },
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1480&auto=format&fit=crop',
    color: '#3776ab'
  },
  {
    title: 'FitPrep',
    tagline: 'Plan. Eat. Lift.',
    description: 'Comprehensive fitness planning platform for individualized nutrition and workout tracking. Deployed with optimal edge performance.',
    tags: ['React', 'Health', 'TypeScript'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/fitprep', demo: 'https://fitprep.vercel.app' },
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop',
    color: '#1abc9c'
  },
  {
    title: 'IPMS',
    tagline: 'Project Management Redefined',
    description: 'Integrated Project Management System featuring enterprise-grade tracking and collaborative workspace environments.',
    tags: ['JavaScript', 'System', 'Teamwork'],
    category: 'System',
    links: { github: 'https://github.com/IPMS-Project/IPMS' },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop',
    color: '#3498db'
  },
  {
    title: 'JAI',
    tagline: 'Job Application Intelligence',
    description: 'High-performance framework focused on JavaScript AI integration and neural pattern recognition development.',
    tags: ['TypeScript', 'AI', 'JavaScript'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/JAI' },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop',
    color: '#f7df1e'
  },
  {
    title: 'Portfolio',
    tagline: 'Modern Web Identity',
    description: 'A personal portfolio website showcasing work and projects. Built with TypeScript for type-safe development and modern web technologies.',
    tags: ['TypeScript', 'Vercel', 'Responsive'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/portfolio', demo: 'https://portfolio-rohan03.vercel.app/' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    color: '#3178c6'
  },
  {
    title: 'Emotion Recog',
    tagline: 'AI That Feels',
    description: 'Deep learning classification of human emotions through high-resolution EEG signal interpretation and signal processing.',
    tags: ['Python', 'DL', 'Biosensor'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multiclass-Emotion-Recognition-from-EEG-Signals' },
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1530&auto=format&fit=crop',
    color: '#9b59b6'
  },
  {
    title: 'FeeAutomation',
    tagline: 'FinTech Optimization',
    description: 'Enterprise automation tool for fee processing, financial management, and automated transaction auditing.',
    tags: ['JavaScript', 'Finance', 'Automation'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/FeeAutomation' },
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1548&auto=format&fit=crop',
    color: '#f1c40f'
  },
  {
    title: 'Patient Assistant DB',
    tagline: 'Healthcare Networking',
    description: 'A robust database management system designed to connect, manage, and scale patient and healthcare assistant networks.',
    tags: ['Java', 'Database', 'Healthcare', 'SQL'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/Patient-Assistant-Network-Database-System' },
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=1470&auto=format&fit=crop',
    color: '#e74c3c'
  },
  {
    title: 'Polarization Detection',
    tagline: 'Multilingual NLP',
    description: 'A machine learning pipeline for analyzing text across multiple languages to detect social and political sentiment polarization.',
    tags: ['Python', 'NLP', 'Machine Learning'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Multilingual-Polarization-Detection' },
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1470&auto=format&fit=crop',
    color: '#3498db'
  },
  {
    title: 'Fake Review Detection',
    tagline: 'Transformer Semantics',
    description: 'Fake Review Detection on Yelp using a combination of Transformer Semantics and Reviewer Behavior modeling.',
    tags: ['Python', 'NLP', 'Transformers'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/Combining-Transformer-Semantics-and-Reviewer-Behavior-for-Fake-Review-Detection-on-Yelp' },
    image: '/fake_review_project.png',
    color: '#c0392b'
  },
  {
    title: 'EduLens AI',
    tagline: 'Adaptive Learning Companion',
    description: 'Uses NLP to analyze student understanding from free-text responses, generates personalized explanations, and adapts learning paths in real time.',
    tags: ['TypeScript', 'NLP', 'AI'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/edulens-ai', demo: 'https://edulens-ai-lep9.onrender.com' },
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
    color: '#9b59b6'
  },
  {
    title: 'JobForge',
    tagline: 'Distributed Job Processing',
    description: 'Fault-tolerant background job processing system — Redis Streams, priority queues, exponential backoff, worker health checks, and a real-time React dashboard.',
    tags: ['Python', 'Redis', 'React'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/JobForge' },
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1600&auto=format&fit=crop',
    color: '#e67e22'
  },
  {
    title: 'MLFlowForge',
    tagline: 'End-to-end MLOps',
    description: 'MLOps pipeline for fraud detection — Airflow DAGs, MLflow model registry, Evidently drift monitoring, automated retraining, FastAPI serving.',
    tags: ['Airflow', 'MLflow', 'PyTorch'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/MLFlowForge' },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    color: '#2980b9'
  },
  {
    title: 'Multi-Agent Course Builder',
    tagline: 'Autonomous AI Orchestration',
    description: 'A distributed multi-agent system built with Google’s ADK and A2A protocol. Orchestrates AI microservices to autonomously research and generate courses.',
    tags: ['Python', 'Agents', 'Microservices'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/multi-agent-course-builder', demo: 'https://course-creator-205520880647.us-west1.run.app/' },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    color: '#e74c3c'
  },
  {
    title: 'NexusRAG',
    tagline: 'Production-grade RAG',
    description: 'RAG system with multi-source ingestion, hybrid retrieval (dense + BM25 + reranking), streaming chat, RAGAS evaluation dashboard, and hallucination detection.',
    tags: ['LLM', 'ChromaDB', 'NextJS'],
    category: 'ML',
    links: { github: 'https://github.com/RohanMukka/NexusRAG' },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    color: '#16a085'
  },
  {
    title: 'SafeFlow',
    tagline: 'Data Safety Management',
    description: 'A comprehensive data flow and safety management application featuring real-time stream control and processing.',
    tags: ['Python', 'Pipeline', 'Safety'],
    category: 'Web',
    links: { github: 'https://github.com/RohanMukka/SafeFlow', demo: 'https://safeflow-frontend-2trn3wwwia-uc.a.run.app/' },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
    color: '#3498db'
  },
  {
    title: 'StreamSense',
    tagline: 'Real-Time Event Analytics',
    description: 'Event streaming analytics platform processing 5k+ events/sec with Kafka, Flink-style processing, Redis, FastAPI, and Next.js.',
    tags: ['Kafka', 'Redis', 'Python'],
    category: 'System',
    links: { github: 'https://github.com/RohanMukka/StreamSense' },
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1600&auto=format&fit=crop',
    color: '#8e44ad'
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[400px] w-full cursor-pointer group perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500 rounded-2xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ 
          y: -12,
          boxShadow: "0 20px 40px -15px var(--glass-shadow), 0 0 20px 1px var(--accent-dim)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden glass-card">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-3xl font-display font-bold text-primary-text mb-1">{project.title}</h3>
            <p className="text-primary-secondary text-sm font-medium tracking-wide uppercase mb-3">{project.tagline}</p>
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: project.color }}></div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden glass-card p-8 flex flex-col"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-display font-bold" style={{ color: project.color }}>
              {project.title}
            </h3>
            <div className="flex gap-2">
              {project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-text text-white hover:bg-primary-text/90 transition-all font-medium text-sm shadow-lg shadow-primary-text/10 group/btn"
                  title="View GitHub"
                >
                  <Github size={18} />
                  <span>Code</span>
                </a>
              )}
              {project.links.demo && (
                <a 
                  href={project.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all font-medium text-sm shadow-lg shadow-accent/10 group/btn"
                  title="Live Demo"
                >
                  <ExternalLink size={18} />
                  <span>Demo</span>
                </a>
              )}
            </div>
          </div>
          
          <p className="text-primary-secondary mb-8 leading-relaxed flex-grow">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-semibold rounded-full bg-surface-subtle text-primary-text border border-glass-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
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
        <motion.div
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              className="p-4 rounded-full border border-glass-border bg-glass-bg backdrop-blur-md hover:border-accent transition-all text-primary-text hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-4 rounded-full border border-glass-border bg-glass-bg backdrop-blur-md hover:border-accent transition-all text-primary-text hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>

        <div className="relative w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-8 pb-12 px-6 -mx-6 snap-x snap-mandatory scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              layout
            >
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.title}
                  className="min-w-[85vw] md:min-w-[450px] snap-center flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  layout
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Projects;
