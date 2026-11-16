import React from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  /** Tile sections sit on the grey band, like Apple's alternating product rows. */
  tone?: "plain" | "band";
  children: React.ReactNode;
}

export default function Section({ id, title, subtitle, tone = "plain", children }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-12 px-6 py-24 md:py-32 ${tone === "band" ? "bg-bg-tertiary/60 dark:bg-bg-secondary" : ""}`}
    >
      <div className="max-w-[1080px] mx-auto">
        <Reveal as="div" className="mb-12 md:mb-16 max-w-3xl">
          <h2 className="headline">
            {title}.{subtitle && <span className="headline-muted"> {subtitle}</span>}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
