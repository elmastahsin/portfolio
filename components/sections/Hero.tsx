"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { Github, Linkedin, Mail, Twitter, BookOpen, GraduationCap, ArrowDown, Terminal } from "lucide-react";
import { useProfile } from "../ProfileContext";

interface CommandLog {
  cmd: string;
  output: React.ReactNode;
}

export default function Hero() {
  const { profile } = useProfile();
  const { socials } = profile;
  const historyContainerRef = useRef<HTMLDivElement>(null);
  
  // Terminal state
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([]);

  // Auto-scroll terminal history to bottom
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Run mock neofetch command on start
  useEffect(() => {
    setHistory([
      {
        cmd: "neofetch",
        output: (
          <div className="flex gap-4 font-mono text-[10px] text-text-secondary leading-normal leading-relaxed animate-fade-in select-none">
            <pre className="text-accent-primary shrink-0 hidden sm:block">
{`   /\\_/\\
  ( o.o )
   > ^ <
 /|     |\\
  |  |  |
  (__)__)`}
            </pre>
            <div className="space-y-0.5">
              <p className="font-bold text-accent-secondary">tahsin@developer-core</p>
              <p>-------------------------</p>
              <p><span className="text-accent-primary">OS</span>: macOS Antigravity Edition</p>
              <p><span className="text-accent-primary">Host</span>: Web-Terminal Simulator</p>
              <p><span className="text-accent-primary">Kernel</span>: Next.js App Router</p>
              <p><span className="text-accent-primary">Shell</span>: zsh v5.9</p>
              <p><span className="text-accent-primary">Status</span>: Optimizing distributed nodes...</p>
              <p><span className="text-accent-primary">Focus</span>: {profile.title}</p>
              <p className="text-text-tertiary pt-1">// Type 'help' to explore additional paths.</p>
            </div>
          </div>
        )
      }
    ]);
  }, [profile]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = input.trim().toLowerCase();
    if (!cleanCmd) return;

    let response: React.ReactNode = "";

    switch (cleanCmd) {
      case "help":
        response = (
          <div className="space-y-1 font-mono text-[10px] text-text-secondary">
            <p className="text-text-primary font-semibold">// Available CLI utility commands:</p>
            <p><span className="text-accent-primary">neofetch</span> - Output system specs and developer information.</p>
            <p><span className="text-accent-primary">about</span>    - Display professional profile summary.</p>
            <p><span className="text-accent-primary">skills</span>   - List primary technical stack competencies.</p>
            <p><span className="text-accent-primary">projects</span> - Output brief summaries of featured projects.</p>
            <p><span className="text-accent-primary">socials</span>  - Show interactive URL shortcuts to profiles.</p>
            <p><span className="text-accent-primary">clear</span>    - Wipe the screen logs memory buffer.</p>
          </div>
        );
        break;
      case "about":
        response = (
          <p className="font-mono text-[10px] text-text-secondary max-w-sm leading-relaxed">
            {profile.about.bio}
          </p>
        );
        break;
      case "skills":
        {
          const rawSkills = profile.skills;
          const categoriesList = Array.isArray(rawSkills) 
            ? rawSkills 
            : [
                { title: "Backend Development", items: (rawSkills as any)?.backend || [] },
                { title: "AI / Machine Learning", items: (rawSkills as any)?.aiMl || [] },
                { title: "Databases & Cache", items: (rawSkills as any)?.databases || [] }
              ];
          response = (
            <div className="font-mono text-[10px] text-text-secondary space-y-1">
              {categoriesList.slice(0, 4).map((c, i) => (
                <p key={i}>
                  <span className="text-accent-secondary font-bold">
                    {c.title.replace(" Development", "").replace(" & Tools", "").replace(" & Standards", "")}
                  </span>: {c.items.slice(0, 4).join(", ")}
                </p>
              ))}
            </div>
          );
        }
        break;
      case "projects":
        response = (
          <div className="font-mono text-[10px] text-text-secondary space-y-1">
            {profile.projects.slice(0, 3).map((p, i) => (
              <p key={i}>• <span className="text-text-primary font-bold">{p.title}</span> - {p.keyImpact}</p>
            ))}
          </div>
        );
        break;
      case "socials":
        response = (
          <div className="font-mono text-[10px] text-text-secondary space-y-1">
            {socials.github && <p>• GitHub: <a href={socials.github} target="_blank" rel="noreferrer" className="text-accent-primary underline">github.com</a></p>}
            {socials.linkedin && <p>• LinkedIn: <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-accent-primary underline">linkedin.com</a></p>}
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        response = <span className="text-red-400 font-mono text-[10px]">// COMMAND_NOT_FOUND: "{cleanCmd}". Type 'help' for options.</span>;
    }

    setHistory((prev) => [...prev, { cmd: input, output: response }]);
    setInput("");
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center px-6 pt-24 overflow-hidden"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-15">
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary blur-3xl opacity-10" />
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 animate-fade-in">
        
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-muted/40 dark:bg-accent-muted/10 text-accent-primary border border-accent-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            Available for new opportunities
          </span>

          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight text-text-primary leading-tight">
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </h1>

          <h2 className="font-display font-medium text-lg md:text-2xl text-text-secondary tracking-wide font-mono">
            const developer = "{profile.title}";
          </h2>

          <p className="text-sm md:text-base text-text-tertiary max-w-xl leading-relaxed font-normal">
            {profile.tagline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button variant="primary" onClick={() => scrollToSection("projects")}>
              View Projects
            </Button>
            <Button variant="outline" href={profile.cvUrl} external>
              Download CV
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection("contact")}>
              Contact Me
            </Button>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5 pt-3">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>
            )}
            {socials.email && (
              <a
                href={socials.email}
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="Email Contact"
              >
                <Mail size={18} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="Twitter Profile"
              >
                <Twitter size={18} />
              </a>
            )}
            {socials.medium && (
              <a
                href={socials.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="Medium Blog"
              >
                <BookOpen size={18} />
              </a>
            )}
            {socials.scholar && (
              <a
                href={socials.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                aria-label="Google Scholar Profile"
              >
                <GraduationCap size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Terminal Widget */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-xl border border-border-color bg-bg-secondary/90 backdrop-blur-md shadow-card overflow-hidden w-full max-w-lg mx-auto">
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-bg-tertiary border-b border-border-color">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-[10px] font-semibold text-text-tertiary select-none flex items-center gap-1">
                <Terminal size={11} className="text-accent-primary" />
                tahsin@macbook-pro:~
              </span>
              <div className="w-10" />
            </div>

            {/* Terminal History */}
            <div 
              ref={historyContainerRef}
              className="p-4 bg-bg-primary h-60 overflow-y-auto space-y-3"
            >
              {history.map((log, idx) => (
                <div key={idx} className="space-y-1.5">
                  <p className="font-mono text-[10px] text-text-primary">
                    <span className="text-accent-primary font-bold">tahsin@core:~$</span> {log.cmd}
                  </p>
                  <div className="pl-3">{log.output}</div>
                </div>
              ))}
            </div>

            {/* Command input prompt */}
            <form onSubmit={handleCommandSubmit} className="flex items-center px-4 py-2.5 border-t border-border-color bg-bg-tertiary/50">
              <span className="font-mono text-[10px] text-accent-primary font-bold mr-1.5 select-none">
                tahsin@core:~$
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent border-none text-text-primary text-[10px] font-mono focus:outline-none focus:ring-0 p-0"
                placeholder="Try: help, skills, about..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>

      </div>

      {/* Floating Scroll down indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-6 cursor-pointer text-text-tertiary hover:text-accent-primary transition-colors duration-200 animate-bounce"
        aria-label="Scroll to About"
      >
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
