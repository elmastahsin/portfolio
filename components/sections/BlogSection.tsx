"use client";

import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { BlogPost, initialBlogs } from "@/data/blogs";
import { Calendar, Clock, User, ArrowRight, Code } from "lucide-react";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  useEffect(() => {
    // Load custom blogs written in the admin panel
    const customBlogsStr = localStorage.getItem("custom_blogs");
    if (customBlogsStr) {
      try {
        const customBlogs = JSON.parse(customBlogsStr) as BlogPost[];
        setBlogs([...customBlogs, ...initialBlogs]);
      } catch (err) {
        console.error("Failed to parse custom blogs", err);
      }
    }
  }, []);

  return (
    <section id="blog" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
      {/* Section Title with Coder Aesthetic */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs text-text-tertiary dark:text-accent-primary/80 font-bold mb-1">// 08. fetch_published_articles()</div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary flex items-center gap-1">
            <span className="text-accent-secondary">await</span> fetchArticles<span className="text-text-tertiary">()</span> <span className="text-text-tertiary">{`{`}</span>
          </h2>
        </div>
        
        <div className="shrink-0 text-left sm:text-right">
          <span className="text-xs text-text-tertiary">
            // Total compiled articles: {blogs.length}
          </span>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((post) => (
          <Card
            key={post.slug}
            hoverEffect={true}
            glassmorphism={true}
            className="flex flex-col h-full border border-border-color justify-between p-6 md:p-8"
          >
            <div>
              {/* Top Meta: Category & Reading Time */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="subtle" color="indigo">
                  {post.category}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg md:text-xl text-text-primary hover:text-accent-primary transition-colors mb-3 leading-snug">
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h3>

              {/* Summary */}
              <p className="text-xs md:text-sm text-text-secondary mb-5 leading-relaxed font-normal">
                {post.summary}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="font-mono text-[10px] text-text-tertiary bg-bg-tertiary/75 px-2 py-0.5 rounded border border-border-color/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Meta & Read Action */}
            <div className="flex items-center justify-between pt-4 border-t border-border-color">
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <div className="p-1 rounded bg-bg-tertiary text-text-secondary shrink-0">
                  <User size={12} />
                </div>
                <span>{post.author}</span>
                <span className="text-border-color">•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </span>
              </div>

              <a
                href={`/blog/${post.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-accent-primary hover:text-accent-secondary transition-colors duration-200"
              >
                Read
                <ArrowRight size={12} />
              </a>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Closing Gutter */}
      <div className="font-mono text-text-tertiary text-sm mt-8 select-none">{"}"}</div>
    </section>
  );
}
