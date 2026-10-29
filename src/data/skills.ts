// Logos are local SVGs in public/icons, in each brand's colour, made from the
// simple-icons package (CC0). Only the tools named in the Skills sentence
// show one (on hover); tools without a logo there show none.
export interface SkillGroup { category: string; items: { name: string; icon?: string }[] }

const icon = (slug: string) => `${import.meta.env.BASE_URL}icons/${slug}.svg`;

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: icon("python") },
      { name: "Java", icon: icon("openjdk") },
      { name: "C/C++", icon: icon("cplusplus") },
      { name: "JavaScript" },
      { name: "SQL" },
      { name: "Kotlin" },
      { name: "HTML/CSS" },
      { name: "TypeScript", icon: icon("typescript") },
      { name: "MATLAB" }
    ]
  },
  {
    category: "Developer Tools",
    items: [
      { name: "GitHub", icon: icon("github") },
      { name: "GitLab" },
      { name: "Kubernetes", icon: icon("kubernetes") },
      { name: "Docker", icon: icon("docker") },
      { name: "AWS" },
      { name: "PyCharm" },
      { name: "Jenkins", icon: icon("jenkins") }
    ]
  },
  {
    category: "Frameworks/Tools",
    items: [
      { name: "React.js", icon: icon("react") },
      { name: "Node.js", icon: icon("nodedotjs") },
      { name: "Firebase", icon: icon("firebase") },
      { name: "Google Cloud", icon: icon("googlecloud") },
      { name: "TensorFlow", icon: icon("tensorflow") },
      { name: "Scikit-learn", icon: icon("scikitlearn") },
      { name: "Angular", icon: icon("angular") },
      { name: "Next.js", icon: icon("nextdotjs") }
    ]
  },
  {
    category: "Platforms",
    items: [
      { name: "Linux" },
      { name: "Windows" },
      { name: "Git" }
    ]
  },
  {
    category: "Concepts",
    items: [
      { name: "RESTful APIs" },
      { name: "Fullstack" },
      { name: "Machine Learning" },
      { name: "NLP" },
      { name: "Security" }
    ]
  },
  {
    category: "Specialized Tech",
    items: [
      { name: "AI Infra" },
      { name: "Speech Audio" },
      { name: "Gen AI" }
    ]
  }
];
