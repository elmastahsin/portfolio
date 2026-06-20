import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { ProfileProvider } from "@/components/ProfileContext";
import { supabaseServer } from "@/lib/supabaseServer";
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
  if (!supabaseServer) return defaultProfile;
  try {
    const { data, error } = await supabaseServer
      .from("portfolio_profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) return defaultProfile;

    return {
      name: data.name,
      title: data.title,
      tagline: data.tagline,
      location: data.location,
      email: data.email,
      cvUrl: data.cv_url || data.cvUrl || "#",
      profileImage: data.profile_image || data.profileImage || "/images/profile.jpg",
      themeColor: data.theme_color || data.themeColor || "emerald",
      socials: data.socials || {},
      about: data.about || {},
      skills: data.skills || [],
      projects: data.projects || defaultProfile.projects,
      experience: data.experience || defaultProfile.experience,
      education: data.education || defaultProfile.education,
      certifications: data.certifications || defaultProfile.certifications,
      languages: data.languages || defaultProfile.languages
    };
  } catch (e) {
    console.error("Error fetching profile on server side:", e);
    return defaultProfile;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileData();
  return {
    metadataBase: new URL("https://example.com"),
    title: {
      default: `${profile.name} | ${profile.title}`,
      template: `%s | ${profile.name}`
    },
    description: profile.tagline,
    keywords: [
      "Software Engineer",
      "AI Engineer",
      "Machine Learning Engineer",
      "Computer Engineering",
      "Full-Stack Developer",
      "Portfolio",
      ...profile.skills.flatMap(s => s.items)
    ],
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://example.com",
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
      creator: "@example",
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
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased cyber-grid">
        <ThemeProvider>
          <ProfileProvider initialProfile={initialProfile}>
            {children}
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
