import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectPosterProps {
  title: string;
  description: string;
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
  color?: string;
}

const ProjectPoster = ({ title, description, tags, links, color = 'rgba(255, 255, 255, 0.1)' }: ProjectPosterProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse values
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Calculate rotation based on mouse position
  // Max rotation is +/- 10 degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Calculate glare position
  // Glare moves opposite to rotation for realism
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-0.5 to 0.5)
    // 0,0 is the center
    const width = rect.width;
    const height = rect.height;
    
    const mouseXRel = e.clientX - rect.left;
    const mouseYRel = e.clientY - rect.top;
    
    const xPct = (mouseXRel / width) - 0.5;
    const yPct = (mouseYRel / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
        }}
        className="group relative h-[500px] w-full cursor-pointer rounded-[2.5rem] perspective-1000"
    >
        {/* Main Card Container with Semantic Glass */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden bg-glass-bg border border-glass-border backdrop-blur-md shadow-2xl transition-all duration-500 group-hover:border-electric-cyan/20 group-hover:shadow-[0_0_50px_var(--glass-shadow)]">
            
            {/* Top Section: Visual / Icon / Abstract art */}
            <div className="h-[55%] w-full relative p-8 flex flex-col justify-between overflow-hidden">
                 {/* Abstract Gradient Blob - Darker opacity */}
                 <div 
                    className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] rounded-full opacity-20 blur-[80px] transition-transform duration-500"
                    style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
                 />
                 
                 <div className="relative z-10 flex justify-between items-start">
                     <div className="p-4 rounded-full bg-glass-bg backdrop-blur-md border border-glass-border shadow-lg">
                        <Github className="text-primary-text w-6 h-6" />
                     </div>
                     <span className="px-4 py-2 rounded-full bg-glass-bg text-xs font-bold text-primary-text uppercase tracking-widest border border-glass-border backdrop-blur-md">
                        Featured
                     </span>
                 </div>

                 {/* Title Large */}
                 <h3 className="relative z-10 text-4xl md:text-5xl font-bold text-primary-text leading-[0.9] font-display mt-auto break-words drop-shadow-lg">
                    {title}
                 </h3>
            </div>

            {/* Bottom Section: Details */}
            <div className="h-[45%] w-full bg-glass-bg p-8 flex flex-col justify-between backdrop-blur-md">
                <p className="text-primary-secondary text-base leading-relaxed line-clamp-4 font-light">
                    {description}
                </p>

                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-glass-bg text-primary-text border border-glass-border transition-colors group-hover:bg-primary-blue/10 group-hover:border-primary-blue/30">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-glass-border">
                         {links.github && (
                            <a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-text font-medium hover:text-electric-cyan transition-colors"
                            onMouseDown={(e) => e.stopPropagation()} // Prevent card click if we attach one later
                            >
                                View Code <ArrowRight size={16} />
                            </a>
                         )}
                    </div>
                </div>
            </div>

            {/* Dynamic Glare Overlay */}
            <motion.div 
               style={{
                   background: `radial-gradient(
                       circle at ${glareX}% ${glareY}%, 
                       rgba(255,255,255,0.15), 
                       transparent 60%
                   )`
               }}
               className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]"
            />
        </div>
    </motion.div>
  );
};

export default ProjectPoster;
