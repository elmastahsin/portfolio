"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
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
    // A one-pixel line at 40% of the viewport: whichever section crosses it is
    // the one being read. Entries only report changes, so comparing ratios
    // within a batch (the previous approach) could pick the section being left.
    const observer = new IntersectionObserver(
      (entries) => {
        const entered = entries.find((entry) => entry.isIntersecting);
        if (entered) setActiveSection(entered.target.id);
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 }
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
      className="scroll-edge material fixed top-0 left-0 right-0 z-50 px-6"
    >
      <div className="max-w-[1080px] mx-auto h-12 flex items-center justify-between">
        <button
          onClick={() => goToSection("home")}
          className="press-motion text-[15px] font-semibold tracking-tight text-text-primary cursor-pointer active:scale-95"
        >
          {profile.name}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              aria-current={activeSection === item.id ? "true" : undefined}
              className={`press-motion px-3 py-1 text-xs cursor-pointer active:scale-[0.97] ${
                activeSection === item.id ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}

          <span className="w-px h-4 bg-border-color mx-2" aria-hidden />

          <button
            onClick={toggleLanguage}
            aria-label={language === "tr" ? "Switch to English" : "Türkçeye geç"}
            className="press-motion px-2 py-1 text-xs text-text-secondary hover:text-text-primary cursor-pointer active:scale-95"
          >
            {language === "tr" ? "EN" : "TR"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Use dark appearance" : "Use light appearance"}
            className="press-motion p-1.5 text-text-secondary hover:text-text-primary cursor-pointer active:scale-90"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </nav>

        {/* Mobile Navbar Buttons */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleLanguage}
            aria-label={language === "tr" ? "Switch to English" : "Türkçeye geç"}
            className="press-motion px-2 py-1.5 text-xs text-text-secondary active:scale-95"
          >
            {language === "tr" ? "EN" : "TR"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Use dark appearance" : "Use light appearance"}
            className="press-motion p-2 text-text-secondary active:scale-90"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            className="press-motion p-2 text-text-primary active:scale-90"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
        <nav className="flex flex-col px-6 pt-2 pb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className={`press-motion py-3 text-left text-2xl font-semibold tracking-tight border-b border-border-color/60 last:border-0 active:scale-[0.98] ${
                activeSection === item.id ? "text-text-primary" : "text-text-secondary"
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
