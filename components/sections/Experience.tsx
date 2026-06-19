"use client";

import React from "react";
import Card from "../ui/Card";
import { useProfile } from "../ProfileContext";
import { Award, Briefcase, Calendar, MapPin } from "lucide-react";

export default function Experience() {
  const { profile } = useProfile();
  const { experience } = profile;

  return (
    <section id="experience" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 04. load_employment_history()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-primary">timeline</span><span className="text-text-secondary">.</span>log<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative border-l-2 border-border-color pl-6 ml-4 md:ml-8 space-y-12">
        {experience.map((item, idx) => (
          <div key={idx} className="relative">
            {/* Glow Node */}
            <div className="absolute -left-[35px] top-1.5 w-6.5 h-6.5 rounded-full border-4 border-bg-primary bg-accent-primary flex items-center justify-center text-white shadow-sm ring-4 ring-accent-primary/10">
              <Briefcase size={10} />
            </div>

            {/* Timeline Content */}
            <Card hoverEffect={true} glassmorphism={true} className="border border-border-color p-6 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-border-color">
                <div>
                  <h3 className="font-display font-bold text-xl text-text-primary leading-snug">
                    {item.role}
                  </h3>
                  <span className="font-display font-semibold text-accent-primary text-base">
                    {item.company}
                  </span>
                </div>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {item.dateRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Responsibilities list */}
              <ul className="list-disc list-outside pl-5 space-y-2 mb-6 text-sm text-text-secondary font-normal">
                {item.responsibilities.map((resp, index) => (
                  <li key={index} className="leading-relaxed">
                    {resp}
                  </li>
                ))}
              </ul>

              {/* Key Achievements Metrics Box */}
              {item.keyAchievements && item.keyAchievements.length > 0 && (
                <div className="p-4 rounded-xl bg-accent-muted/40 dark:bg-accent-muted/10 border border-accent-primary/20">
                  <h4 className="font-display font-semibold text-xs text-accent-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Award size={14} />
                    Key Measurable Achievements
                  </h4>
                  <ul className="space-y-1.5 text-xs text-text-primary">
                    {item.keyAchievements.map((ach, index) => (
                      <li key={index} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-accent-primary mt-0.5">•</span>
                        <span className="font-medium">{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
      
      {/* Closing Gutter */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
