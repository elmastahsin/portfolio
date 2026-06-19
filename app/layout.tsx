import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { ProfileProvider } from "@/components/ProfileContext";
import { profileData } from "@/data/profile";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${profileData.name} | ${profileData.title}`,
    template: `%s | ${profileData.name}`
  },
  description: profileData.tagline,
  keywords: [
    "Software Engineer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Computer Engineering",
    "Full-Stack Developer",
    "Portfolio",
    ...profileData.skills.flatMap(s => s.items)
  ],
  authors: [{ name: profileData.name }],
  creator: profileData.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://example.com",
    title: `${profileData.name} | ${profileData.title}`,
    description: profileData.tagline,
    siteName: `${profileData.name} Portfolio`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profileData.name} - ${profileData.title}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileData.name} | ${profileData.title}`,
    description: profileData.tagline,
    creator: "@example",
    images: ["/og-image.png"]
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary antialiased cyber-grid">
        <ThemeProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
