"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProfileData, profileData as defaultProfile } from "@/data/profile";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (newProfile: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    // Check if user has updated their details in the admin panel
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

  const updateProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    localStorage.setItem("custom_profile", JSON.stringify(newProfile));
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
