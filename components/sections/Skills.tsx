
import React from 'react';
import { motion } from 'framer-motion';
import { SkillsProps, Skill } from '../../types';
import Section from '../common/Section';
import { Code, Settings2, BrainCircuit, Database, Palette, Cloud, Briefcase as BriefcaseIcon } from 'lucide-react'; // Renamed to avoid conflict

const Skills: React.FC<SkillsProps> = ({ refProp, skills }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const sectionTitleVariants = { 
    hidden: { opacity: 0, y: -20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  const categoryContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const categoryCardVariants = { 
    hidden: { opacity: 0, x: -50 }, 
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  const skillItemVariants = { 
    hidden: { opacity: 0, y: 20, scale: 0.9 }, 
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } } 
  };


  const categoryIcons: Record<string, React.ReactElement> = {
    "Languages": <Code size={28} className="mr-3 text-yellow-400" />,
    "Frameworks & Libraries": <Settings2 size={28} className="mr-3 text-green-400" />,
    "AI/ML": <BrainCircuit size={28} className="mr-3 text-fuchsia-400" />,
    "Databases": <Database size={28} className="mr-3 text-blue-500" />,
    "Frontend": <Palette size={28} className="mr-3 text-pink-400" />,
    "Backend & Cloud": <Cloud size={28} className="mr-3 text-teal-300" />,
    "Tools": <BriefcaseIcon size={28} className="mr-3 text-gray-400" />, // Use renamed import
  };

  return (
    <Section id="skills" refProp={refProp}>
      <motion.div 
        className="text-center mb-16 md:mb-20" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }} 
        variants={sectionTitleVariants}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400" data-cursor-hover-text>
          My Technical Arsenal
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-cursor-hover-text>
          A collection of technologies and tools I excel in and use to build innovative solutions.
        </p>
      </motion.div>

      <motion.div className="space-y-12 md:space-y-16" variants={categoryContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
        {Object.entries(skillsByCategory).map(([category, skillsList]) => (
          <motion.div 
            key={category} 
            variants={categoryCardVariants}
            className="p-6 md:p-8 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50"
          >
            <motion.h3
              className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 md:mb-8 flex items-center"
              variants={skillItemVariants} // Animate title as well
              data-cursor-hover-text
            >
              {categoryIcons[category] || <BriefcaseIcon size={28} className="mr-3 text-gray-400"/>}
              {category}
            </motion.h3>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              variants={categoryContainerVariants} // Stagger children for skill items
            >
              {skillsList.map((skill, index) => (
                <motion.div 
                  key={skill.name} 
                  className="group relative flex flex-col items-center p-4 bg-white/60 dark:bg-gray-700/50 rounded-lg shadow-lg hover:shadow-gray-500/30 transition-all duration-300 transform hover:-translate-y-1 border border-gray-600/50 hover:border-black"
                  variants={skillItemVariants} 
                  data-cursor-hover-link
                >
                  {skill.icon && React.cloneElement(skill.icon, { size: 40, className: `mb-3 group-hover:scale-110 transition-transform duration-300 ${skill.icon.props.className || ''}` })}
                  <span className="text-md md:text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-gray-300 transition-colors duration-300 text-center">{skill.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default Skills;
