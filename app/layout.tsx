import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { ProfileProvider } from "@/components/ProfileContext";
import { LanguageProvider } from "@/components/LanguageContext";
import { getProfile } from "@/lib/database";
import { ProfileData, profileData as defaultProfile } from "@/data/profile";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

async function getProfileData(): Promise<ProfileData> {
  try {
    return await getProfile();
  } catch (e) {
    console.error("Error fetching profile on server side:", e);
    return defaultProfile;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData();
  return {
    metadataBase: new URL("https://tahsinelmas.com"),
    title: {
      default: `${profile.name} | ${profile.title}`,
      template: `%s | ${profile.name}`
    },
    description: profile.tagline,
    keywords: [
      "Java Backend Developer",
      "Spring Boot Developer",
      "Microservices Engineer",
      "Software Developer",
      "Computer Engineering",
      "Portfolio",
      ...profile.skills.flatMap(s => s.items)
    ],
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://tahsinelmas.com",
      title: `${profile.name} | ${profile.title}`,
      description: profile.tagline,
      siteName: `${profile.name} Portfolio`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${profile.name} - ${profile.title}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} | ${profile.title}`,
      description: profile.tagline,
      images: ["/og-image.png"]
    },
    icons: {
      icon: "/favicon.ico"
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialProfile = await getProfileData();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint, so the stored theme is already on <html>
            when the page renders. Resolving this in an effect instead is what
            made light-theme users see a dark flash on every load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased cyber-grid">
        <LanguageProvider>
          <ThemeProvider>
            <ProfileProvider initialProfile={initialProfile}>
              {children}
            </ProfileProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

