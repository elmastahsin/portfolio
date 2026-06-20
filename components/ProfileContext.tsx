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
    // 1. Fetch from Supabase via API
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Database fetch returned status " + res.status);
        return res.json();
      })
      .then((dbProfile) => {
        if (dbProfile && dbProfile.name) {
          // Map database structure to ProfileData
          setProfile({
            name: dbProfile.name,
            title: dbProfile.title,
            tagline: dbProfile.tagline,
            location: dbProfile.location,
            email: dbProfile.email,
            cvUrl: dbProfile.cv_url || dbProfile.cvUrl || "#",
            profileImage: dbProfile.profile_image || dbProfile.profileImage || "/images/profile.jpg",
            themeColor: dbProfile.theme_color || dbProfile.themeColor || "emerald",
            socials: dbProfile.socials || {},
            about: dbProfile.about || {},
            skills: dbProfile.skills || [],
            projects: dbProfile.projects || defaultProfile.projects,
            experience: dbProfile.experience || defaultProfile.experience,
            education: dbProfile.education || defaultProfile.education,
            certifications: dbProfile.certifications || defaultProfile.certifications,
            languages: dbProfile.languages || defaultProfile.languages
          });
        } else {
          loadFromLocalStorage();
        }
      })
      .catch((err) => {
        console.warn("Could not fetch profile from Supabase, falling back to local storage.", err);
        loadFromLocalStorage();
      });

    function loadFromLocalStorage() {
      const saved = localStorage.getItem("custom_profile");
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to parse custom profile data", err);
        }
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
