"use client";

import React from "react";
import { useProfile } from "../ProfileContext";
import { useLanguage } from "../LanguageContext";

export default function Footer() {
  const { profile } = useProfile();
  const { socials } = profile;
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "GitHub", href: socials.github },
    { label: "LinkedIn", href: socials.linkedin },
    { label: "Medium", href: socials.medium },
    { label: "X", href: socials.twitter },
    { label: "Google Scholar", href: socials.scholar },
    { label: language === "tr" ? "E-posta" : "Email", href: socials.email },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <footer className="bg-bg-tertiary dark:bg-bg-secondary px-6 py-10 text-xs text-text-secondary">
      <div className="max-w-[1080px] mx-auto flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 border-t border-border-color pt-5">
        <p>
          &copy; {currentYear} {profile.name}. {language === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={language === "tr" ? "Sosyal bağlantılar" : "Social links"}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="hover:text-text-primary hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
