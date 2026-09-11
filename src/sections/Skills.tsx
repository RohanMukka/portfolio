import React from "react";
import {
  Code,
  Terminal,
  Globe,
  Server,
  Layers,
  Cpu,
  Database,
  Braces,
  ShieldCheck,
  Network,
  Waypoints,
  AudioLines,
  Sparkles,
  MonitorSmartphone,
} from "lucide-react";
import {
  siPython,
  siCplusplus,
  siJavascript,
  siTypescript,
  siKotlin,
  siHtml5,
  siGithub,
  siGitlab,
  siKubernetes,
  siDocker,
  siPycharm,
  siJenkins,
  siReact,
  siNodedotjs,
  siFirebase,
  siGooglecloud,
  siTensorflow,
  siScikitlearn,
  siAngular,
  siNextdotjs,
  siLinux,
  siGit,
  siMysql,
} from "simple-icons";
import TechIcon, { SimpleIcon } from "../components/TechIcon";
import Reveal from "../components/Reveal";
import { useTilt } from "../lib/useTilt";
import "./Skills.css";

type Item = { name: string; icon: SimpleIcon } | { name: string; node: React.ReactNode };

interface SkillGroup {
  category: string;
  accent: string;
  icon: React.ReactNode;
  items: Item[];
}

const lucide = (node: React.ReactNode) => node;

const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    accent: "var(--hue-blue)",
    icon: <Code size={20} />,
    items: [
      { name: "Python", icon: siPython },
      { name: "Java", node: lucide(<Braces size={24} />) },
      { name: "C / C++", icon: siCplusplus },
      { name: "JavaScript", icon: siJavascript },
      { name: "TypeScript", icon: siTypescript },
      { name: "SQL", icon: siMysql },
      { name: "Kotlin", icon: siKotlin },
      { name: "HTML / CSS", icon: siHtml5 },
    ],
  },
  {
    category: "Developer Tools",
    accent: "var(--hue-purple)",
    icon: <Terminal size={20} />,
    items: [
      { name: "GitHub", icon: siGithub },
      { name: "GitLab", icon: siGitlab },
      { name: "Docker", icon: siDocker },
      { name: "Kubernetes", icon: siKubernetes },
      { name: "AWS", node: lucide(<Server size={24} />) },
      { name: "Jenkins", icon: siJenkins },
      { name: "PyCharm", icon: siPycharm },
    ],
  },
  {
    category: "Frameworks",
    accent: "var(--hue-pink)",
    icon: <Globe size={20} />,
    items: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "Node.js", icon: siNodedotjs },
      { name: "Angular", icon: siAngular },
      { name: "Firebase", icon: siFirebase },
      { name: "Google Cloud", icon: siGooglecloud },
      { name: "TensorFlow", icon: siTensorflow },
      { name: "scikit-learn", icon: siScikitlearn },
    ],
  },
  {
    category: "Platforms",
    accent: "var(--hue-orange)",
    icon: <Server size={20} />,
    items: [
      { name: "Linux", icon: siLinux },
      { name: "Windows", node: lucide(<MonitorSmartphone size={24} />) },
      { name: "Git", icon: siGit },
    ],
  },
  {
    category: "Concepts",
    accent: "var(--hue-green)",
    icon: <Layers size={20} />,
    items: [
      { name: "REST APIs", node: lucide(<Network size={24} />) },
      { name: "Full-stack", node: lucide(<Layers size={24} />) },
      { name: "Machine Learning", node: lucide(<Waypoints size={24} />) },
      { name: "Databases", node: lucide(<Database size={24} />) },
      { name: "Security", node: lucide(<ShieldCheck size={24} />) },
    ],
  },
  {
    category: "Specialized",
    accent: "var(--hue-cyan)",
    icon: <Cpu size={20} />,
    items: [
      { name: "AI Infrastructure", node: lucide(<Cpu size={24} />) },
      { name: "Speech & Audio", node: lucide(<AudioLines size={24} />) },
      { name: "Generative AI", node: lucide(<Sparkles size={24} />) },
    ],
  },
];

interface SkillCardProps {
  group: SkillGroup;
  index: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ group, index }) => {
  const tilt = useTilt(6);

  return (
    <Reveal
      className="skill-card"
      delay={index * 0.07}
      style={{ ["--accent-group" as string]: group.accent }}
    >
      <div className="skill-rig surface" data-elev="2" {...tilt}>
        <div className="skill-head">
          <span className="skill-badge">{group.icon}</span>
          <h3 className="text-lg font-display font-bold text-primary-text">
            {group.category}
          </h3>
          <span className="skill-count">{group.items.length}</span>
        </div>

        <ul className="skill-items">
          {group.items.map((item) => (
            <li key={item.name} className="skill-item">
              <span className="skill-item-mark">
                {"icon" in item ? (
                  <TechIcon icon={item.icon} size={24} />
                ) : (
                  item.node
                )}
              </span>
              <span className="skill-item-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
};

const Skills = () => (
  <section id="skills" className="py-24 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <Reveal className="text-center mb-14">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-text mb-4">
          Technical Arsenal
        </h2>
        <p className="text-primary-secondary text-lg max-w-2xl mx-auto">
          A curated selection of technologies I've worked with.
        </p>
      </Reveal>

      <div className="skill-grid">
        {skillGroups.map((group, index) => (
          <SkillCard key={group.category} group={group} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
