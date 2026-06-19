# Premium Developer & AI Engineer Portfolio Template

A clean, elegant, modern, and fully professional personal portfolio template built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. It is designed specifically for software engineers, AI/ML engineers, computer engineering students, and tech professionals looking for a credible, minimal, and premium online presence.

## Features

- 🌓 **Auto & Manual Dark/Light Mode**: Smooth, class-based theme transitions with default dark mode for a premium engineering look.
- ⚙️ **Single-File Configuration**: All content (bio, skills, experiences, projects, education, socials) is dynamically read from a single file (`data/profile.ts`). Customize your entire portfolio in minutes without touching layout code!
- 📱 **Mobile-First Responsive Layout**: Optimized layouts for desktops, tablets, and mobile screens.
- ⚡ **SEO & Performance Ready**: Dynamic meta tags, OpenGraph previews, and image optimization support.
- 🌀 **Polished Micro-animations**: Soft hover effects, sliding panels, and interactive success states on the client contact form.

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.x or newer) installed.

### Installation

Clone your repository (or copy these files) and run the following command in the project root:

```bash
npm install
```

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### Build Production Bundle

To build and optimize the site for production:

```bash
npm run build
```

This compiles TypeScript and builds static HTML files inside the `.next` directory.

---

## How to Customize

You do **not** need to search through React components to replace template details. Everything is configured in:

📂 [**`data/profile.ts`**](file:///Users/tahsin/Documents/Antiravity/data/profile.ts)

Simply open this file and update the `profileData` object with your details:

```typescript
export const profileData: ProfileData = {
  name: "Your Name",
  title: "Your Professional Title",
  tagline: "Your positioning tagline statement...",
  location: "City, Country",
  email: "your.email@example.com",
  cvUrl: "/path/to/your/cv.pdf",
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "mailto:your.email@example.com",
    // Add medium, twitter, or google scholar if available
  },
  about: {
    bio: "Your professional biography...",
    currentRole: "Your Role at Company",
    educationSummary: "Degree, University",
    careerFocus: "Your long-term technical mission...",
    interests: ["Topic 1", "Topic 2", "Topic 3"]
  },
  skills: {
    backend: ["Go", "Rust", "Python", ...],
    frontendMobile: ["React", "Next.js", "Tailwind CSS", ...],
    aiMl: ["PyTorch", "Hugging Face", ...],
    databases: ["PostgreSQL", "Redis", ...],
    devOpsTools: ["Docker", "Kubernetes", "AWS", ...],
    architectureCertifications: ["System Design", "AWS Professional", ...]
  },
  projects: [
    {
      title: "Project Name",
      description: "A description of the project...",
      techStack: ["React", "TypeScript", ...],
      keyImpact: "Improved metric X by Y%",
      githubLink: "https://github.com/...",
      liveLink: "https://...",
      caseStudyLink: "#"
    }
  ],
  experience: [
    {
      company: "Company Name",
      role: "Your Role",
      location: "City, ST",
      dateRange: "Start - End",
      responsibilities: ["Action statement...", "System designed..."],
      keyAchievements: ["Achieved metric A", "Migrated system B"]
    }
  ],
  education: [
    {
      university: "University Name",
      degree: "Degree Level",
      department: "Major Field",
      dateRange: "Start - End",
      location: "City, ST",
      coursework: ["Course A", "Course B"],
      focus: "Thesis topic or area of academic specialization"
    }
  ],
  certifications: [
    {
      title: "Certification Title",
      issuer: "Issuing Organization",
      date: "Year",
      description: "Short details about the credential..."
    }
  ],
  languages: ["English (Native)", "Spanish (Conversational)"]
};
```

---

## File Structure

- `data/`
  - `profile.ts` - Main data configuration file (fully typed structure)
- `app/`
  - `layout.tsx` - Root layout with Google Fonts, metadata, and body styling
  - `page.tsx` - Main page rendering all portfolio sections
  - `globals.css` - Custom styles, variables, theme config, and animations
- `components/`
  - `Navbar.tsx` - Floating navigation bar with mobile support & theme toggle
  - `ThemeContext.tsx` - Theme state provider (light/dark mode)
  - `sections/` - Individual portfolio page section components
    - `Hero.tsx`
    - `About.tsx`
    - `Skills.tsx`
    - `Projects.tsx`
    - `Experience.tsx`
    - `Education.tsx`
    - `Certifications.tsx`
    - `Contact.tsx`
    - `Footer.tsx`
  - `ui/` - Reusable UI components
    - `Button.tsx` - Hover-animated button
    - `Card.tsx` - Glassmorphic container card
    - `Badge.tsx` - Tag labels
- `public/` - Favicon and static asset folder
- `package.json`, `tsconfig.json` - Next.js TypeScript project configs
