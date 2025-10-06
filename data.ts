import type { Experience, Project, Certification, SkillCategory } from './types';

export const experienceData: Experience[] = [
  {
    role: 'ML Engineer Intern',
    company: 'Internpe',
    period: 'July 2024 - Aug 2024',
    location: 'Remote',
    description: [
      'Built and fine-tuned predictive models (Python, TensorFlow, Scikit-learn); improved accuracy by 20% and reduced training time by 15% via streamlined data prep/feature engineering.',
      'Worked cross-functionally with PMs/designers to turn ambiguous problem statements into testable prototypes, documenting findings and next steps for stakeholders.',
      'Presented insights and clear visuals (PowerPoint/Canva, Excel) during bi-weekly updates, contributing to 10% higher overall project throughput.'
    ]
  }
];

export const educationData = [
    {
        institution: 'University of Oklahoma',
        degree: 'Master of Science in Computer Science',
        period: 'Aug 2024 - May 2026',
        details: 'GPA: 4.0/4.0'
    },
    {
        institution: 'CVR College of Engineering',
        degree: 'B.Tech. in Computer Science and Engineering (Minor in AI/ML)',
        period: 'Aug 2020 - May 2024',
        details: 'GPA: 9.1/10.0'
    }
];

export const projectData: Project[] = [
    {
        name: 'BEneFIT: A Decentralized Fitness Accountability Framework',
        period: 'Aug 2025',
        description: [
            'A decentralized application that leverages ETH-staking models to boost user commitment to fitness goals, outperforming competitors in fairness and engagement.',
        ],
        links: [
            { name: 'GitHub', url: 'https://github.com/RohanMukka/BEneFIT' },
            { name: 'Demo Video', url: 'https://drive.google.com/file/d/1Q9owTK-uGbansKn5WoXiDxKAsk3fv_6N/view?usp=sharing' }
        ],
        tech: 'React, Solidity, Ethers.js, Hardhat, OAuth',
        imageUrl: `data:image/svg+xml,%3csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='400' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='48' fill='%23cbd5e1' font-weight='600'%3eBEneFIT%3c/text%3e%3c/svg%3e`
    },
    {
        name: 'Internship Program Management System',
        period: 'Jan 2025',
        tech: 'React.js, Node.js, MongoDB',
        description: [
            'A comprehensive system designed to streamline internship processes, from requests to evaluations, significantly boosting efficiency and compliance for the OU CS department.',
        ],
        links: [{ name: 'GitHub', url: 'https://github.com/RohanMukka/IPMS' }],
        imageUrl: `data:image/svg+xml,%3csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='400' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='48' fill='%23cbd5e1' font-weight='600'%3eIPMS%3c/text%3e%3c/svg%3e`
    },
    {
        name: 'A Robust Diagnostic System',
        period: 'Mar 2024',
        tech: 'Python, Protégé, SWRL',
        description: [
            'An intelligent diagnostic tool combining rule-based inference with machine learning to enhance medical accuracy, particularly in complex, inconclusive cases.',
        ],
        links: [{ name: 'GitHub', url: 'https://github.com/RohanMukka/A-Robust-Diagnostic-System-Leveraging-Explicit-Domain-Knowledge-and-Learned-Data-Patterns-' }],
        imageUrl: `data:image/svg+xml,%3csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='400' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='32' fill='%23cbd5e1' font-weight='600'%3eRobust Diagnostic System%3c/text%3e%3c/svg%3e`
    },
    {
        name: 'SpendSmart: Expense Tracker',
        period: 'Nov 2022',
        tech: 'Node.js, Express, EJS, MongoDB',
        description: [
            'A user-friendly expense tracker application designed to help users monitor their daily spending habits and manage their finances effectively.'
        ],
        links: [
            { name: 'GitHub', url: 'https://github.com/RohanMukka/spendsmart' },
            { name: 'Live URL', url: 'https://spendsmart-three.vercel.app/' }
        ],
        imageUrl: `data:image/svg+xml,%3csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='400' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='48' fill='%23cbd5e1' font-weight='600'%3eSpendSmart%3c/text%3e%3c/svg%3e`
    },
    {
        name: 'FeeAutomation Script',
        period: 'Sep 2022',
        tech: 'Python, Selenium',
        description: [
            'An automation script that streamlines the fee payment process for students at CVR College of Engineering, reducing manual effort and potential for errors.'
        ],
        links: [{ name: 'GitHub', url: 'https://github.com/RohanMukka/FeeAutomation' }],
        imageUrl: `data:image/svg+xml,%3csvg width='600' height='400' viewBox='0 0 600 400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='600' height='400' fill='%231e293b'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='40' fill='%23cbd5e1' font-weight='600'%3eFeeAutomation%3c/text%3e%3c/svg%3e`
    }
];

export const skillsData: SkillCategory[] = [
    { category: 'Languages', skills: ['Python', 'Java', 'C/C++', 'JavaScript/TypeScript', 'SQL', 'Kotlin', 'HTML/CSS'] },
    { category: 'Frameworks/Tools', skills: ['React.js', 'Node.js', 'Next.js', 'TensorFlow', 'Scikit-learn', 'Firebase', 'Django'] },
    { category: 'DevOps/Cloud', skills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'CI/CD', 'GitHub/GitLab'] },
    { category: 'Concepts', skills: ['RESTful APIs', 'Full-stack Web Dev', 'ML/AI', 'Distributed Systems', 'NLP', 'Security'] },
];

export const certificationsData: Certification[] = [
    { name: 'Python Data Structures', issuer: 'University of Michigan', url: 'https://www.coursera.org/account/accomplishments/verify/QXGV6SBWGYM9' },
    { name: 'Artificial Intelligence Foundation', issuer: 'Wipro', url: 'https://cert.diceid.com/fsn/cid/zyxOFx' },
    { name: 'Networking Essentials', issuer: 'Cisco', url: 'https://drive.google.com/file/d/1eZI5kQ-rogEl7H5Fz46xGvxbxaNXEjVy/view?usp=drivesdk' },
    { name: 'Java Full Stack', issuer: 'Wipro', url: 'https://cert.diceid.com/csr/cid/jBonSK' },
    { name: 'Java and OOP', issuer: 'University of Pennsylvania', url: 'https://www.coursera.org/account/accomplishments/verify/YRM6FSDBSGDJ' }
];