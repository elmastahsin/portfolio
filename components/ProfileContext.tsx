"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileData, profileData as defaultProfile } from "@/data/profile";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (newProfile: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
  initialProfile: ProfileData;
}

export function ProfileProvider({ children, initialProfile }: ProfileProviderProps) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  useEffect(() => {
    // Local storage fallback check (for quick local development shifts)
    const saved = localStorage.getItem("custom_profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse custom profile data", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    const html = document.documentElement;
    
    // Remove existing theme classes
    const classesToRemove: string[] = [];
    html.classList.forEach((c) => {
      if (c.startsWith("theme-")) {
        classesToRemove.push(c);
      }
    });
    classesToRemove.forEach((c) => html.classList.remove(c));

    // Add selected theme class
    if (profile.themeColor && profile.themeColor !== "emerald") {
      html.classList.add(`theme-${profile.themeColor}`);
    }
  }, [profile]);

  const updateProfile = async (newProfile: ProfileData) => {
    setProfile(newProfile);
    localStorage.setItem("custom_profile", JSON.stringify(newProfile));

    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(newProfile)
      });
      if (!res.ok) {
        console.error("Failed to save profile to database", await res.text());
      }
    } catch (err) {
      console.error("Error saving profile to database", err);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
