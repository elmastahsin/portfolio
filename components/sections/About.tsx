"use client";

import React from "react";
import Card from "../ui/Card";
import { useProfile } from "../ProfileContext";
import { Briefcase, GraduationCap, MapPin, Compass, CheckCircle } from "lucide-react";

export default function About() {
  const { profile } = useProfile();
  const { about, location } = profile;

  const details = [
    { icon: <Briefcase className="text-accent-primary" size={18} />, label: "Current Role", value: about.currentRole },
    { icon: <GraduationCap className="text-accent-primary" size={18} />, label: "Education", value: about.educationSummary },
    { icon: <Compass className="text-accent-primary" size={18} />, label: "Career Focus", value: about.careerFocus },
    { icon: <MapPin className="text-accent-primary" size={18} />, label: "Location", value: location },
  ];

  return (
    <section id="about" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 01. init_about_profile()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-secondary">func</span> initAbout<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Bio & Core Info */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-base md:text-lg text-text-secondary leading-relaxed font-normal">
            {about.bio}
          </p>

          {/* Quick Profile Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((detail, idx) => (
              <Card key={idx} hoverEffect={false} glassmorphism={true} className="flex gap-4 p-4 items-start">
                <div className="p-2.5 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 shrink-0">
                  {detail.icon}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">
                    {detail.label}
                  </span>
                  <span className="text-sm font-medium text-text-primary leading-tight">
                    {detail.value}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Code Accent Card & Interests */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mock Code System Architecture Accent Card */}
          <Card hoverEffect={true} glassmorphism={true} className="p-5 font-mono text-xs overflow-hidden border border-border-color">
            <div className="flex items-center gap-1.5 border-b border-border-color pb-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-text-tertiary ml-2 font-sans select-none text-[10px]">engineer.config.json</span>
            </div>
            <pre className="text-text-secondary leading-normal">
              {`{
  "developer": {
    "name": "${profile.name}",
    "type": "AI & Systems Specialist",
    "stack": ["Golang", "Rust", "PyTorch"],
    "methods": ["Distributed Systems", "Federated LLMs"],
    "passion": "Building low-latency architectures",
    "running_mode": "optimize_all_the_things"
  }
}`}
            </pre>
          </Card>

          {/* Interests Card */}
          <Card hoverEffect={false} glassmorphism={true} className="p-6">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-accent-primary" />
              Main Interests
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {about.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-bg-tertiary text-text-secondary border border-border-color hover:border-accent-primary/40 dark:hover:border-accent-primary/20 hover:text-text-primary transition-all duration-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Closing Function Brace */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
