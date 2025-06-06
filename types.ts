import React from 'react';

export interface Strength {
  icon: React.ReactElement<any>;
  text: string;
}

export interface AboutData {
  greeting: string;
  bio: string[];
  profileImageUrl: string;
  strengths: Strength[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
  icon: React.ReactElement<any>;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  icon: React.ReactElement<any>;
  duration?: string;
}

export interface Skill {
  name:string;
  category: string;
  icon: React.ReactElement<any>;
  proficiency: number;
}

export interface ContactData {
  intro: string;
  cta: string;
}

export interface PersonalData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  about: AboutData;
  experience: ExperienceItem[];
  projects: Project[];
  skills: Skill[];
  contact: ContactData;
}

// Component Props
export interface SectionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  fullHeight?: boolean;
  refProp?: React.RefObject<HTMLElement>;
}

export interface LottieAnimationProps {
  animationData: any; 
  loop?: boolean;
  className?: string;
}

export interface NavbarProps {
  setActiveSection: (section: string) => void;
  currentSection: string;
  personalData: Pick<PersonalData, 'name' | 'resumeUrl'>;
  scrollToSection: (id: string) => void;
}

export interface HeroProps {
  scrollToSection: (id: string) => void;
  refProp: React.RefObject<HTMLElement>;
  personalData: Pick<PersonalData, 'name' | 'title' | 'resumeUrl'>;
  typewriterWords: string[];
  placeholderLottieData: any;
}

export interface AboutProps {
  refProp: React.RefObject<HTMLElement>;
  personalData: Pick<PersonalData, 'name' | 'about' | 'resumeUrl'>;
}

export interface SkillsProps {
  refProp: React.RefObject<HTMLElement>;
  skills: Skill[];
}

export interface ProjectCardProps {
  project: Project;
}

export interface ProjectsProps {
  refProp: React.RefObject<HTMLElement>;
  projects: Project[];
}

export interface ExperienceProps {
  refProp: React.RefObject<HTMLElement>;
  experience: ExperienceItem[];
}

export interface ContactProps {
  refProp: React.RefObject<HTMLElement>;
  personalData: Pick<PersonalData, 'email' | 'linkedin' | 'github' | 'contact'>;
}

export interface PreloaderProps {
  onLoaded: () => void;
}

export interface FooterProps {
   personalData: Pick<PersonalData, 'name' | 'github' | 'linkedin' | 'email'>;
}