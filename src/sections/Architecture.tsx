import React from "react";
import SectionHeader from "../components/SectionHeader";
import AboutSideways from "./about/AboutSideways";

const Architecture = () => (
  <section id="architecture" className="relative pt-20 md:pt-32 pb-12">
    <SectionHeader className="max-w-6xl mx-auto px-6 mb-12 md:mb-16" index="01" label="About" title="Journey" />
    <AboutSideways />
  </section>
);

export default Architecture;
