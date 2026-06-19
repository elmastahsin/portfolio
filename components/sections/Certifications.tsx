"use client";

import React from "react";
import Card from "../ui/Card";
import { useProfile } from "../ProfileContext";
import { Award, Calendar, ExternalLink, ShieldCheck } from "lucide-react";

export default function Certifications() {
  const { profile } = useProfile();
  const { certifications } = profile;

  return (
    <section id="certifications" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 06. load_achievements_credentials()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-primary">achievements</span><span className="text-text-secondary">.</span>verify<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((item, idx) => (
          <Card key={idx} hoverEffect={true} glassmorphism={true} className="flex flex-col border border-border-color justify-between p-6">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-bold text-base text-text-primary leading-snug">
                  {item.title}
                </h3>
                <span className="text-accent-primary shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </span>
              </div>

              {/* Issuer & Date */}
              <div className="flex items-center gap-3 text-xs text-text-tertiary mb-3.5">
                <span className="font-semibold text-text-secondary">{item.issuer}</span>
                <span className="text-border-color">|</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {item.date}
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-text-secondary leading-relaxed font-normal">
                  {item.description}
                </p>
              )}
            </div>

            {/* Verification Link */}
            {item.url && (
              <div className="mt-4 pt-3 border-t border-border-color">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-accent-primary hover:text-accent-secondary transition-colors"
                >
                  Verify Credential
                  <ExternalLink size={11} />
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
      
      {/* Closing Gutter */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
