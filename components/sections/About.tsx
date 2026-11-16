"use client";

import React from "react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";

export default function About() {
  const { profile } = useProfile();
  const { about, location } = profile;
  const { language } = useLanguage();
  const tLabels = translations[language].labels;
  const tSections = translations[language].sections;

  // Lead with the first sentence in full ink and let the rest fall back to grey,
  // the way Apple sets an intro paragraph.
  const splitAt = about.bio.search(/[.!?]\s/);
  const lead = splitAt > 0 ? about.bio.slice(0, splitAt + 1) : about.bio;
  const rest = splitAt > 0 ? about.bio.slice(splitAt + 1) : "";

  const facts = [
    { label: tLabels.currentRole, value: about.currentRole },
    { label: tLabels.educationSummary, value: about.educationSummary },
    { label: tLabels.careerFocus, value: about.careerFocus },
    { label: language === "tr" ? "Konum" : "Location", value: location },
  ];

  return (
    <Section id="about" title={tSections.aboutTitle} subtitle={tSections.aboutSubtitle}>
      <Reveal>
        <p className="max-w-4xl font-display font-semibold text-[clamp(1.5rem,1.15rem+1.4vw,2.25rem)] leading-[1.22] tracking-[-0.018em] text-text-primary">
          {lead}
          {rest && <span className="text-text-secondary">{rest}</span>}
        </p>
      </Reveal>

      <dl className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {facts.map((fact, idx) => (
          <Reveal key={fact.label} delay={idx * 60} className="border-t border-border-color pt-4">
            <dt className="text-sm text-text-secondary">{fact.label}</dt>
            <dd className="mt-1.5 text-[17px] leading-snug text-text-primary">{fact.value}</dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
        <Reveal className="border-t border-border-color pt-4">
          <h3 className="text-sm text-text-secondary">{tLabels.interests}</h3>
          <p className="mt-1.5 text-[17px] leading-relaxed text-text-primary">{about.interests.join(" · ")}</p>
        </Reveal>
        {profile.languages?.length > 0 && (
          <Reveal delay={60} className="border-t border-border-color pt-4">
            <h3 className="text-sm text-text-secondary">{language === "tr" ? "Diller" : "Languages"}</h3>
            <p className="mt-1.5 text-[17px] leading-relaxed text-text-primary">{profile.languages.join(" · ")}</p>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
