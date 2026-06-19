import React from "react";

interface BadgeProps {
  variant?: "subtle" | "outline" | "solid";
  color?: "indigo" | "violet" | "slate" | "green";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "subtle",
  color = "indigo",
  children,
  className = ""
}: BadgeProps) {
  const colorMaps = {
    indigo: {
      subtle: "bg-badge-indigo-bg text-badge-indigo-text border border-badge-indigo-border",
      outline: "border border-badge-indigo-border text-badge-indigo-text",
      solid: "bg-badge-indigo-text text-white"
    },
    violet: {
      subtle: "bg-badge-violet-bg text-badge-violet-text border border-badge-violet-border",
      outline: "border border-badge-violet-border text-badge-violet-text",
      solid: "bg-badge-violet-text text-white"
    },
    slate: {
      subtle: "bg-bg-tertiary text-text-secondary border border-border-color",
      outline: "border border-border-color text-text-secondary",
      solid: "bg-text-primary text-bg-primary"
    },
    green: {
      subtle: "bg-badge-green-bg text-badge-green-text border border-badge-green-border",
      outline: "border border-badge-green-border text-badge-green-text",
      solid: "bg-badge-green-text text-white"
    }
  };

  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-150";
  const selectedStyle = colorMaps[color][variant];

  return (
    <span className={`${baseStyles} ${selectedStyle} ${className}`}>
      {children}
    </span>
  );
}
