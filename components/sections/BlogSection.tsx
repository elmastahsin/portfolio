"use client";

import React, { useEffect, useState } from "react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import { translations } from "@/data/profile";
import { BlogPost, initialBlogs, localizePost } from "@/data/blogs";
import { useLanguage } from "@/components/LanguageContext";
import { ChevronRight } from "lucide-react";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const { language } = useLanguage();
  const tSections = translations[language].sections;

  useEffect(() => {
    // 1. Fetch from database API
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Database fetch returned status " + res.status);
        return res.json();
      })
      .then((data: BlogPost[]) => {
        if (data && data.length > 0) {
          setBlogs(data);
        } else {
          loadFallback();
        }
      })
      .catch((err) => {
        console.warn("Could not fetch blogs from database, checking local fallback.", err);
        loadFallback();
      });

    function loadFallback() {
      const customBlogsStr = localStorage.getItem("custom_blogs");
      if (customBlogsStr) {
        try {
          const customBlogs = JSON.parse(customBlogsStr) as BlogPost[];
          setBlogs([...customBlogs, ...initialBlogs]);
        } catch (err) {
          console.error("Failed to parse custom blogs", err);
        }
      }
    }
  }, []);

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <Section id="blog" title={tSections.blogTitle} subtitle={tSections.blogSubtitle}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((original) => localizePost(original, language)).map((post, idx) => (
          <Reveal key={post.slug} delay={(idx % 3) * 70} className="flex">
            <a
              href={`/blog/${post.slug}`}
              className="press-motion group flex flex-1 flex-col rounded-[28px] bg-bg-tertiary dark:bg-bg-secondary p-8 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <p className="text-sm text-text-secondary">
                {post.category} · {post.readTime}
              </p>
              <h3 className="mt-3 font-display font-semibold text-[24px] leading-[1.15] tracking-[-0.015em] text-text-primary">
                {post.title}
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-text-secondary line-clamp-4">
                {post.summary}
              </p>
              <p className="mt-auto pt-8 flex items-center justify-between text-sm text-text-secondary">
                <span>{post.date}</span>
                <span className="inline-flex items-center text-[17px] text-accent-primary">
                  {language === "tr" ? "Oku" : "Read"}
                  <ChevronRight size={17} className="press-motion group-hover:translate-x-0.5" />
                </span>
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
