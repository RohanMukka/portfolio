
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Eye } from 'lucide-react';
import { ProjectsProps, ProjectCardProps } from '../../types';
import Section from '../common/Section';

// ProjectCard Component - defined outside Projects to avoid re-creation on parent render
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="flex flex-col bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700/60 group hover:border-black/70 transition-all duration-300 h-full">
    <div className="relative overflow-hidden h-52 md:h-60">
      <img 
        src={project.imageUrl} 
        alt={project.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
        onError={(e) => { 
          const target = e.target as HTMLImageElement;
          target.onerror = null; 
          target.src="https://placehold.co/720x400/1F2937/9CA3AF?text=Project+Image"; 
        }} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
      {project.icon && (
        <div className="absolute top-4 right-4 p-2 bg-gray-900/70 rounded-full shadow-lg">
          {React.cloneElement(project.icon, { size: 22, className: project.icon.props.className || '' })}
        </div>
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-purple-300 transition-colors" data-cursor-hover-text>
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-4 flex-grow" data-cursor-hover-text>
        {project.description}
      </p>
      {project.duration && (
        <p className="text-xs text-gray-600 dark:text-gray-500 mb-3" data-cursor-hover-text>
            Timeline: {project.duration}
        </p>
      )}
      <div className="mb-4">
        <p className="text-xs text-gray-300 mb-1 font-medium">Technologies Used:</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 text-xs bg-gray-700/50 text-gray-200 rounded-full shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700/50 flex items-center justify-start space-x-4">
        {project.githubUrl && (
          <motion.a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-black transition-colors duration-200"
            whileHover={{ scale: 1.05 }} 
            data-cursor-hover-link
          >
            <Github size={20} className="mr-2"/> Source Code
          </motion.a>
        )}
        {project.liveUrl && (
          <motion.a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
            whileHover={{ scale: 1.05 }} 
            data-cursor-hover-link
          >
            <Eye size={20} className="mr-2"/> Live Demo
          </motion.a>
        )}
      </div>
    </div>
  </div>
);

const Projects: React.FC<ProjectsProps> = ({ refProp, projects }) => {
  const sectionTitleVariants = { 
    hidden: { opacity: 0, y: -20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  
  const projectCardItemVariants = { 
    hidden: { opacity: 0, y: 50, scale: 0.95 }, 
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.15 } 
    }) 
  };

  return (
    <Section id="projects" refProp={refProp}>
      <motion.div 
        className="text-center mb-16 md:mb-20" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }} 
        variants={sectionTitleVariants}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400" data-cursor-hover-text>
          My Featured Creations
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-cursor-hover-text>
          Here's a selection of projects that showcase my skills and passion for building.
        </p>
      </motion.div>
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.1 }}
        // Staggering is implicitly handled by the delay in projectCardItemVariants
      >
        {projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            custom={index} 
            variants={projectCardItemVariants}
            className="h-full" // Ensure grid items stretch if content heights vary
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Projects;
