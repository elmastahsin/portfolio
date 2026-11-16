"use client";

import React, { useEffect, useRef } from "react";
import Button from "../ui/Button";
import { ChevronRight } from "lucide-react";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";
import { translations } from "@/data/profile";
import { scrollToSection } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/spring";

export default function Hero() {
  const { profile } = useProfile();
  const { language } = useLanguage();
  const t = translations[language].buttons;
  const sectionRef = useRef<HTMLElement>(null);

  // The headline recedes as the next section slides over it. Progress is written
  // to a CSS variable once per frame; the transform itself is pure CSS.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(Math.max(window.scrollY / (section.offsetHeight * 0.7), 0), 1);
      section.style.setProperty("--hero-progress", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[88svh] flex items-center justify-center px-6 pt-12 overflow-hidden"
    >
      {/* Recede and fade-in live on separate elements: an animation's fill would
          otherwise pin the transform and freeze the scroll effect. */}
      <div className="hero-recede max-w-[1080px] w-full mx-auto text-center">
        <div className="animate-fade-in">
        <p className="text-sm md:text-[17px] text-text-secondary mb-5 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary" aria-hidden />
          {language === "tr" ? "Yeni fırsatlara açık" : "Open to new opportunities"}
        </p>

        <h1 className="font-display font-semibold text-text-primary text-[clamp(3rem,1.6rem+7vw,7.5rem)] leading-[1.02] tracking-[-0.035em]">
          {profile.name}
        </h1>

        <p className="mt-4 font-display font-semibold text-text-secondary text-[clamp(1.375rem,1.1rem+1.4vw,2.5rem)] leading-tight tracking-[-0.02em]">
          {profile.title}
        </p>

        <p className="mt-6 mx-auto max-w-2xl text-[17px] md:text-[19px] leading-relaxed text-text-secondary">
          {profile.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button size="lg" onClick={() => scrollToSection("projects")}>
            {language === "tr" ? "Projeleri gör" : "See projects"}
          </Button>
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-[17px] text-accent-primary hover:underline"
            >
              {t.downloadCv}
              <ChevronRight size={18} className="press-motion group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
