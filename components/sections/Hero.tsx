import React from "react";
import { motion } from "framer-motion";
import { Download, ChevronDown } from "lucide-react";
import { HeroProps } from "../../types";
import Section from "../common/Section";
//import InfinitySymbol from "../common/InfinitySymbol";
import { useTypewriter } from "../../hooks/useTypewriter";

const Hero: React.FC<HeroProps> = ({
  scrollToSection,
  refProp,
  personalData,
  typewriterWords,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };
  const lottieItemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 10, delay: 1 },
    },
  };

  const typedText = useTypewriter(typewriterWords);

  return (
    <Section id="home" fullHeight refProp={refProp}>
      <motion.div
        className="flex flex-col items-center justify-center text-center relative z-10 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={lottieItemVariants}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-56 h-56 md:w-72 md:h-72 mb-6 md:mb-8"
        >
          
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-4 leading-tight inline-flex items-center"
          data-cursor-hover-text
        >
          <span className="mr-2">Hi, I'm</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 mr-2">
            {personalData.name.split(" ")[0]}
          </span>
          <span
            className="wave-emoji ml-2 md:ml-3 text-3xl md:text-4xl lg:text-5xl align-middle"
            role="img"
            aria-label="waving hand"
          >
            👋
          </span>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-mono mb-2 sm:mb-3 text-center"
        >
          {personalData.title}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-xl md:max-w-2xl mb-8 md:mb-10 font-mono h-16 md:h-auto min-h-[4rem] md:min-h-[auto] text-center"
          data-cursor-hover-text
        >
          <span>{typedText}</span>
          <span className="animate-pulse">_</span>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-6"
        >
          <motion.button
            onClick={() => scrollToSection("projects")}
            className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-md md:text-lg"
            whileHover={{ boxShadow: "0px 0px 25px rgba(0, 0, 0, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            data-cursor-hover-link
          >
            View My Work
          </motion.button>
          <motion.a
            href={personalData.resumeUrl}
            download
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 text-md md:text-lg"
            whileHover={{
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            data-cursor-hover-link
          >
            Download Resume <Download size={20} />
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 text-gray-800 dark:text-gray-200 animate-bounce"
        whileHover={{ scale: 1.1 }}
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </motion.button>
      {/* Wave animation style tag - Tailwind doesn't directly support keyframes without config */}
      <style>{`
        .wave-emoji {
          display: inline-block;
          animation: wave-animation 2.5s infinite;
          transform-origin: 70% 70%; 
        } 
        @keyframes wave-animation { 
          0% { transform: rotate(0.0deg) } 
          10% { transform: rotate(14.0deg) } 
          20% { transform: rotate(-8.0deg) } 
          30% { transform: rotate(14.0deg) } 
          40% { transform: rotate(-4.0deg) } 
          50% { transform: rotate(10.0deg) } 
          60% { transform: rotate(0.0deg) } 
          100% { transform: rotate(0.0deg) } 
        }
      `}</style>
    </Section>
  );
};

export default Hero;
