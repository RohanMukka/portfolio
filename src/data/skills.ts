// Icons are remote logos; category icons were decorative and are dropped.
export interface SkillGroup { category: string; items: { name: string; icon: string }[] }

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
      { name: "Java", icon: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg" },
      { name: "C/C++", icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
      { name: "JavaScript", icon: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" },
      { name: "SQL", icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png" }, // Adjusted as SQL generic or specific DB
      { name: "Kotlin", icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" },
      { name: "HTML/CSS", icon: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" },
      { name: "TypeScript", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
      { name: "MATLAB", icon: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png" }
    ]
  },
  {
    category: "Developer Tools",
    items: [
      { name: "GitHub", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
      { name: "GitLab", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg" },
      { name: "Kubernetes", icon: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
      { name: "Docker", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
      { name: "AWS", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "PyCharm", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1d/PyCharm_Icon.svg" },
      { name: "Jenkins", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" }
    ]
  },
  {
    category: "Frameworks/Tools",
    items: [
      { name: "React.js", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
      { name: "Node.js", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
      { name: "Firebase", icon: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
      { name: "Google Cloud", icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
      { name: "TensorFlow", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg" },
      { name: "Scikit-learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
      { name: "Angular", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg" },
      { name: "Next.js", icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" }
    ]
  },
  {
    category: "Platforms",
    items: [
      { name: "Linux", icon: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" },
      { name: "Windows", icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" },
      { name: "Git", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" }
    ]
  },
  {
    category: "Concepts",
    items: [
      { name: "RESTful APIs", icon: "https://cdn-icons-png.flaticon.com/512/8297/8297437.png" }, // Generic API icon
      { name: "Fullstack", icon: "https://cdn-icons-png.flaticon.com/512/10061/10061837.png" }, // Layers
      { name: "Machine Learning", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" }, 
      { name: "NLP", icon: "https://cdn-icons-png.flaticon.com/512/12222/12222588.png" },
      { name: "Security", icon: "https://cdn-icons-png.flaticon.com/512/2716/2716652.png" } // Better security shield icon
    ]
  },
    {
    category: "Specialized Tech",
    items: [
      { name: "AI Infra", icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png" },
      { name: "Speech Audio", icon: "https://cdn-icons-png.flaticon.com/512/2883/2883162.png" },
      { name: "Gen AI", icon: "https://cdn-icons-png.flaticon.com/512/12128/12128882.png" }
    ]
  }
];
