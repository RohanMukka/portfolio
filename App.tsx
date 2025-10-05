// FIX: Replaced placeholder content with a functional App component to build the main portfolio page structure and resolve module errors.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { ExperienceItem } from './components/ExperienceItem';
import { ProjectCard } from './components/ProjectCard';
import { SkillBadge } from './components/SkillBadge';
import { certificationsData, educationData, experienceData, projectData, skillsData } from './data';
import { useScrollSpy } from './hooks/useScrollSpy';
import { ChevronLeftIcon } from './components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from './components/icons/ChevronRightIcon';

const App: React.FC = () => {
    const sectionIds = ['about', 'experience', 'projects', 'skills', 'education', 'certifications', 'extracurricular'];
    const activeSection = useScrollSpy(sectionIds);

    const [currentProjectPage, setCurrentProjectPage] = useState(0);
    const projectsPerPage = 3;
    const totalProjectPages = Math.ceil(projectData.length / projectsPerPage);

    const handlePrevProjects = () => {
        setCurrentProjectPage(prev => Math.max(prev - 1, 0));
    }
    const handleNextProjects = () => {
        setCurrentProjectPage(prev => Math.min(prev + 1, totalProjectPages - 1));
    }

    const startIndex = currentProjectPage * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const visibleProjects = projectData.slice(startIndex, endIndex);


    return (
        <div className="bg-slate-900 leading-relaxed text-slate-400 antialiased selection:bg-sky-300 selection:text-sky-900">
            <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
                <div className="lg:flex lg:justify-between lg:gap-4">
                    <Header activeSection={activeSection} />
                    <main id="content" className="pt-24 lg:w-1/2 lg:py-24">
                        <Section id="about" title="About">
                             <p className="mb-4">
                                Back in 2020, I started my journey into the world of computer science, quickly discovering a passion for building things that solve real-world problems. What began with simple command-line tools has since evolved into developing full-stack applications and exploring the fascinating realm of machine learning.
                            </p>
                            <p className="mb-4">
                                Currently pursuing my Master's in Computer Science, I am focused on building scalable and intelligent applications. I thrive on the challenge of transforming complex requirements into user-friendly solutions, whether it's developing a decentralized fitness app or an intelligent diagnostic system. My goal is to not only write clean code but also to build products that make a meaningful impact.
                            </p>
                            <p>
                                When I'm not at my computer, I'm usually exploring new hiking trails, experimenting with new recipes in the kitchen, or diving into a good sci-fi novel. I believe that a balanced life fuels creativity and I'm always looking for new experiences to inspire my next project.
                            </p>
                        </Section>

                        <Section id="experience" title="Experience">
                            <ul className="group/list">
                                {experienceData.map((exp, index) => (
                                    <li key={index} className="mb-12">
                                        <ExperienceItem {...exp} />
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        <Section id="projects" title="Projects">
                            <div className="flex justify-end gap-4 mb-4">
                                <button
                                    onClick={handlePrevProjects}
                                    disabled={currentProjectPage === 0}
                                    className="disabled:opacity-25 disabled:cursor-not-allowed text-slate-400 hover:text-sky-400 transition-colors"
                                    aria-label="Previous projects"
                                >
                                    <ChevronLeftIcon className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={handleNextProjects}
                                    disabled={currentProjectPage === totalProjectPages - 1}
                                    className="disabled:opacity-25 disabled:cursor-not-allowed text-slate-400 hover:text-sky-400 transition-colors"
                                    aria-label="Next projects"
                                >
                                    <ChevronRightIcon className="w-8 h-8" />
                                </button>
                            </div>
                             <AnimatePresence mode="wait">
                                <motion.ul
                                    key={currentProjectPage}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="group/list"
                                >
                                    {visibleProjects.map((project, index) => (
                                        <li key={startIndex + index} className="mb-12">
                                            <ProjectCard {...project} />
                                        </li>
                                    ))}
                                </motion.ul>
                            </AnimatePresence>
                        </Section>
                        
                        <Section id="skills" title="Skills">
                            {skillsData.map((category, index) => (
                                <div key={index} className="mb-8">
                                <h3 className="text-lg font-medium text-slate-200 mb-4">{category.category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, i) => (
                                    <SkillBadge key={i} skill={skill} />
                                    ))}
                                </div>
                                </div>
                            ))}
                        </Section>

                        <Section id="education" title="Education">
                            {educationData.map((edu, index) => (
                                <div key={index} className="mb-6">
                                    <h3 className="text-lg font-medium text-slate-200">{edu.institution}</h3>
                                    <p className="text-md text-slate-300">{edu.degree}</p>
                                    <p className="text-sm text-slate-500">{edu.period}</p>
                                    {edu.details && <p className="text-sm text-slate-400 mt-1">{edu.details}</p>}
                                </div>
                            ))}
                        </Section>

                        <Section id="certifications" title="Certifications">
                            <ul className="space-y-2">
                                {certificationsData.map((cert, index) => (
                                    <li key={index}>
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-medium text-slate-200 hover:text-sky-400 transition-colors group">
                                            <span>{cert.name}</span>
                                            <span className="text-slate-500 mx-2">&middot;</span>
                                            <span className="text-slate-400 group-hover:text-slate-200">{cert.issuer}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                        
                        <Section id="extracurricular" title="Extracurricular Activities">
                            <ul className="list-disc space-y-4 pl-5 text-sm">
                                <li>
                                    Organized/participated in multiple <a href="https://devpost.com/rohan-mukka-1" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-200 hover:text-sky-400 transition-colors">hackathons</a>; contributed to IEEE workshops and AI/ML projects—hands-on teamwork, rapid prototyping, and public demos.
                                </li>
                                <li>
                                    Solved <a href="https://leetcode.com/u/rohan_mukka/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-200 hover:text-sky-400 transition-colors">400+ DSA problems</a> across different platforms (discipline, persistence, and clear problem framing).
                                </li>
                                <li>
                                    Mentor, GDSC Bootcamp: guided 50+ students in web dev & problem-solving; improved peer project quality via code reviews and structured feedback.
                                </li>
                            </ul>
                        </Section>

                        <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0 mt-24">
                            <p>
                                This portfolio is a dynamic showcase of my journey in technology, continuously updated with new projects and skills. Built with React, Tailwind CSS, and Framer Motion, it reflects my commitment to modern web development practices. The code is open-source and available on <a href="https://github.com/rohanmukka" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-400 hover:text-sky-400">GitHub</a>.
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default App;