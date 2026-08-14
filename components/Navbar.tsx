"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { useProfile } from "./ProfileContext";
import { useLanguage } from "./LanguageContext";
import { translations } from "@/data/profile";
import { scrollToSection } from "@/lib/scroll";
import Sheet from "./ui/Sheet";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].nav;

  const [hasBlogs, setHasBlogs] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data && data.length > 0) {
          setHasBlogs(true);
        }
      })
      .catch(() => { });
  }, []);

  const navItems = [
    { label: language === "tr" ? "Ana Sayfa" : "Home", id: "home" },
    { label: t.about, id: "about" },
    { label: t.skills, id: "skills" },
    { label: t.projects, id: "projects" },
    { label: t.experience, id: "experience" },
    { label: t.education, id: "education" },
    ...(hasBlogs ? [{ label: t.blog, id: "blog" }] : []),
    { label: t.contact, id: "contact" }
  ];

  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll only decides whether the chrome is floating over content. Coalesced
  // into one rAF so a fast scroll cannot queue more work than it can paint.
  const scrollFrame = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = requestAnimationFrame(() => {
        scrollFrame.current = 0;
        setIsScrolled(window.scrollY > 20);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  // Active section comes from an observer rather than a per-scroll-event loop
  // over every section's offsetTop, which forced layout on every frame.
  const sectionIds = navItems.map((item) => item.id).join(",");
  useEffect(() => {
    const ids = sectionIds.split(",");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      // Band just under the navbar, so a section counts as active once it owns
      // the part of the viewport the reader is actually looking at.
      { rootMargin: "-80px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  const goToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(id);
    setActiveSection(id);
  };

  return (
    <header
      data-scrolled={isScrolled}
      className={`scroll-edge fixed top-0 left-0 right-0 z-50 transition-[padding,background-color] duration-300 ease-settle ${
        isScrolled ? "material py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => goToSection("home")}
          className="press-motion font-display font-bold text-xl type-title text-gradient cursor-pointer active:scale-95"
        >
          tahsinelmas
          <span className="text-text-primary">.</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className={`press-motion on-material px-4 py-2 rounded-lg text-sm cursor-pointer active:scale-[0.97] ${activeSection === item.id
                ? "text-accent-primary bg-accent-muted/40 dark:bg-accent-muted/10 font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
            >
              {item.label}
            </button>
          ))}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            className="press-motion flex items-center space-x-1 px-3 py-1.5 ml-2 rounded-lg text-xs font-bold border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary cursor-pointer active:scale-95"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="press-motion p-2 ml-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary cursor-pointer active:scale-90"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </nav>

        {/* Mobile Navbar Buttons */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            className="press-motion flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-border-color text-text-secondary hover:text-accent-primary active:scale-95"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="press-motion p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary active:scale-90"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="press-motion p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary active:scale-90"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation. A sheet rather than a dropdown, so it can be
          dismissed with the same gesture that would dismiss it on iOS. */}
      <Sheet
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        label="Navigation"
      >
        <nav className="flex flex-col p-4 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className={`press-motion on-material px-4 py-3 rounded-lg text-left text-sm active:scale-[0.98] ${activeSection === item.id
                ? "text-accent-primary bg-accent-muted/40 dark:bg-accent-muted/10 font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </Sheet>
    </header>
  );
}

