import React, { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import Sentence, { SkillGroups, paintedAt } from './skills/Sentence';
import { stageState } from '../stage/store';

// The sentence paints over this stretch of the pinned scene's scroll.
const PAINT = [0.06, 0.86];

// The 3D stack's layers, top to bottom, and the tool in the sentence whose
// lighting up locks each one into place: the stage builds the stack as the
// sentence is read.
const LAYER_TOOLS = ['React.js', 'Node.js', 'Docker', 'TensorFlow'];
stageState.layerAt = LAYER_TOOLS.map((tool) => PAINT[0] + paintedAt(tool) * (PAINT[1] - PAINT[0]));

const Skills = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] });
  const paint = useTransform(scrollYProgress, PAINT, [0, 1]);

  return (
    <section id="skills" data-chapter="skills" className="relative pt-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader index="03" label="Skills" title={"What I\n*build with*"} />
      </div>

      {/* The sentence holds still while it paints; the stack beside it
          builds a layer each time a layer's tool lights up. */}
      <div ref={sceneRef} data-progress="skills" className="relative h-[260vh]">
        <div className="sticky top-0 h-[100dvh] flex items-center">
          <div className="max-w-6xl mx-auto w-full px-6">
            <div className="lg:w-[62%]">
              <Sentence progress={paint} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="lg:w-[62%]">
          <SkillGroups />
        </div>
      </div>
    </section>
  );
};

export default Skills;
