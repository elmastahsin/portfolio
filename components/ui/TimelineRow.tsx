import React from "react";
import Reveal from "./Reveal";

interface TimelineRowProps {
  meta: React.ReactNode;
  title: string;
  subtitle?: string;
  delay?: number;
  children?: React.ReactNode;
}

/** One entry in a dated list: when/where on the left, what on the right. */
export default function TimelineRow({ meta, title, subtitle, delay = 0, children }: TimelineRowProps) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-8 gap-y-2 border-t border-border-color py-9"
    >
      <div className="text-[15px] leading-relaxed text-text-secondary md:pt-1">{meta}</div>
      <div>
        <h3 className="font-display font-semibold text-[24px] leading-tight tracking-[-0.015em] text-text-primary">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-[17px] text-text-secondary">{subtitle}</p>}
        {children && <div className="mt-5 text-[17px] leading-relaxed text-text-primary">{children}</div>}
      </div>
    </Reveal>
  );
}
