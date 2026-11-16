"use client";

import React from "react";
import Section from "../ui/Section";
import TimelineRow from "../ui/TimelineRow";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";
import { ChevronRight } from "lucide-react";

export default function Certifications() {
  const { profile } = useProfile();
  const { certifications } = profile;
  const { language } = useLanguage();
  const tSections = translations[language].sections;

  if (!certifications?.length) return null;

  return (
    <Section id="certifications" title={tSections.certificationsTitle} subtitle={tSections.certificationsSubtitle} tone="band">
      <ol className="border-b border-border-color">
        {certifications.map((item, idx) => (
          <TimelineRow
            key={item.title}
            delay={idx * 60}
            meta={item.date}
            title={item.title}
            subtitle={item.issuer}
          >
            {(item.description || item.url) && (
              <>
                {item.description && <p className="text-text-secondary">{item.description}</p>}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex items-center text-accent-primary hover:underline"
                  >
                    {language === "tr" ? "Doğrula" : "Verify"}
                    <ChevronRight size={17} className="press-motion group-hover:translate-x-0.5" />
                  </a>
                )}
              </>
            )}
          </TimelineRow>
        ))}
      </ol>
    </Section>
  );
}
