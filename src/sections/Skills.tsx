import React from 'react';
import SectionHeader from '../components/SectionHeader';
import Sentence from './skills/Sentence';

const Skills = () => (
  <section id="skills" className="py-32 px-6 relative overflow-hidden">
    <div className="max-w-7xl mx-auto w-full relative z-10">
      <SectionHeader
        className="mb-16 md:mb-20"
        index="03"
        label="Skills"
        title={<>Technical<br />Arsenal</>}
        subtitle="A curated selection of technologies I've mastered."
      />
      <Sentence />
    </div>
  </section>
);

export default Skills;
