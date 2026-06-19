"use client";

import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useProfile } from "../ProfileContext";
import { GraduationCap, Calendar, MapPin, BookOpen, Lightbulb } from "lucide-react";

export default function Education() {
  const { profile } = useProfile();
  const { education } = profile;

  return (
    <section id="education" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title */}
      <div className="mb-12 font-mono">
        <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 05. query_academic_history()</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
          <span className="text-accent-primary">academic</span><span className="text-text-secondary">.</span>resolve<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {education.map((item, idx) => (
          <Card key={idx} hoverEffect={true} glassmorphism={true} className="flex flex-col border border-border-color justify-between p-6 md:p-8">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-border-color">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-accent-muted/40 dark:bg-accent-muted/10 shrink-0 text-accent-primary">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-primary leading-tight">
                      {item.university}
                    </h3>
                    <p className="text-sm font-semibold text-accent-primary mt-1">
                      {item.degree} in {item.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time and Location details */}
              <div className="flex items-center gap-4 text-xs text-text-tertiary mb-5">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {item.dateRange}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {item.location}
                </span>
              </div>

              {/* Research Focus */}
              {item.focus && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 text-text-secondary text-xs mb-5 font-normal leading-relaxed">
                  <Lightbulb size={16} className="text-accent-primary shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold text-text-primary">Focus:</span> {item.focus}
                  </span>
                </div>
              )}

              {/* Coursework list */}
              {item.coursework && item.coursework.length > 0 && (
                <div>
                  <h4 className="font-display font-semibold text-xs text-text-tertiary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.coursework.map((course, index) => (
                      <Badge key={index} variant="subtle" color="slate">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Closing Gutter */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
