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
        rounded-xl border border-border-color bg-bg-secondary p-6 shadow-card transition-all duration-300
        ${glassmorphism ? "backdrop-blur-md bg-opacity-70 dark:bg-opacity-40" : ""}
        ${hoverEffect ? "hover:scale-[1.01] hover:shadow-card-hover hover:border-accent-primary/40 dark:hover:border-accent-primary/30" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
