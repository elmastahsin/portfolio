"use client";

import React, { useEffect, useRef } from "react";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "li" | "article";
  /** Stagger siblings by a few tens of ms so a grid settles in as one gesture. */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Fades and lifts its content into place the first time it enters the viewport.
 * One observer per element, disconnected after the first reveal.
 */
export default function Reveal({ as = "div", delay = 0, className = "", style, children, ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
