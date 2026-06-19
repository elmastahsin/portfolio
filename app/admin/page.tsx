"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { BlogPost, initialBlogs } from "@/data/blogs";
import { useProfile } from "@/components/ProfileContext";
import { 
  FileText, Plus, Trash2, Edit2, LogOut, Save, ArrowLeft, 
  Settings, CheckCircle2, ChevronRight, BookOpen, AlertCircle,
  User, Link as LinkIcon
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"blogs" | "profile">("blogs");

  // Blog states
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [customBlogs, setCustomBlogs] = useState<BlogPost[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Blog Form fields
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Backend");
  const [readTime, setReadTime] = useState("5 min read");
  const [tagsInput, setTagsInput] = useState("");

  // Profile Form fields
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileTagline, setProfileTagline] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileCvUrl, setProfileCvUrl] = useState("");
  const [profileThemeColor, setProfileThemeColor] = useState<"emerald" | "cyan" | "amber" | "fuchsia" | "red">("emerald");
  
  const [profileBio, setProfileBio] = useState("");
  const [profileCurrentRole, setProfileCurrentRole] = useState("");
  const [profileEduSummary, setProfileEduSummary] = useState("");
  const [profileCareerFocus, setProfileCareerFocus] = useState("");
  const [profileInterests, setProfileInterests] = useState("");

  const [socialGithub, setSocialGithub] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialMedium, setSocialMedium] = useState("");
  const [socialScholar, setSocialScholar] = useState("");
  
  // Skills Form fields
  const [skillsBackend, setSkillsBackend] = useState("");
  const [skillsFrontend, setSkillsFrontend] = useState("");
  const [skillsAiMl, setSkillsAiMl] = useState("");
  const [skillsDatabases, setSkillsDatabases] = useState("");
  const [skillsDevOps, setSkillsDevOps] = useState("");
  const [skillsArchitecture, setSkillsArchitecture] = useState("");
  
  // Global Notification
  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    setIsClient(true);
    // Authentication Check
    if (localStorage.getItem("admin_session") !== "true") {
      router.push("/admin/login");
      return;
    }

    // Load initial list
    loadBlogs();

    // Map profile values to form states
    setProfileName(profile.name);
    setProfileTitle(profile.title);
    setProfileTagline(profile.tagline);
    setProfileLocation(profile.location);
    setProfileEmail(profile.email);
    setProfileCvUrl(profile.cvUrl || "");
    setProfileThemeColor(profile.themeColor || "emerald");
    
    setProfileBio(profile.about.bio);
    setProfileCurrentRole(profile.about.currentRole);
    setProfileEduSummary(profile.about.educationSummary);
    setProfileCareerFocus(profile.about.careerFocus);
    setProfileInterests(profile.about.interests.join(", "));

    setSocialGithub(profile.socials.github || "");
    setSocialLinkedin(profile.socials.linkedin || "");
    setSocialTwitter(profile.socials.twitter || "");
    setSocialMedium(profile.socials.medium || "");
    setSocialScholar(profile.socials.scholar || "");

    setSkillsBackend(profile.skills?.backend?.join(", ") || "");
    setSkillsFrontend(profile.skills?.frontendMobile?.join(", ") || "");
    setSkillsAiMl(profile.skills?.aiMl?.join(", ") || "");
    setSkillsDatabases(profile.skills?.databases?.join(", ") || "");
    setSkillsDevOps(profile.skills?.devOpsTools?.join(", ") || "");
    setSkillsArchitecture(profile.skills?.architectureCertifications?.join(", ") || "");
  }, [router, profile]);

  const loadBlogs = () => {
    const local = localStorage.getItem("custom_blogs");
    let parsedCustom: BlogPost[] = [];
    if (local) {
      try {
        parsedCustom = JSON.parse(local) as BlogPost[];
        setCustomBlogs(parsedCustom);
      } catch (e) {
        console.error(e);
      }
    }
    setBlogs([...parsedCustom, ...initialBlogs]);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (editorMode === "create") {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const triggerNotification = (msg: string, type = "success") => {
    setNotif({ show: true, message: msg, type });
    setTimeout(() => {
      setNotif({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory("Backend");
    setReadTime("5 min read");
    setTagsInput("");
    setEditingId(null);
    setEditorMode("create");
  };

  // Save/Create Blog Post
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !summary || !content) {
      triggerNotification("Fields with '*' are mandatory", "error");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    let updatedCustom: BlogPost[] = [...customBlogs];

    if (editorMode === "create") {
      const isDuplicate = blogs.some((b) => b.slug === slug);
      if (isDuplicate) {
        triggerNotification("ERROR: Slug already exists in database", "error");
        return;
      }

      const newPost: BlogPost = {
        id: `custom-post-${Date.now()}`,
        slug,
        title,
        summary,
        content,
        category,
        readTime,
        date: formattedDate,
        author: profileName || "Developer",
        tags
      };

      updatedCustom = [newPost, ...updatedCustom];
      triggerNotification("Success: Post published successfully!");
    } else {
      updatedCustom = updatedCustom.map((post) => {
        if (post.id === editingId) {
          return {
            ...post,
            slug,
            title,
            summary,
            content,
            category,
            readTime,
            tags
          };
        }
        return post;
      });
      triggerNotification("Success: Post edited successfully!");
    }

    localStorage.setItem("custom_blogs", JSON.stringify(updatedCustom));
    loadBlogs();
    resetForm();
  };

  // Open Edit blog panel
  const handleStartEdit = (post: BlogPost) => {
    if (post.id.startsWith("post-")) {
      triggerNotification("READONLY: Cannot edit static mock articles", "error");
      return;
    }
    setEditorMode("edit");
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setReadTime(post.readTime);
    setTagsInput(post.tags?.join(", ") || "");
  };

  // Delete Blog Post
  const handleDeletePost = (id: string) => {
    if (id.startsWith("post-")) {
      triggerNotification("READONLY: Cannot delete static mock articles", "error");
      return;
    }
    if (confirm("Are you sure you want to delete this article?")) {
      const filtered = customBlogs.filter((post) => post.id !== id);
      localStorage.setItem("custom_blogs", JSON.stringify(filtered));
      triggerNotification("Success: Post deleted successfully");
      loadBlogs();
      if (editingId === id) resetForm();
    }
  };

  // Save Profile Settings Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileTitle || !profileEmail) {
      triggerNotification("Full Name, Professional Title, and Email are required", "error");
      return;
    }

    // Build interests list
    const interests = profileInterests
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const updatedProfile = {
      ...profile,
      themeColor: profileThemeColor,
      name: profileName,
      title: profileTitle,
      tagline: profileTagline,
      location: profileLocation,
      email: profileEmail,
      cvUrl: profileCvUrl,
      socials: {
        github: socialGithub,
        linkedin: socialLinkedin,
        email: `mailto:${profileEmail}`,
        twitter: socialTwitter,
        medium: socialMedium,
        scholar: socialScholar
      },
      about: {
        bio: profileBio,
        currentRole: profileCurrentRole,
        educationSummary: profileEduSummary,
        careerFocus: profileCareerFocus,
        interests
      },
      skills: {
        backend: skillsBackend.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
        frontendMobile: skillsFrontend.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
        aiMl: skillsAiMl.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
        databases: skillsDatabases.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
        devOpsTools: skillsDevOps.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
        architectureCertifications: skillsArchitecture.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      }
    };

    updateProfile(updatedProfile);
    triggerNotification("Success: Profile information updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Navbar header */}
      <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary cursor-pointer transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
              <Settings className="text-accent-primary animate-spin" size={16} style={{ animationDuration: '6s' }} />
              Console Dashboard
            </h1>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-bg-tertiary border border-border-color/60">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "blogs"
                  ? "bg-bg-secondary text-accent-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Manage Blogs
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-bg-secondary text-accent-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Profile Settings
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout} className="font-mono flex items-center gap-1.5 cursor-pointer">
              <LogOut size={13} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main dashboard content layout */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Floating Notification */}
        {notif.show && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-fade-in ${
            notif.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
          }`}>
            {notif.type === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
            <span className="text-xs font-semibold">{notif.message}</span>
          </div>
        )}

        {/* Tab 1: Blogs Editor */}
        {activeTab === "blogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: List blogs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                  <FileText size={18} className="text-accent-primary" />
                  Manage Blogs
                </h2>
                <span className="font-mono text-xs text-text-tertiary">
                  Total: {blogs.length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
                {blogs.map((post) => {
                  const isStatic = post.id.startsWith("post-");
                  return (
                    <div 
                      key={post.id} 
                      className={`p-4 rounded-xl border border-border-color bg-bg-secondary flex justify-between items-center transition-all ${
                        editingId === post.id ? "border-accent-primary/60 shadow-md shadow-accent-primary/5" : ""
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <Badge variant="subtle" color={isStatic ? "slate" : "indigo"} className="scale-[0.85] origin-left">
                            {isStatic ? "Mock" : "User"}
                          </Badge>
                          <span className="text-[10px] text-text-tertiary font-mono">{post.date}</span>
                        </div>
                        <h3 className="font-display font-bold text-sm text-text-primary truncate">
                          {post.title}
                        </h3>
                        <p className="text-[10px] text-text-tertiary truncate">
                          /{post.slug}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isStatic ? (
                          <>
                            <button
                              onClick={() => handleStartEdit(post)}
                              className="p-2 rounded bg-bg-tertiary text-text-secondary hover:text-accent-primary transition-all cursor-pointer"
                              title="Edit Post"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 rounded bg-bg-tertiary text-text-secondary hover:text-red-500 transition-all cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-mono text-text-tertiary px-2 select-none">// Static</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Edit blog Form */}
            <div className="lg:col-span-7">
              <Card hoverEffect={false} glassmorphism={true} className="border border-border-color p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-color">
                  <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                    <Plus size={18} className="text-accent-primary" />
                    {editorMode === "create" ? "Compile New Post" : "Edit Post"}
                  </h2>
                  {editorMode === "edit" && (
                    <button
                      onClick={resetForm}
                      className="font-mono text-xs text-text-tertiary hover:text-accent-primary cursor-pointer"
                    >
                      [Cancel Edit]
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePost} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="p-title" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        id="p-title"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Concurrency Optimization"
                      />
                    </div>

                    <div>
                      <label htmlFor="p-slug" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Router Slug (URL Path) *
                      </label>
                      <input
                        type="text"
                        id="p-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        disabled={editorMode === "edit"}
                        className="w-full px-3 py-2.5 rounded border border-border-color bg-bg-primary text-text-primary text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary disabled:opacity-60"
                        placeholder="e.g. concurrency-optimization"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="p-cat" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Category
                      </label>
                      <select
                        id="p-cat"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      >
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="AI & ML">AI & ML</option>
                        <option value="System Design">System Design</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="p-read" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Reading Duration
                      </label>
                      <input
                        type="text"
                        id="p-read"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. 5 min read"
                      />
                    </div>

                    <div>
                      <label htmlFor="p-tags" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        id="p-tags"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. golang, redis"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="p-summary" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                      Short Summary Description *
                    </label>
                    <input
                      type="text"
                      id="p-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      placeholder="Summarize the core theme of this post..."
                    />
                  </div>

                  <div>
                    <label htmlFor="p-content" className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                      Article Body Content (HTML tags supported) *
                    </label>
                    <textarea
                      id="p-content"
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                      placeholder="<h2>Subheading</h2><p>Your technical details...</p>"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 font-mono"
                  >
                    <Save size={15} />
                    {editorMode === "create" ? "Compile & Publish" : "Save Changes"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Profile Settings Form */}
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto">
            <Card hoverEffect={false} glassmorphism={true} className="border border-border-color p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-color">
                <User size={18} className="text-accent-primary" />
                <h2 className="font-display font-bold text-lg text-text-primary">
                  Edit Profile Information
                </h2>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Basic Details Group */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs text-accent-primary font-bold">// 1. Basic Metadata</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Alex Rivera"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Professional Title *
                      </label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Lead AI Systems Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. developer@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Location (City, ST)
                      </label>
                      <input
                        type="text"
                        value={profileLocation}
                        onChange={(e) => setProfileLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        CV Resume URL Link
                      </label>
                      <input
                        type="text"
                        value={profileCvUrl}
                        onChange={(e) => setProfileCvUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. /resume.pdf"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Accent Theme Color
                      </label>
                      <select
                        value={profileThemeColor}
                        onChange={(e) => setProfileThemeColor(e.target.value as any)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      >
                        <option value="emerald">Emerald Green (Default)</option>
                        <option value="cyan">Cyber Cyan & Indigo</option>
                        <option value="amber">Hacker Amber & Orange</option>
                        <option value="fuchsia">Cyberpunk Fuchsia & Violet</option>
                        <option value="red">Crimson Red</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                      Hero Tagline Sentence
                    </label>
                    <input
                      type="text"
                      value={profileTagline}
                      onChange={(e) => setProfileTagline(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      placeholder="Enter a positioning tagline..."
                    />
                  </div>
                </div>

                {/* About Me parameters */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <h3 className="font-mono text-xs text-accent-primary font-bold">// 2. About & Biography Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Current Role Summary
                      </label>
                      <input
                        type="text"
                        value={profileCurrentRole}
                        onChange={(e) => setProfileCurrentRole(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Lead Engineer at SynthAI"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Education Summary
                      </label>
                      <input
                        type="text"
                        value={profileEduSummary}
                        onChange={(e) => setProfileEduSummary(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. M.S. from Stanford"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Interests (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={profileInterests}
                        onChange={(e) => setProfileInterests(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. LLMs, Go, WebGPU"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                      Career Focus Mission
                    </label>
                    <input
                      type="text"
                      value={profileCareerFocus}
                      onChange={(e) => setProfileCareerFocus(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      placeholder="e.g. Building low-latency systems..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                      Professional Biography Paragraph
                    </label>
                    <textarea
                      rows={4}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                      placeholder="Describe your history, engineering ethos, and background..."
                    />
                  </div>
                </div>

                {/* Social media links */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <h3 className="font-mono text-xs text-accent-primary font-bold">// 3. Professional Social Links</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        GitHub Profile Link
                      </label>
                      <input
                        type="text"
                        value={socialGithub}
                        onChange={(e) => setSocialGithub(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        LinkedIn Profile Link
                      </label>
                      <input
                        type="text"
                        value={socialLinkedin}
                        onChange={(e) => setSocialLinkedin(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Twitter / X Link
                      </label>
                      <input
                        type="text"
                        value={socialTwitter}
                        onChange={(e) => setSocialTwitter(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Medium / Personal Blog Link
                      </label>
                      <input
                        type="text"
                        value={socialMedium}
                        onChange={(e) => setSocialMedium(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="https://medium.com/@username"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Google Scholar / Research Link
                      </label>
                      <input
                        type="text"
                        value={socialScholar}
                        onChange={(e) => setSocialScholar(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="https://scholar.google.com/citations?..."
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <h3 className="font-mono text-xs text-accent-primary font-bold">// 4. Skills & Capabilities (Comma Separated)</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Backend Development
                      </label>
                      <input
                        type="text"
                        value={skillsBackend}
                        onChange={(e) => setSkillsBackend(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Go, Python, Rust"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Frontend & Mobile
                      </label>
                      <input
                        type="text"
                        value={skillsFrontend}
                        onChange={(e) => setSkillsFrontend(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. React, Next.js, React Native"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        AI / Machine Learning
                      </label>
                      <input
                        type="text"
                        value={skillsAiMl}
                        onChange={(e) => setSkillsAiMl(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. PyTorch, Hugging Face, Transformers"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Databases & Cache
                      </label>
                      <input
                        type="text"
                        value={skillsDatabases}
                        onChange={(e) => setSkillsDatabases(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. PostgreSQL, Redis, MongoDB"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        DevOps & Tools
                      </label>
                      <input
                        type="text"
                        value={skillsDevOps}
                        onChange={(e) => setSkillsDevOps(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Docker, Kubernetes, AWS"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Architecture & Standards
                      </label>
                      <input
                        type="text"
                        value={skillsArchitecture}
                        onChange={(e) => setSkillsArchitecture(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Microservices, System Design"
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 font-mono pt-3"
                >
                  <Save size={15} />
                  Save Profile Info
                </Button>
              </form>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
