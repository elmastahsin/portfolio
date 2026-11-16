"use client";

import React from "react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";
import { ChevronRight } from "lucide-react";

function TileLink({ href, external = true, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center text-[17px] text-accent-primary hover:underline"
    >
      {children}
      <ChevronRight size={17} className="press-motion group-hover:translate-x-0.5" />
    </a>
  );
}

export default function Projects() {
  const { profile } = useProfile();
  const { projects } = profile;
  const { language } = useLanguage();
  const tSections = translations[language].sections;

  return (
    <Section id="projects" title={tSections.projectsTitle} subtitle={tSections.projectsSubtitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project, idx) => (
          <Reveal key={project.title} delay={(idx % 2) * 80} className="flex">
            {/* Hover motion sits on the inner tile so it keeps its own fast timing. */}
            <article className="press-motion flex flex-1 flex-col rounded-[28px] bg-bg-tertiary dark:bg-bg-secondary p-8 md:p-10 hover:-translate-y-1 hover:shadow-card-hover">
            <p className="text-sm text-text-secondary">{project.techStack.join(" · ")}</p>

            <h3 className="mt-3 font-display font-semibold text-[28px] leading-[1.12] tracking-[-0.02em] text-text-primary">
              {project.title}
            </h3>

            <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">
              {project.description}
            </p>

            <p className="mt-4 text-[17px] leading-relaxed text-text-primary">
              {project.keyImpact}
            </p>

            <div className="mt-auto pt-8 flex flex-wrap items-center gap-x-7 gap-y-2">
              {project.liveLink && (
                <TileLink href={project.liveLink}>{language === "tr" ? "Canlı gör" : "Visit"}</TileLink>
              )}
              {project.githubLink && (
                <TileLink href={project.githubLink}>{language === "tr" ? "Kodu incele" : "View code"}</TileLink>
              )}
              {project.caseStudyLink && (
                <TileLink href={project.caseStudyLink} external={false}>
                  {language === "tr" ? "Detaylar" : "Case study"}
                </TileLink>
              )}
            </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
