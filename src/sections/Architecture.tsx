import React from "react";
import SectionHeader from "../components/SectionHeader";
import AboutPath from "./about/AboutPath";
import { TITLE } from "./about/chapters";

const Architecture = () => (
  <section id="architecture" data-chapter="about" className="relative pt-20 md:pt-32 pb-12">
    <SectionHeader className="max-w-6xl mx-auto px-6 mb-12 md:mb-16" index="01" label="About" title={TITLE} />
    <AboutPath />
  </section>
);

export default Architecture;
