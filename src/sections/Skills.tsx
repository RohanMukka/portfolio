import React from 'react';
import SectionHeader from '../components/SectionHeader';
import Sentence from './skills/Sentence';

const Skills = () => (
  <section id="skills" data-chapter="skills" className="py-32 px-6 relative">
    <div className="max-w-6xl mx-auto w-full relative z-10">
      <SectionHeader className="mb-16 md:mb-20" index="03" label="Skills" title={"What I\n*build with*"} />
      {/* Text on the left; the 3D stack of layers turns on the right. */}
      <div className="lg:w-[62%]">
        <Sentence />
      </div>
    </div>
  </section>
);

export default Skills;
