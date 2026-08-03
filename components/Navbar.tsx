"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import { useProfile } from "./ProfileContext";
import { useLanguage } from "./LanguageContext";
import { translations } from "@/data/profile";

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
      .catch(() => {});
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

  // Monitor scroll for visual changes to navbar and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracking
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Offset for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  // Get user's initials for the logo
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / Initials */}
        <button
          onClick={() => scrollToSection("home")}
          className="font-display font-bold text-xl tracking-tight text-gradient cursor-pointer active:scale-95 transition-transform"
        >
          {initials}
          <span className="text-text-primary">.</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeSection === item.id
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
            className="flex items-center space-x-1 px-3 py-1.5 ml-2 rounded-lg text-xs font-bold border border-border-color text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 ml-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all duration-200 cursor-pointer active:scale-90"
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
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-border-color text-text-secondary hover:text-accent-primary transition-all"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-secondary border-b border-border-color shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "text-accent-primary bg-accent-muted/40 dark:bg-accent-muted/10 font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

