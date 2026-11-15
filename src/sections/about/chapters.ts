// About's copy. Every fact is from the résumé or projects.ts; Credentials
// covers the degrees, so About tells the path.
import { DEVPOST } from "./content";

export const TITLE = "Six years,\n*two countries*.";

export const INTRO =
  "I'm Rohan. I studied computer science in Hyderabad, took an ML internship the summer I graduated, and crossed the world to Oklahoma for the M.S. This is the path, and what I built along it.";

export type Chapter = {
  /** When, and where: the chapter's label in the intro's list. */
  when: string;
  where: string;
  kicker: string;
  heading: string;
  body: string;
  link?: { label: string; href: string };
};

export const CHAPTERS: Chapter[] = [
  {
    when: "2020 — 2024",
    where: "Hyderabad",
    kicker: "Where it started",
    heading: "Computer science in Hyderabad, with a minor in AI/ML.",
    body: "Four years at CVR College of Engineering, finished at 9.1/10. One of my last projects there was a diagnostic system that tries medical rules first and falls back to a learned model when they can't decide.",
  },
  {
    when: "Summer 2024",
    where: "Internpe, remote",
    kicker: "First real work",
    heading: "An ML engineering internship, the summer I graduated.",
    body: "I tuned predictive models in Python, TensorFlow and scikit-learn until they were 20% more accurate, and reworked their preprocessing so they trained 15% faster.",
  },
  {
    when: "2024 — 2026",
    where: "Oklahoma",
    kicker: "The move",
    heading: "Then across the world, for the M.S. at Oklahoma.",
    body: "Class projects became systems: OU's internship management system with a team, BEneFIT's ETH-staked fitness goals, and the RAG, streaming and MLOps work below.",
  },
  {
    when: "Alongside",
    where: "Research",
    kicker: "Research",
    heading: "22 languages, and four emotions read from EEG.",
    body: "A SemEval 2026 Task 9 study with Kamal Poshala and Kushi Reddy Kankar compared mBERT, mT5, LoRA adapters and LLM prompting on polarization; multilingual LoRA generalized best. The EEG model fuses a random forest with a CNN: about 90% accurate.",
  },
  {
    when: "Always",
    where: "Outside code",
    kicker: "Outside code",
    heading: "500+ algorithm problems, hackathons, 50+ students mentored.",
    body: "I compete in and organise hackathons, and taught web development at the GDSC bootcamp.",
    link: { label: "Hackathon work on Devpost", href: DEVPOST },
  },
];
