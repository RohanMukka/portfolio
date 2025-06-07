import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { HeroProps } from "../../types";
import Section from "../common/Section";
import InfinitySymbol from "../common/InfinitySymbol";
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
      transition: { staggerChildren: 0.2, delayChildren: 0.8 },
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
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Using Tailwind arbitrary values for positioning percentages */}
        <motion.div
          className="absolute w-[50vw] h-[50vw] max-w-xl max-h-xl bg-black/20 rounded-full filter blur-3xl opacity-60 top-[5%] left-[10%]"
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "0%", "-10%"],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[40vw] h-[40vw] max-w-lg max-h-lg bg-black/20 rounded-full filter blur-3xl opacity-50 bottom-[10%] right-[15%]"
          animate={{
            x: ["10%", "-5%", "10%"],
            y: ["15%", "5%", "15%"],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute w-[30vw] h-[30vw] max-w-md max-h-md bg-black/10 rounded-full filter blur-2xl opacity-40 top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2"
          animate={{
            x: ["0%", "5%", "-5%", "0%"],
            y: ["-5%", "10%", "0%", "-5%"],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>
      <motion.div
        className="flex flex-col items-center justify-center text-center relative z-10 h-full pt-20 md:pt-0"
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
          <InfinitySymbol className="w-full h-full" />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-4 leading-tight inline-flex items-center"
          data-cursor-hover-text
        >
          Hi, I'm{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-400">
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
            Download CV <Download size={20} />
          </motion.a>
        </motion.div>
      </motion.div>
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
