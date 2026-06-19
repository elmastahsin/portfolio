"use client";

import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useProfile } from "../ProfileContext";
import { Github, ExternalLink, ArrowRight, TrendingUp } from "lucide-react";

export default function Projects() {
  const { profile } = useProfile();
  const { projects } = profile;

  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 03. active_repositories()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-secondary">class</span> Projects <span className="text-accent-secondary">extends</span> Repository <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <Card key={idx} hoverEffect={true} glassmorphism={true} className="flex flex-col h-full border border-border-color justify-between p-6">
            <div>
              {/* Project Title */}
              <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                {project.title}
              </h3>

              {/* Project Description */}
              <p className="text-sm text-text-secondary mb-5 leading-relaxed font-normal">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline" color="slate">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Impact / Result Block */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-accent-muted border border-accent-primary/20 text-text-secondary mb-6">
                <TrendingUp size={16} className="mt-0.5 shrink-0 text-accent-primary" />
                <span className="text-xs font-medium leading-tight">
                  <span className="font-bold text-accent-primary mr-1">Impact:</span> {project.keyImpact}
                </span>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-4 pt-3 border-t border-border-color">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent-primary transition-colors duration-200"
                >
                  <Github size={14} />
                  Code
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent-primary transition-colors duration-200"
                >
                  <ExternalLink size={14} />
                  Demo
                </a>
              )}
              {project.caseStudyLink && (
                <a
                  href={project.caseStudyLink}
                  className="flex items-center gap-1 text-xs font-semibold text-accent-primary hover:text-accent-secondary transition-colors duration-200 ml-auto"
                >
                  Case Study
                  <ArrowRight size={12} />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Closing Class Brace */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
