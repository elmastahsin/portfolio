"use client";

import React from "react";
import Section from "../ui/Section";
import TimelineRow from "../ui/TimelineRow";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";

export default function Education() {
  const { profile } = useProfile();
  const { education } = profile;
  const { language } = useLanguage();
  const tSections = translations[language].sections;

  return (
    <Section id="education" title={tSections.educationTitle} subtitle={tSections.educationSubtitle}>
      <ol className="border-b border-border-color">
        {education.map((item, idx) => (
          <TimelineRow
            key={`${item.university}-${item.dateRange}`}
            delay={idx * 60}
            meta={<>{item.dateRange}<br />{item.location}</>}
            title={item.university}
            subtitle={`${item.degree} · ${item.department}`}
          >
            {item.focus && <p className="text-text-secondary">{item.focus}</p>}
            {item.coursework && item.coursework.length > 0 && (
              <div className="mt-5">
                <h4 className="text-sm text-text-secondary">
                  {language === "tr" ? "Alınan dersler" : "Relevant coursework"}
                </h4>
                <p className="mt-1.5">{item.coursework.join(" · ")}</p>
              </div>
            )}
          </TimelineRow>
        ))}
      </ol>
    </Section>
  );
}
