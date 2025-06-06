
import React from 'react';
import { PersonalData } from './types';
import { Briefcase, Lightbulb, Code, Users, Server, BrainCircuit, Layers, Award, BookOpen, TrendingUp, ShieldCheck, Cpu, Database, Cloud, GitMerge, Palette, Zap, Target, Settings2, CalendarDays, MapPin, Send, Github, Linkedin, Mail, UserCircle } from 'lucide-react';

export const placeholderLottieData = {"v":"5.5.7","fr":30,"ip":0,"op":150,"w":512,"h":512,"nm":"Placeholder","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Shape Layer 1","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[256,256,0],"ix":2},"a":{"a":0,"k":[0,0,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[100,0],[-100,0],[0,100],[0,-100]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.6,0.2,0.8,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":150,"st":0,"bm":0}]};

export const personalData: PersonalData = {
  name: "Rohan Mukka",
  title: "MS Computer Science Student | ML Engineer",
  email: "rohan.mukka-1@ou.edu",
  phone: "+1 (405) 501-5699",
  location: "Oklahoma, United States",
  linkedin: "https://linkedin.com/in/rohanmukka",
  github: "https://github.com/rohanmukka",
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
