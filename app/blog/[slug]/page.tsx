"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost, initialBlogs } from "@/data/blogs";
import Badge from "@/components/ui/Badge";
import ThemeToggle from "@/components/Navbar"; // Navbar handles themes globally
import { Calendar, Clock, User, ArrowLeft, ArrowUp } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Try to fetch all blogs from the Supabase API first
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
        console.warn("Could not load blogs from Supabase, checking local/static fallback.", err);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary px-6">
        <div className="font-mono text-center space-y-4">
          <p className="text-sm text-accent-primary">// ERROR: 404_POST_NOT_FOUND</p>
          <h1 className="text-2xl font-bold font-display">Article Not Found</h1>
          <p className="text-xs text-text-tertiary">The file or path requested could not be resolved.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-xs font-bold text-accent-primary hover:opacity-80 cursor-pointer pt-4"
          >
            <ArrowLeft size={14} />
            Back to Terminal Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
      {/* Dynamic Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-text-secondary hover:text-accent-primary cursor-pointer active:scale-95 transition-all"
          >
            <ArrowLeft size={14} />
            &lt;Back to Home /&gt;
          </button>
          
          <div className="font-mono text-[10px] text-text-tertiary hidden sm:block">
            // Reading: {post.slug}.md
          </div>
        </div>
      </header>

      {/* Article Wrapper */}
      <article className="max-w-3xl mx-auto px-6 pt-12 md:pt-16">
        {/* Category & Tags */}
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="subtle" color="indigo">
            {post.category}
          </Badge>
          {post.tags?.map((tag, idx) => (
            <span key={idx} className="font-mono text-xs text-text-tertiary">
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl md:text-5xl text-text-primary mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author & Date metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary pb-8 border-b border-border-color mb-10">
          <span className="flex items-center gap-1.5 font-medium text-text-secondary">
            <User size={13} className="text-accent-primary" />
            {post.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {post.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.readTime}
          </span>
        </div>

        {/* Body Content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none 
            text-text-secondary leading-relaxed space-y-6 text-base font-normal
            prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary
            prose-h2:text-2xl prose-h2:pt-6 prose-h2:pb-2
            prose-h3:text-xl prose-h3:pt-4
            prose-code:font-mono prose-code:text-sm prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-border-color/30 prose-code:text-accent-primary
            prose-pre:bg-bg-tertiary prose-pre:border prose-pre:border-border-color prose-pre:p-4 prose-pre:rounded-xl prose-pre:font-mono prose-pre:text-xs prose-pre:block prose-pre:overflow-x-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Floating Scroll to Top */}
      {scrollProgress > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-accent-primary hover:bg-accent-secondary text-white shadow-lg shadow-accent-primary/20 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 z-40"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </div>
  );
}
