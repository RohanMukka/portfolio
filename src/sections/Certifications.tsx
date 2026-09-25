import React from "react";
import SectionHeader from "../components/SectionHeader";
import { useDemoVariant } from "../lib/demoVariant";
import CertList from "./certs/CertList";
import CertTimeline from "./certs/CertTimeline";
import CertBadges from "./certs/CertBadges";
import CertStack from "./certs/CertStack";
import CertPapers from "./certs/CertPapers";
import CertAccordion from "./certs/CertAccordion";

type CertsVariant = "list" | "timeline" | "badges" | "stack" | "papers" | "accordion";

const VIEWS: Record<CertsVariant, () => React.ReactElement> = {
  list: CertList,
  timeline: CertTimeline,
  badges: CertBadges,
  stack: CertStack,
  papers: CertPapers,
  accordion: CertAccordion,
};

const Certifications = () => {
  const variant = useDemoVariant<CertsVariant>("certs", "list");
  const View = VIEWS[variant] ?? CertList;

  return (
    <section id="certifications" className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader
          className="mb-12 md:mb-16"
          index="05"
          label="Certifications"
          title="Credentials"
          subtitle="Continuous learning and professional credentials."
        />
        <View />
      </div>
    </section>
  );
};

export default Certifications;
