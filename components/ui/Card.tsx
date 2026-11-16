import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  /** Kept for API compatibility; tiles are solid surfaces now. */
  glassmorphism?: boolean;
  children: React.ReactNode;
}

export default function Card({
  hoverEffect = true,
  glassmorphism: _glassmorphism, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        press-motion rounded-[28px] bg-bg-secondary p-6
        ${hoverEffect ? "hover:-translate-y-0.5 hover:shadow-card-hover" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
