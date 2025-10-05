export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface ProjectLink {
  name: string;
  url: string;
}

export interface Project {
  name: string;
  period: string;
  tech?: string;
  description: string[];
  links: ProjectLink[];
  imageUrl: string;
}

export interface SkillCategory {
    category: string;
    skills: string[];
}

export interface Certification {
    name: string;
    issuer: string;
    url: string;
}
