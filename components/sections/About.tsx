
import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { AboutProps } from '../../types';
import Section from '../common/Section';

const About: React.FC<AboutProps> = ({ refProp, personalData }) => {
  const { greeting, bio, profileImageUrl, strengths } = personalData.about;

  const titleVariants = { 
    hidden: { opacity: 0, y: -20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const imageVariants = { 
    hidden: { opacity: 0, scale: 0.8, rotate: -5 }, 
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, type: "spring", stiffness:100, damping:15 } } 
  };
  const textContentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const paragraphVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  const strengthItemVariants = { 
    hidden: { opacity: 0, x: -20 }, 
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } } 
  };

  return (
    <Section id="about" refProp={refProp}>
      <motion.div 
        className="text-center mb-16 md:mb-20" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }} 
        variants={titleVariants}
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400"
          data-cursor-hover-text
        >
          Discover More About Me
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-cursor-hover-text>
          A brief look into my journey, skills, and what drives my passion for technology.
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 gap-12 md:gap-16 items-center" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }}
        variants={contentContainerVariants}
      >
        <motion.div className="relative group" variants={imageVariants}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-700 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <img 
            src={profileImageUrl} 
            alt={personalData.name} 
            className="relative rounded-xl shadow-2xl w-full max-w-md mx-auto object-cover aspect-square border-4 border-gray-700" 
            data-cursor-hover-link 
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src="https://placehold.co/600x600/1A1A2E/E0E0E0?text=Image+Not+Found"; 
            }} 
          />
        </motion.div>
        
        <motion.div className="space-y-6" variants={textContentVariants}>
          <motion.h3
            className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 leading-tight"
            variants={paragraphVariants} 
            data-cursor-hover-text
          >
            {greeting}
          </motion.h3>
          {bio.map((paragraph, index) => (
            <motion.p 
              key={index} 
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-md md:text-lg"
              variants={paragraphVariants} 
              data-cursor-hover-text
            >
              {paragraph}
            </motion.p>
          ))}
          {strengths && strengths.length > 0 && (
            <motion.div className="mt-8 pt-6 border-t border-gray-700/50" variants={paragraphVariants}>
              <h4 className="text-xl font-semibold text-gray-300 mb-4" data-cursor-hover-text>Core Strengths:</h4>
              <motion.ul className="space-y-3" variants={contentContainerVariants}> {/* Stagger children for list items */}
                {strengths.map((strength, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center text-gray-700 dark:text-gray-300"
                    variants={strengthItemVariants} 
                    data-cursor-hover-text
                  >
                    {strength.icon && React.cloneElement(strength.icon, { className: `${strength.icon.props.className || ''} mr-3` })} 
                    <span>{strength.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
           <motion.a 
            href={personalData.resumeUrl} 
            download 
           className="mt-8 inline-flex items-center px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 text-md"
           whileHover={{ boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.6)" }}
            whileTap={{ scale: 0.95 }} 
            data-cursor-hover-link 
            variants={paragraphVariants}
          >
            View Full Resume <Download size={20} className="inline ml-2.5" />
          </motion.a>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default About;
