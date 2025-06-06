
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ListChecks, Send } from 'lucide-react';
import { ContactProps } from '../../types';
import Section from '../common/Section';

const Contact: React.FC<ContactProps> = ({ refProp, personalData }) => {
  const sectionTitleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ // Add type for i
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.15 }
    })
  };

  const contactMethods = [
    { icon: <Mail size={28} className="text-pink-400"/>, label: "Email Me", value: personalData.email, href: `mailto:${personalData.email}` },
    { icon: <Linkedin size={28} className="text-blue-400"/>, label: "Connect on LinkedIn", value: personalData.linkedin.split('/').pop() || personalData.linkedin, href: personalData.linkedin, target: "_blank" },
    { icon: <Github size={28} className="text-gray-500 dark:text-gray-300"/>, label: "View My GitHub", value: personalData.github.split('/').pop() || personalData.github, href: personalData.github, target: "_blank" },
    { icon: <ListChecks size={28} className="text-black"/>, label: "My LeetCode", value: personalData.leetcode.split('/').pop() || personalData.leetcode, href: personalData.leetcode, target: "_blank" },
  ];
  
  return (
    <Section id="contact" refProp={refProp} fullHeight>
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        variants={sectionTitleVariants}
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-600 to-white"
          data-cursor-hover-text
        >
          Let's Get In Touch
        </h2>
        <p
          className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6"
          data-cursor-hover-text
        >
          {personalData.contact.intro}
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
        {contactMethods.map((method, index) => (
          <motion.a
            key={method.label}
            href={method.href}
            target={method.target || "_self"}
            rel={method.target ? "noopener noreferrer" : ""}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.5 }}
            className="flex items-center p-5 md:p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-xl border border-gray-700/70 hover:border-black/80 hover:bg-gray-700/60 transition-all duration-300 group"
            data-cursor-hover-link
          >
            <div className="mr-5 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg shadow-md group-hover:bg-amber-600/50 transition-colors duration-300">
              {method.icon}
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-amber-300 transition-colors duration-300">{method.label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors duration-300 break-all">{method.value}</p>
            </div>
            <Send size={22} className="ml-auto text-gray-500 group-hover:text-black transition-all duration-300 transform group-hover:translate-x-1"/>
          </motion.a>
        ))}
      </div>
       <motion.p
        className="text-center text-xl md:text-2xl text-gray-700 dark:text-gray-300 mt-16 md:mt-20 font-semibold"
        custom={contactMethods.length}
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5 }}
        data-cursor-hover-text
       >
        {personalData.contact.cta}
       </motion.p>
    </Section>
  );
};

export default Contact;
