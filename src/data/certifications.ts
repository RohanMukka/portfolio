export interface Certification {
  name: string;
  issuer: string;
  issued: string; // "Mon YYYY"
  expires?: string;
  skills?: string[];
}

const certifications: Certification[] = [
  {
    name: "Oracle Certified Professional: Generative AI",
    issuer: "Oracle",
    issued: "Oct 2025",
    expires: "Oct 2027",
    skills: ["Generative AI"],
  },
  {
    name: "Networking Essentials",
    issuer: "Cisco Networking Academy",
    issued: "Dec 2022",
  },
  {
    name: "Introduction to Java and Object-Oriented Programming",
    issuer: "University of Pennsylvania",
    issued: "Dec 2021",
    skills: ["Java", "Object-Oriented Programming (OOP)"],
  },
  {
    name: "Java Full Stack",
    issuer: "Wipro",
    issued: "Oct 2023",
    skills: ["Java"],
  },
  {
    name: "Python Data Structures",
    issuer: "University of Michigan",
    issued: "Jan 2022",
    skills: ["Data Structures", "Python"],
  },
  {
    name: "Artificial Intelligence Foundation",
    issuer: "Wipro",
    issued: "Mar 2023",
    skills: ["Artificial Intelligence (AI)"],
  },
];

const time = (c: Certification) => new Date(`1 ${c.issued}`).getTime();

// Newest first.
export const certificationsByDate = [...certifications].sort((a, b) => time(b) - time(a));

export const yearOf = (c: Certification) => c.issued.split(" ")[1];
