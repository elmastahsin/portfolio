"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost, initialBlogs, localizePost } from "@/data/blogs";
import { useLanguage } from "@/components/LanguageContext";
import { ChevronLeft, ArrowUp } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { language } = useLanguage();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Try to fetch all blogs from the database API first
    fetch("/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("API error status " + res.status);
        return res.json();
      })
      .then((blogs: BlogPost[]) => {
        const found = blogs.find((b) => b.slug === slug);
        if (found) {
          setPost(found);
        } else {
          loadFallback();
        }
      })
      .catch((err) => {
        console.warn("Could not load blogs from database, checking local/static fallback.", err);
        loadFallback();
      });

    function loadFallback() {
      // Check initialBlogs
      const foundStatic = initialBlogs.find((b) => b.slug === slug);
      if (foundStatic) {
        setPost(foundStatic);
        return;
      }

      // Check localStorage custom blogs
      const customBlogsStr = localStorage.getItem("custom_blogs");
      if (customBlogsStr) {
        try {
          const customBlogs = JSON.parse(customBlogsStr) as BlogPost[];
          const foundCustom = customBlogs.find((b) => b.slug === slug);
          if (foundCustom) {
            setPost(foundCustom);
            return;
          }
        } catch (err) {
          console.error("Failed to parse custom blogs", err);
        }
      }
    }
  }, [slug]);

  // Monitor reading scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-6 text-center">
        <h1 className="headline">{language === "tr" ? "Yazı bulunamadı." : "Article not found."}</h1>
        <p className="mt-4 text-[17px] text-text-secondary">
          {language === "tr" ? "Bağlantı eski olabilir ya da yazı kaldırılmış olabilir." : "The link may be outdated, or the post was removed."}
        </p>
        <button
          onClick={() => router.push("/#blog")}
          className="mt-8 inline-flex items-center text-[17px] text-accent-primary hover:underline cursor-pointer"
        >
          <ChevronLeft size={18} />
          {language === "tr" ? "Tüm yazılar" : "All articles"}
        </button>
      </div>
    );
  }

  const view = localizePost(post, language);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-24">
      {/* Reading progress: a hairline across the top, not a banner */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-accent-primary z-[60]"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <header className="material sticky top-0 z-40 px-6">
        <div className="max-w-[1080px] mx-auto h-12 flex items-center justify-between">
          <button
            onClick={() => router.push("/#blog")}
            className="press-motion inline-flex items-center text-sm text-accent-primary cursor-pointer active:scale-95"
          >
            <ChevronLeft size={16} />
            {language === "tr" ? "Yazılar" : "Writing"}
          </button>
          <span className="text-[15px] font-semibold tracking-tight text-text-primary">{post.author}</span>
        </div>
      </header>

      <article className="max-w-[692px] mx-auto px-6 pt-16 md:pt-24 animate-fade-in">
        <p className="text-sm text-text-secondary">
          {post.category} · {post.date} · {post.readTime}
        </p>

        <h1 className="mt-4 font-display font-semibold text-[clamp(2.25rem,1.6rem+2.8vw,3.5rem)] leading-[1.07] tracking-[-0.028em] text-text-primary">
          {view.title}
        </h1>

        <p className="mt-6 text-[21px] leading-snug text-text-secondary">{view.summary}</p>

        <div className="article mt-12 pt-10 border-t border-border-color" dangerouslySetInnerHTML={{ __html: view.content }} />

        {post.tags && post.tags.length > 0 && (
          <p className="mt-16 pt-6 border-t border-border-color text-sm text-text-secondary">
            {post.tags.map((tag) => `#${tag}`).join("  ")}
          </p>
        )}
      </article>

      {scrollProgress > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="press-motion material fixed bottom-6 right-6 p-3 rounded-full text-text-primary shadow-card-hover cursor-pointer active:scale-90 z-40"
          aria-label={language === "tr" ? "Başa dön" : "Back to top"}
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}
