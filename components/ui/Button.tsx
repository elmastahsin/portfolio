import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  external = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "press-motion inline-flex items-center justify-center font-normal rounded-full " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] " +
    "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]";
  
  const variants = {
    primary: "bg-accent-primary text-white hover:brightness-110 border border-transparent dark:text-black",
    secondary: "bg-bg-tertiary text-text-primary hover:bg-border-color/60 border border-transparent",
    outline: "border border-accent-primary text-accent-primary hover:bg-accent-muted"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-[15px]",
    lg: "px-7 py-3 text-[17px]"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
