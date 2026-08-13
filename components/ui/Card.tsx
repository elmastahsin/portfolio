import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glassmorphism?: boolean;
  children: React.ReactNode;
}

export default function Card({
  hoverEffect = true,
  glassmorphism = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        press-motion rounded-xl border border-border-color p-6 shadow-card
        ${glassmorphism ? "material" : "bg-bg-secondary"}
        ${hoverEffect ? "hover:scale-[1.01] hover:shadow-card-hover hover:border-accent-primary/40 dark:hover:border-accent-primary/30" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
