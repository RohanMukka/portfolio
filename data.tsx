
import { PersonalData } from './types';
import { Briefcase, Lightbulb, Code, Server, BrainCircuit, Award, BookOpen, TrendingUp, ShieldCheck, Cpu, Database, Cloud, GitMerge, Palette, Zap, Target } from 'lucide-react';

export const personalData: PersonalData = {
  name: "Rohan Mukka",
  title: "MS Computer Science Student",
  email: "rohan.mukka-1@ou.edu",
  phone: "+1 (405) 501-5699",
  location: "Oklahoma, United States",
  linkedin: "https://linkedin.com/in/rohanmukka",
  github: "https://github.com/rohanmukka",
  leetcode: "https://leetcode.com/u/rohan_mukka",
  resumeUrl: "/rohan_resume.pdf", // Changed to absolute path from domain root
  about: {
    greeting: "Hello! I'm Rohan Mukka.",
    bio: [
      "I am a Master of Science in Computer Science student at the University of Oklahoma (GPA: 4.0/4.0), building upon a Bachelor of Technology in Computer Science and Engineering with a minor in AI/ML (GPA: 9.1/10.0) from CVR College of Engineering.",
      "My passion lies in developing impactful AI/ML solutions and exploring the frontiers of technology. As an ML Engineer Intern at Internpe, I honed my skills in model development, optimization, and deployment, contributing to significant improvements in prediction accuracy and training efficiency.",
      "I am driven to create innovative projects, from decentralized applications like BEneFIT to practical management systems and intelligent diagnostic tools. I'm always eager to learn and apply new technologies to solve complex challenges."
    ],
    profileImageUrl: "https://placehold.co/600x600/1A1A2E/E0E0E0?text=RM",
    strengths: [
        { icon: <Zap size={20} className="text-yellow-400"/>, text: "Innovative Problem-Solver"},
        { icon: <Lightbulb size={20} className="text-green-400"/>, text: "Passionate Learner"},
        { icon: <Target size={20} className="text-red-400"/>, text: "Results-Oriented Developer"}
    ]
  },
  experience: [
    {
      role: "ML Engineer Intern",
      company: "Internpe (Remote)",
      duration: "Jul 2024 - Aug 2024",
      description: "Developed and fine-tuned ML models (Python, TensorFlow, Scikit-learn), improving prediction accuracy by 20%. Optimized preprocessing and feature engineering, reducing training time by 15%. Collaborated on deploying AI/ML solutions, boosting project efficiency.",
      icon: <Cpu size={24} className="text-purple-400" />
    },
     {
      role: "Master of Science in Computer Science",
      company: "University of Oklahoma",
      duration: "Aug 2024 - May 2026 (Expected)",
      description: "Specializing in advanced computer science topics with a focus on AI/ML. Maintained a 4.0 GPA.",
      icon: <BookOpen size={24} className="text-purple-400" />
    },
    {
      role: "Bachelor of Technology in CSE (Minor in AI/ML)",
      company: "CVR College of Engineering",
      duration: "Aug 2020 - May 2024",
      description: "Comprehensive foundation in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning. Graduated with a 9.1/10.0 GPA.",
      icon: <Award size={24} className="text-purple-400" />
    },
  ],
  projects: [
    {
      id: 1,
      title: "BEneFIT – Decentralized Fitness Accountability",
      description: "Built two ETH-staking models for fitness goals (solo & group). Developed smart contracts with a React frontend and OAuth-secured backend. Outperformed competitors in decentralization and flexibility.",
      tags: ["Blockchain", "DeFi", "React", "Solidity", "OAuth"],
      imageUrl: "https://placehold.co/720x400/8A2BE2/FFFFFF?text=BEneFIT+Project",
      githubUrl: "https://github.com/rohanmukka",
      liveUrl: null,
      icon: <TrendingUp size={24} className="text-green-400" />
    },
    {
      id: 2,
      title: "Internship Program Management System",
      description: "Built internship modules for requests, tracking, and evaluations for OU CS, boosting submission efficiency by 30%. Automated approvals and reminders, cutting manual follow-ups by 50%. Improved compliance with dashboards and outcome mapping.",
      tags: ["Full-Stack", "React", "Node.js", "System Design", "Automation"],
      imageUrl: "https://placehold.co/720x400/4682B4/FFFFFF?text=IPMS+Project",
      githubUrl: "https://github.com/rohanmukka",
      liveUrl: null,
      duration: "Jan 2025 - Apr 2025",
      icon: <Briefcase size={24} className="text-blue-400" />
    },
    {
      id: 3,
      title: "Diagnostic System for Medical Inference",
      description: "Designed a hybrid rule-based + ML system (Python, Protégé, SWRL), improving diagnostic accuracy by 25%. Structured medical knowledge using ontologies and applied ML for enhanced results.",
      tags: ["AI/ML", "Expert Systems", "Python", "Protégé", "Healthcare"],
      imageUrl: "https://placehold.co/720x400/3CB371/FFFFFF?text=Medical+AI+Project",
      githubUrl: null,
      liveUrl: null,
      duration: "Completed Mar 2024",
      icon: <ShieldCheck size={24} className="text-red-400" />
    },
  ],
  skills: [
    { name: "Python", category: "Languages", icon: <Code size={24} className="text-yellow-400"/>, proficiency: 95 },
    { name: "JavaScript", category: "Languages", icon: <Code size={24} className="text-yellow-400"/>, proficiency: 90 },
    { name: "Java", category: "Languages", icon: <Code size={24} className="text-orange-400"/>, proficiency: 80 },
    { name: "SQL", category: "Databases", icon: <Database size={24} className="text-blue-400"/>, proficiency: 85 },
    { name: "HTML/CSS", category: "Frontend", icon: <Palette size={24} className="text-pink-400"/>, proficiency: 90 },
    { name: "React.js", category: "Frameworks & Libraries", icon: <Code size={24} className="text-sky-400"/>, proficiency: 90 },
    { name: "Node.js", category: "Frameworks & Libraries", icon: <Server size={24} className="text-green-400"/>, proficiency: 85 },
    { name: "TensorFlow", category: "AI/ML", icon: <BrainCircuit size={24} className="text-purple-400"/>, proficiency: 80 },
    { name: "Scikit-learn", category: "AI/ML", icon: <BrainCircuit size={24} className="text-purple-400"/>, proficiency: 85 },
    { name: "Firebase", category: "Backend & Cloud", icon: <Cloud size={24} className="text-red-400"/>, proficiency: 75 },
    { name: "Google Cloud", category: "Backend & Cloud", icon: <Cloud size={24} className="text-blue-500"/>, proficiency: 70 },
    { name: "Git", category: "Tools", icon: <GitMerge size={24} className="text-gray-400"/>, proficiency: 90 },
    { name: "Kotlin", category: "Languages", icon: <Code size={24} className="text-indigo-400"/>, proficiency: 70 },
    { name: "C", category: "Languages", icon: <Code size={24} className="text-gray-500"/>, proficiency: 75 },
    { name: "Bootstrap5", category: "Frontend", icon: <Palette size={24} className="text-purple-500"/>, proficiency: 80 },
  ],
  contact: {
    intro: "I'm always excited to discuss new projects, innovative ideas, or opportunities to collaborate on something impactful. Whether you have a question or just want to say hi, feel free to reach out!",
    cta: "Let's Build Something Amazing Together!",
  }
};

export const typewriterWords = [ 
    personalData.title, 
    "Crafting AI solutions for real-world impact.", 
    "Building scalable Web3 applications.", 
    "Designing intuitive full-stack systems.", 
    "Passionate about emerging technologies."
];
