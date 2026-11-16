"use client";

import React from "react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";

export default function Skills() {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const tSections = translations[language].sections;

  // Backward compatibility migration for older storage format
  const rawSkills = profile.skills;
  const categoriesList: { title: string; items: string[] }[] = Array.isArray(rawSkills)
    ? rawSkills
    : [
        { title: "Backend Development", items: (rawSkills as Record<string, string[]> | undefined)?.backend || [] },
        { title: "Frontend & Mobile", items: (rawSkills as Record<string, string[]> | undefined)?.frontendMobile || [] },
        { title: "AI / Machine Learning", items: (rawSkills as Record<string, string[]> | undefined)?.aiMl || [] },
        { title: "Databases & Cache", items: (rawSkills as Record<string, string[]> | undefined)?.databases || [] },
        { title: "DevOps & Tools", items: (rawSkills as Record<string, string[]> | undefined)?.devOpsTools || [] },
        { title: "Architecture & Standards", items: (rawSkills as Record<string, string[]> | undefined)?.architectureCertifications || [] }
      ].filter((c): c is { title: string; items: string[] } => !!c.items && c.items.length > 0);

  return (
    <Section id="skills" title={tSections.skillsTitle} subtitle={tSections.skillsSubtitle} tone="band">
      {/* Laid out like an Apple tech-specs table: label column, values column, hairlines between. */}
      <dl className="border-b border-border-color">
        {categoriesList.map((cat, idx) => (
          <Reveal
            key={cat.title}
            delay={idx * 50}
            className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-8 gap-y-3 border-t border-border-color py-7"
          >
            <dt className="font-display text-[21px] font-semibold tracking-[-0.01em] text-text-primary">
              {cat.title}
            </dt>
            <dd className="flex flex-wrap gap-x-7 gap-y-2 text-[17px] text-text-primary md:pt-0.5">
              {cat.items.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
