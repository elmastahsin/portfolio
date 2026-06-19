"use client";

import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useProfile } from "../ProfileContext";
import { Server, Layout, Brain, Database, Terminal, Shield } from "lucide-react";

export default function Skills() {
  const { profile } = useProfile();
  const { skills } = profile;

  const categories = [
    {
      title: "Backend Development",
      icon: <Server className="text-accent-primary" size={20} />,
      items: skills.backend,
      color: "indigo" as const
    },
    {
      title: "Frontend & Mobile",
      icon: <Layout className="text-accent-primary" size={20} />,
      items: skills.frontendMobile,
      color: "violet" as const
    },
    {
      title: "AI / Machine Learning",
      icon: <Brain className="text-accent-primary" size={20} />,
      items: skills.aiMl,
      color: "green" as const
    },
    {
      title: "Databases & Cache",
      icon: <Database className="text-accent-primary" size={20} />,
      items: skills.databases,
      color: "slate" as const
    },
    {
      title: "DevOps & Tools",
      icon: <Terminal className="text-accent-primary" size={20} />,
      items: skills.devOpsTools,
      color: "indigo" as const
    },
    {
      title: "Architecture & Standards",
      icon: <Shield className="text-accent-primary" size={20} />,
      items: skills.architectureCertifications,
      color: "violet" as const
    }
  ];

  return (
    <section id="skills" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 02. loading_capabilities()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-secondary">const</span> getSkills <span className="text-text-secondary">=</span> <span className="text-text-tertiary">()</span> <span className="text-accent-secondary">=&gt;</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <Card key={idx} hoverEffect={true} glassmorphism={true} className="flex flex-col h-full border border-border-color">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border-color">
              <div className="p-2 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 shrink-0">
                {cat.icon}
              </div>
              <h3 className="font-display font-semibold text-base text-text-primary leading-tight">
                {cat.title}
              </h3>
            </div>

            {/* Badges Container */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {cat.items.map((skill, index) => (
                <Badge key={index} variant="subtle" color={cat.color}>
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Closing Arrow Function Brace */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"};"}</div>
    </section>
  );
}
