import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  href,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-blue";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm",
    outline: "border border-white/20 text-white hover:bg-white/5",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
      return (
          <motion.a
            href={href}
            className={combinedClassName}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
              {children}
          </motion.a>
      )
  }

  return (
    <motion.button
      className={combinedClassName}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props as HTMLMotionProps<"button">}
    >
      {children}
    </motion.button>
  );
};

export default Button;
