"use client";

import React from "react";
import { useProfile } from "../ProfileContext";
import { Github, Linkedin, Mail, Twitter, BookOpen, GraduationCap } from "lucide-react";

export default function Footer() {
  const { profile } = useProfile();
  const { socials } = profile;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="border-t border-border-color bg-bg-secondary py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Brand Name & Copyright */}
        <div className="text-center md:text-left">
          <button
            onClick={scrollToTop}
            className="font-display font-bold text-lg text-text-primary hover:opacity-80 transition-opacity mb-1.5 cursor-pointer block mx-auto md:mx-0 font-mono"
          >
            {profile.name}
            <span className="text-accent-primary">.</span>
          </button>
          <p className="text-xs text-text-tertiary font-normal">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>
        </div>

        {/* Right Side: Social Media Links */}
        <div className="flex items-center gap-4">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="GitHub Profile"
            >
              <Github size={16} />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={16} />
            </a>
          )}
          {socials.email && (
            <a
              href={socials.email}
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="Email Contact"
            >
              <Mail size={16} />
            </a>
          )}
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="Twitter Profile"
            >
              <Twitter size={16} />
            </a>
          )}
          {socials.medium && (
            <a
              href={socials.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="Medium Blog"
            >
              <BookOpen size={16} />
            </a>
          )}
          {socials.scholar && (
            <a
              href={socials.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-accent-primary hover:bg-accent-muted/40 dark:hover:bg-accent-muted/10 transition-all duration-200"
              aria-label="Google Scholar Profile"
            >
              <GraduationCap size={16} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
