"use client";

import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useProfile } from "../ProfileContext";
import { Server, Layout, Brain, Database, Terminal, Shield, Code } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  backend: <Server className="text-accent-primary" size={20} />,
  frontend: <Layout className="text-accent-primary" size={20} />,
  ai: <Brain className="text-accent-primary" size={20} />,
  database: <Database className="text-accent-primary" size={20} />,
  devops: <Terminal className="text-accent-primary" size={20} />,
  security: <Shield className="text-accent-primary" size={20} />,
};

function getIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("backend") || t.includes("server") || t.includes("api") || t.includes("system")) return iconMap.backend;
  if (t.includes("frontend") || t.includes("web") || t.includes("mobile") || t.includes("ui") || t.includes("ux") || t.includes("design") || t.includes("client")) return iconMap.frontend;
  if (t.includes("ai") || t.includes("machine") || t.includes("intelligence") || t.includes("learning") || t.includes("model") || t.includes("nlp") || t.includes("llm")) return iconMap.ai;
  if (t.includes("data") || t.includes("db") || t.includes("cache") || t.includes("sql") || t.includes("nosql")) return iconMap.database;
  if (t.includes("devops") || t.includes("cloud") || t.includes("tool") || t.includes("sys") || t.includes("docker") || t.includes("infra")) return iconMap.devops;
  if (t.includes("architecture") || t.includes("security") || t.includes("standard") || t.includes("design pattern")) return iconMap.security;
  return <Code className="text-accent-primary" size={20} />;
}

const badgeColors = ["indigo", "violet", "green", "slate"] as const;

export default function Skills() {
  const { profile } = useProfile();
  
  // Backward compatibility migration for older storage format
  const rawSkills = profile.skills;
  const categoriesList: { title: string; items: string[] }[] = Array.isArray(rawSkills) 
    ? rawSkills 
    : [
        { title: "Backend Development", items: (rawSkills as any)?.backend || [] },
        { title: "Frontend & Mobile", items: (rawSkills as any)?.frontendMobile || [] },
        { title: "AI / Machine Learning", items: (rawSkills as any)?.aiMl || [] },
        { title: "Databases & Cache", items: (rawSkills as any)?.databases || [] },
        { title: "DevOps & Tools", items: (rawSkills as any)?.devOpsTools || [] },
        { title: "Architecture & Standards", items: (rawSkills as any)?.architectureCertifications || [] }
      ].filter((c): c is { title: string; items: string[] } => !!c.items && c.items.length > 0);

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
        {categoriesList.map((cat, idx) => {
          const color = badgeColors[idx % badgeColors.length];
          return (
            <Card key={idx} hoverEffect={true} glassmorphism={true} className="flex flex-col h-full border border-border-color">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border-color">
                <div className="p-2 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 shrink-0">
                  {getIcon(cat.title)}
                </div>
                <h3 className="font-display font-semibold text-base text-text-primary leading-tight">
                  {cat.title}
                </h3>
              </div>

              {/* Badges Container */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {cat.items.map((skill, index) => (
                  <Badge key={index} variant="subtle" color={color}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Closing Arrow Function Brace */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"};"}</div>
    </section>
  );
}
