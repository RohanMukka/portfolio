
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CalendarDays } from 'lucide-react'; // Assuming Briefcase is a default icon
import { ExperienceProps } from '../../types';
import Section from '../common/Section';

const Experience: React.FC<ExperienceProps> = ({ refProp, experience }) => {
  const sectionTitleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({ // Add type for i
      opacity: 1, x: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.2 }
    })
  };

  return (
    <Section id="experience" refProp={refProp}>
      <motion.div
        className="text-center mb-16 md:mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionTitleVariants}
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400"
          data-cursor-hover-text
        >
          My Journey & Milestones
        </h2>
        <p
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          data-cursor-hover-text
        >
          A timeline of my educational background and professional experiences.
        </p>
      </motion.div>

      <div className="relative max-w-3xl mx-auto"> {/* Constrain width for timeline readability */}
        {/* Vertical line for the timeline */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-700/50 rounded-full transform md:-translate-x-1/2"></div>

        {experience.map((exp, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={timelineItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className={`mb-12 flex items-start w-full relative 
                        ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} // Alternating sides on desktop
          >
            {/* Icon Circle - positioned absolutely relative to this item, then adjusted by margin/padding of content */}
            <div className={`z-10 absolute left-4 md:left-1/2 top-1 transform -translate-x-1/2
                            ${index % 2 === 0 ? 'md:translate-x-[-50%]' : 'md:translate-x-[-50%]'}
                            p-3 bg-gray-700 rounded-full shadow-xl border-2 border-black flex items-center justify-center`}
            >
              {exp.icon
                ? React.cloneElement(exp.icon, {
                    size: 22,
                    className: exp.icon.props.className || 'text-white',
                  })
                : <Briefcase size={22} className="text-white"/>}
            </div>
            
            {/* Spacer for desktop to push content to one side */}
            <div className="hidden md:block w-1/2"></div>


            {/* Content Card */}
            <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'ml-12 md:ml-8' : 'ml-12 md:mr-8 md:ml-0'} `}>
              <div className="p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 hover:border-black/70 transition-colors duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-black dark:text-gray-100 mb-1" data-cursor-hover-text>{exp.role}</h3>
                <p className="text-md text-gray-300 mb-2" data-cursor-hover-text>{exp.company}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center" data-cursor-hover-text>
                  <CalendarDays size={14} className="mr-2 text-gray-500"/> {exp.duration}
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed" data-cursor-hover-text>{exp.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Experience;
