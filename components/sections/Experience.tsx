"use client";

import React from "react";
import Section from "../ui/Section";
import TimelineRow from "../ui/TimelineRow";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";

export default function Experience() {
  const { profile } = useProfile();
  const { experience } = profile;
  const { language } = useLanguage();
  const tLabels = translations[language].labels;
  const tSections = translations[language].sections;

  return (
    <Section id="experience" title={tSections.experienceTitle} subtitle={tSections.experienceSubtitle} tone="band">
      <ol className="border-b border-border-color">
        {experience.map((item, idx) => (
          <TimelineRow
            key={`${item.company}-${item.dateRange}`}
            delay={idx * 60}
            meta={<>{item.dateRange}<br />{item.location}</>}
            title={item.role}
            subtitle={item.company}
          >
            <ul className="space-y-3 list-disc pl-5 marker:text-text-tertiary">
              {item.responsibilities.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
            {item.keyAchievements?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm text-text-secondary">{tLabels.keyAchievements}</h4>
                <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-accent-primary">
                  {item.keyAchievements.map((ach) => (
                    <li key={ach}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
          </TimelineRow>
        ))}
      </ol>
    </Section>
  );
}
