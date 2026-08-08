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
  User, Link as LinkIcon, Briefcase, GraduationCap, Award, FolderGit2, Languages, Image as ImageIcon
} from "lucide-react";
import { ProfileData } from "@/data/profile";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"blogs" | "profile" | "messages">("blogs");

  // Contact messages
  const [messages, setMessages] = useState<{ id: number; name: string; email: string; message: string; createdAt: string; read: boolean }[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

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
  const [profileImage, setProfileImage] = useState("");
  const [profileThemeColor, setProfileThemeColor] = useState<"emerald" | "cyan" | "amber" | "fuchsia" | "red">("emerald");
  const [profileLanguages, setProfileLanguages] = useState("");
  
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
  const [skillsList, setSkillsList] = useState<{ title: string; items: string }[]>([]);

  // Projects Form fields
  const [projectsList, setProjectsList] = useState<{
    title: string;
    description: string;
    techStack: string;
    keyImpact: string;
    githubLink: string;
    liveLink: string;
    caseStudyLink: string;
  }[]>([]);

  // Experience Form fields
  const [experienceList, setExperienceList] = useState<{
    company: string;
    role: string;
    location: string;
    dateRange: string;
    responsibilities: string;
    keyAchievements: string;
  }[]>([]);

  // Education Form fields
  const [educationList, setEducationList] = useState<{
    university: string;
    degree: string;
    department: string;
    dateRange: string;
    location: string;
    coursework: string;
    focus: string;
  }[]>([]);

  // Certifications Form fields
  const [certificationsList, setCertificationsList] = useState<{
    title: string;
    issuer: string;
    date: string;
    url: string;
    description: string;
  }[]>([]);
  
  // Global Notification
  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    setIsClient(true);
    // Authentication Check with Server
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/auth", {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("admin_session");
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });

    // Load initial list
    loadBlogs();
    loadMessages();

    // Map profile values to form states
    setProfileName(profile.name || "");
    setProfileTitle(profile.title || "");
    setProfileTagline(profile.tagline || "");
    setProfileLocation(profile.location || "");
    setProfileEmail(profile.email || "");
    setProfileCvUrl(profile.cvUrl || "");
    setProfileImage(profile.profileImage || "/images/profile.jpg");
    setProfileThemeColor(profile.themeColor || "emerald");
    setProfileLanguages((profile.languages || []).join(", "));
    
    setProfileBio(profile.about?.bio || "");
    setProfileCurrentRole(profile.about?.currentRole || "");
    setProfileEduSummary(profile.about?.educationSummary || "");
    setProfileCareerFocus(profile.about?.careerFocus || "");
    setProfileInterests((profile.about?.interests || []).join(", "));

    setSocialGithub(profile.socials?.github || "");
    setSocialLinkedin(profile.socials?.linkedin || "");
    setSocialTwitter(profile.socials?.twitter || "");
    setSocialMedium(profile.socials?.medium || "");
    setSocialScholar(profile.socials?.scholar || "");

    const rawSkills = profile.skills;
    const initialSkills = Array.isArray(rawSkills) 
      ? rawSkills 
      : [
          { title: "Backend Development", items: (rawSkills as any)?.backend || [] },
          { title: "Frontend & Mobile", items: (rawSkills as any)?.frontendMobile || [] },
          { title: "AI / Machine Learning", items: (rawSkills as any)?.aiMl || [] },
          { title: "Databases & Cache", items: (rawSkills as any)?.databases || [] },
          { title: "DevOps & Tools", items: (rawSkills as any)?.devOpsTools || [] },
          { title: "Architecture & Standards", items: (rawSkills as any)?.architectureCertifications || [] }
        ].filter(c => c.items && c.items.length > 0);

    setSkillsList(initialSkills.map(c => ({
      title: c.title,
      items: c.items.join(", ")
    })));

    setProjectsList((profile.projects || []).map(p => ({
      title: p.title || "",
      description: p.description || "",
      techStack: (p.techStack || []).join(", "),
      keyImpact: p.keyImpact || "",
      githubLink: p.githubLink || "",
      liveLink: p.liveLink || "",
      caseStudyLink: p.caseStudyLink || ""
    })));

    setExperienceList((profile.experience || []).map(e => ({
      company: e.company || "",
      role: e.role || "",
      location: e.location || "",
      dateRange: e.dateRange || "",
      responsibilities: (e.responsibilities || []).join("\n"),
      keyAchievements: (e.keyAchievements || []).join("\n")
    })));

    setEducationList((profile.education || []).map(ed => ({
      university: ed.university || "",
      degree: ed.degree || "",
      department: ed.department || "",
      dateRange: ed.dateRange || "",
      location: ed.location || "",
      coursework: (ed.coursework || []).join(", "),
      focus: ed.focus || ""
    })));

    setCertificationsList((profile.certifications || []).map(c => ({
      title: c.title || "",
      issuer: c.issuer || "",
      date: c.date || "",
      url: c.url || "",
      description: c.description || ""
    })));
  }, [router, profile]);

  const loadBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data: BlogPost[] = await res.json();
      setBlogs(data);
      setCustomBlogs(data.filter(b => !b.id.startsWith("post-")));
    } catch (e) {
      console.error("Could not load blogs from database, loading fallback static mock articles.", e);
      const local = localStorage.getItem("custom_blogs");
      let parsedCustom: BlogPost[] = [];
      if (local) {
        try {
          parsedCustom = JSON.parse(local) as BlogPost[];
          setCustomBlogs(parsedCustom);
        } catch (err) {
          console.error(err);
        }
      }
      setBlogs([...parsedCustom, ...initialBlogs]);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/contact", {
        headers: { "Authorization": token }
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      setMessages(await res.json());
    } catch (e) {
      console.error("Could not load contact messages.", e);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleMarkMessageRead = async (id: number) => {
    try {
      const token = localStorage.getItem("admin_token") || "";
      await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
        headers: { "Authorization": token }
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (e) {
      console.error("Could not mark message as read.", e);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": token }
      });
      if (!res.ok) throw new Error("Failed to delete message");
      setMessages(prev => prev.filter(m => m.id !== id));
      triggerNotification("Success: Message deleted");
    } catch (e) {
      console.error("Could not delete message.", e);
      triggerNotification("ERROR: Could not delete message", "error");
    }
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
  const handleSavePost = async (e: React.FormEvent) => {
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

    const isCreate = editorMode === "create";
    const postId = isCreate ? `custom-post-${Date.now()}` : (editingId as string);

    if (isCreate) {
      const isDuplicate = blogs.some((b) => b.slug === slug);
      if (isDuplicate) {
        triggerNotification("ERROR: Slug already exists in database", "error");
        return;
      }
    }

    const blogPayload: BlogPost = {
      id: postId,
      slug,
      title,
      summary,
      content,
      category,
      readTime,
      date: isCreate ? formattedDate : (blogs.find(b => b.id === postId)?.date || formattedDate),
      author: profileName || "Developer",
      tags
    };

    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(blogPayload)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      triggerNotification(isCreate ? "Success: Post published successfully!" : "Success: Post edited successfully!");
      
      // Update local storage backup
      let updatedCustom = [...customBlogs];
      if (isCreate) {
        updatedCustom = [blogPayload, ...updatedCustom];
      } else {
        updatedCustom = updatedCustom.map(b => b.id === postId ? blogPayload : b);
      }
      localStorage.setItem("custom_blogs", JSON.stringify(updatedCustom));
      
      loadBlogs();
      resetForm();
    } catch (err: any) {
      console.error("Database save failed, writing to local storage fallback only.", err);
      triggerNotification("DB_SAVE_FAILED, fallback to local storage active.", "error");

      let updatedCustom = [...customBlogs];
      if (isCreate) {
        updatedCustom = [blogPayload, ...updatedCustom];
      } else {
        updatedCustom = updatedCustom.map(b => b.id === postId ? blogPayload : b);
      }
      localStorage.setItem("custom_blogs", JSON.stringify(updatedCustom));
      loadBlogs();
      resetForm();
    }
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
  const handleDeletePost = async (id: string) => {
    if (id.startsWith("post-")) {
      triggerNotification("READONLY: Cannot delete static mock articles", "error");
      return;
    }
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        const token = localStorage.getItem("admin_token") || "";
        const res = await fetch(`/api/blogs?id=${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": token
          }
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        triggerNotification("Success: Post deleted successfully");
      } catch (err) {
        console.error("Failed to delete from DB", err);
        triggerNotification("DB delete failed, updating local storage fallback.", "error");
      }

      const filtered = customBlogs.filter((post) => post.id !== id);
      localStorage.setItem("custom_blogs", JSON.stringify(filtered));
      
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

    // Build languages list
    const languages = profileLanguages
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const updatedProfile: ProfileData = {
      ...profile,
      themeColor: profileThemeColor,
      name: profileName,
      title: profileTitle,
      tagline: profileTagline,
      location: profileLocation,
      email: profileEmail,
      cvUrl: profileCvUrl,
      profileImage: profileImage || "/images/profile.jpg",
      languages,
      socials: {
        github: socialGithub,
        linkedin: socialLinkedin,
        email: profileEmail ? `mailto:${profileEmail}` : "",
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
      skills: skillsList.map(s => ({
        title: s.title.trim(),
        items: s.items.split(",").map(i => i.trim()).filter(i => i.length > 0)
      })).filter(s => s.title.length > 0),
      projects: projectsList.map(p => ({
        title: p.title.trim(),
        description: p.description.trim(),
        techStack: p.techStack.split(",").map(t => t.trim()).filter(t => t.length > 0),
        keyImpact: p.keyImpact.trim(),
        githubLink: p.githubLink.trim() || undefined,
        liveLink: p.liveLink.trim() || undefined,
        caseStudyLink: p.caseStudyLink.trim() || undefined
      })).filter(p => p.title.length > 0),
      experience: experienceList.map(e => ({
        company: e.company.trim(),
        role: e.role.trim(),
        location: e.location.trim(),
        dateRange: e.dateRange.trim(),
        responsibilities: e.responsibilities.split("\n").map(r => r.trim()).filter(r => r.length > 0),
        keyAchievements: e.keyAchievements.split("\n").map(a => a.trim()).filter(a => a.length > 0)
      })).filter(e => e.company.length > 0 || e.role.length > 0),
      education: educationList.map(ed => ({
        university: ed.university.trim(),
        degree: ed.degree.trim(),
        department: ed.department.trim(),
        dateRange: ed.dateRange.trim(),
        location: ed.location.trim(),
        coursework: ed.coursework ? ed.coursework.split(",").map(c => c.trim()).filter(c => c.length > 0) : undefined,
        focus: ed.focus.trim() || undefined
      })).filter(ed => ed.university.length > 0),
      certifications: certificationsList.map(c => ({
        title: c.title.trim(),
        issuer: c.issuer.trim(),
        date: c.date.trim(),
        url: c.url.trim() || undefined,
        description: c.description.trim() || undefined
      })).filter(c => c.title.length > 0)
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
            <button
              onClick={() => setActiveTab("messages")}
              className={`relative px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-bg-secondary text-accent-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Messages
              {messages.some(m => !m.read) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-primary" />
              )}
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

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
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
                        Profile Image URL
                      </label>
                      <input
                        type="text"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. /images/profile.jpg"
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

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

                    <div>
                      <label className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 font-mono">
                        Languages (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={profileLanguages}
                        onChange={(e) => setProfileLanguages(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-border-color bg-bg-primary text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="e.g. Turkish (Native), English (Fluent)"
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs text-accent-primary font-bold">// 4. Skills & Capabilities</h3>
                    <button
                      type="button"
                      onClick={() => setSkillsList(prev => [...prev, { title: "", items: "" }])}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-primary hover:opacity-80 cursor-pointer"
                    >
                      + Add Category
                    </button>
                  </div>

                  <div className="space-y-4">
                    {skillsList.map((skill, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-color bg-bg-secondary/40 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => setSkillsList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 text-text-tertiary hover:text-red-500 rounded bg-bg-tertiary cursor-pointer transition-all"
                          title="Delete Category"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-6">
                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Category Title
                            </label>
                            <input
                              type="text"
                              value={skill.title}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                setSkillsList(prev => prev.map((s, i) => i === idx ? { ...s, title: newVal } : s));
                              }}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Backend Development"
                            />
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Skills (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={skill.items}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                setSkillsList(prev => prev.map((s, i) => i === idx ? { ...s, items: newVal } : s));
                              }}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary font-mono"
                              placeholder="e.g. Go, Rust, Python"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {skillsList.length === 0 && (
                      <p className="text-center font-mono text-[10px] text-text-tertiary py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color animate-fade-in">
                        No skill categories defined. Click "+ Add Category" to start.
                      </p>
                    )}
                  </div>
                </div>

                {/* 5. Featured Projects */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs text-accent-primary font-bold">// 5. Featured Projects</h3>
                    <button
                      type="button"
                      onClick={() => setProjectsList(prev => [...prev, { title: "", description: "", techStack: "", keyImpact: "", githubLink: "", liveLink: "", caseStudyLink: "" }])}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-primary hover:opacity-80 cursor-pointer"
                    >
                      + Add Project
                    </button>
                  </div>

                  <div className="space-y-4">
                    {projectsList.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-color bg-bg-secondary/40 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => setProjectsList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 text-text-tertiary hover:text-red-500 rounded bg-bg-tertiary cursor-pointer transition-all"
                          title="Delete Project"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-6">
                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, title: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Gurme Restaurant Recommendation App"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Key Impact / Award
                            </label>
                            <input
                              type="text"
                              value={proj.keyImpact}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, keyImpact: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Awarded 5th place out of 35 engineering projects"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Tech Stack (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={proj.techStack}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, techStack: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Java, Spring Boot, PostgreSQL, Docker"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Description Summary
                            </label>
                            <textarea
                              rows={2}
                              value={proj.description}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, description: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                              placeholder="Detailed summary of architecture and feature highlights..."
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              GitHub Repo URL
                            </label>
                            <input
                              type="text"
                              value={proj.githubLink}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, githubLink: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="https://github.com/username/repo"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Live Demo URL
                            </label>
                            <input
                              type="text"
                              value={proj.liveLink}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, liveLink: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="https://project.com"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Case Study URL
                            </label>
                            <input
                              type="text"
                              value={proj.caseStudyLink}
                              onChange={(e) => setProjectsList(prev => prev.map((p, i) => i === idx ? { ...p, caseStudyLink: e.target.value } : p))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="/blog/case-study"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {projectsList.length === 0 && (
                      <p className="text-center font-mono text-[10px] text-text-tertiary py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color">
                        No projects defined. Click "+ Add Project" to start.
                      </p>
                    )}
                  </div>
                </div>

                {/* 6. Work Experience */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs text-accent-primary font-bold">// 6. Work Experience</h3>
                    <button
                      type="button"
                      onClick={() => setExperienceList(prev => [...prev, { company: "", role: "", location: "", dateRange: "", responsibilities: "", keyAchievements: "" }])}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-primary hover:opacity-80 cursor-pointer"
                    >
                      + Add Experience
                    </button>
                  </div>

                  <div className="space-y-4">
                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-color bg-bg-secondary/40 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => setExperienceList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 text-text-tertiary hover:text-red-500 rounded bg-bg-tertiary cursor-pointer transition-all"
                          title="Delete Experience"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-6">
                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, company: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. IT KRAFT"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Role Title *
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, role: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Backend Developer"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, location: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Ankara, Turkey"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Date Range
                            </label>
                            <input
                              type="text"
                              value={exp.dateRange}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, dateRange: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. September 2024 - Present"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Responsibilities (One per line)
                            </label>
                            <textarea
                              rows={3}
                              value={exp.responsibilities}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, responsibilities: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none font-mono"
                              placeholder="Designed microservices REST APIs&#10;Containerized applications via Docker"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Key Achievements (One per line)
                            </label>
                            <textarea
                              rows={2}
                              value={exp.keyAchievements}
                              onChange={(e) => setExperienceList(prev => prev.map((item, i) => i === idx ? { ...item, keyAchievements: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none font-mono"
                              placeholder="Successfully launched gift card microservices&#10;Integrated Elasticsearch real-time transactional search"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {experienceList.length === 0 && (
                      <p className="text-center font-mono text-[10px] text-text-tertiary py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color">
                        No work experience defined. Click "+ Add Experience" to start.
                      </p>
                    )}
                  </div>
                </div>

                {/* 7. Academic Education */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs text-accent-primary font-bold">// 7. Academic Education</h3>
                    <button
                      type="button"
                      onClick={() => setEducationList(prev => [...prev, { university: "", degree: "", department: "", dateRange: "", location: "", coursework: "", focus: "" }])}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-primary hover:opacity-80 cursor-pointer"
                    >
                      + Add Education
                    </button>
                  </div>

                  <div className="space-y-4">
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-color bg-bg-secondary/40 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => setEducationList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 text-text-tertiary hover:text-red-500 rounded bg-bg-tertiary cursor-pointer transition-all"
                          title="Delete Education"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-6">
                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              University / School *
                            </label>
                            <input
                              type="text"
                              value={edu.university}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, university: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Middle East Technical University (METU)"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Degree Title
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, degree: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Bachelor of Science (B.S.)"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Department / Major
                            </label>
                            <input
                              type="text"
                              value={edu.department}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, department: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Computer Engineering"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Date Range
                            </label>
                            <input
                              type="text"
                              value={edu.dateRange}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, dateRange: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. 2022 - 2026"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Location
                            </label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, location: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Ankara, Turkey"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Relevant Coursework (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={edu.coursework}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, coursework: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Data Structures, Operating Systems, Machine Learning"
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Focus Area / Thesis Summary
                            </label>
                            <input
                              type="text"
                              value={edu.focus}
                              onChange={(e) => setEducationList(prev => prev.map((item, i) => i === idx ? { ...item, focus: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Backend microservices, database systems, and AI."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {educationList.length === 0 && (
                      <p className="text-center font-mono text-[10px] text-text-tertiary py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color">
                        No education items defined. Click "+ Add Education" to start.
                      </p>
                    )}
                  </div>
                </div>

                {/* 8. Certifications & Awards */}
                <div className="space-y-4 pt-4 border-t border-border-color/60">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs text-accent-primary font-bold">// 8. Certifications & Awards</h3>
                    <button
                      type="button"
                      onClick={() => setCertificationsList(prev => [...prev, { title: "", issuer: "", date: "", url: "", description: "" }])}
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-primary hover:opacity-80 cursor-pointer"
                    >
                      + Add Certification
                    </button>
                  </div>

                  <div className="space-y-4">
                    {certificationsList.map((cert, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-color bg-bg-secondary/40 space-y-3 relative group">
                        <button
                          type="button"
                          onClick={() => setCertificationsList(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 p-1 text-text-tertiary hover:text-red-500 rounded bg-bg-tertiary cursor-pointer transition-all"
                          title="Delete Certification"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-6">
                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Award / Certification Title *
                            </label>
                            <input
                              type="text"
                              value={cert.title}
                              onChange={(e) => setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, title: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. METU-CENG Demo Day 2025 – 5th Place Award"
                            />
                          </div>

                          <div className="sm:col-span-6">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Issuer / Organization
                            </label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, issuer: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. Middle East Technical University"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Date Issued
                            </label>
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) => setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, date: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="e.g. 2025"
                            />
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Credential Verification URL
                            </label>
                            <input
                              type="text"
                              value={cert.url}
                              onChange={(e) => setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, url: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary"
                              placeholder="https://verify.credential.org/..."
                            />
                          </div>

                          <div className="sm:col-span-12">
                            <label className="block text-[9px] font-bold text-text-tertiary uppercase tracking-wider mb-1 font-mono">
                              Description Summary
                            </label>
                            <textarea
                              rows={2}
                              value={cert.description}
                              onChange={(e) => setCertificationsList(prev => prev.map((item, i) => i === idx ? { ...item, description: e.target.value } : item))}
                              className="w-full px-3 py-1.5 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                              placeholder="Ranked 5th out of 35 engineering projects..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {certificationsList.length === 0 && (
                      <p className="text-center font-mono text-[10px] text-text-tertiary py-4 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color">
                        No certifications defined. Click "+ Add Certification" to start.
                      </p>
                    )}
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

        {/* Tab 3: Contact Messages */}
        {activeTab === "messages" && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-mono text-sm font-bold text-text-primary">
                Inbox <span className="text-text-tertiary">({messages.length})</span>
              </h2>
              <Button variant="outline" size="sm" onClick={loadMessages} className="font-mono text-xs cursor-pointer">
                Refresh
              </Button>
            </div>

            {messagesLoading && (
              <p className="font-mono text-xs text-text-tertiary">Loading messages...</p>
            )}

            {!messagesLoading && messages.length === 0 && (
              <p className="text-center font-mono text-[10px] text-text-tertiary py-8 bg-bg-secondary/20 rounded-xl border border-dashed border-border-color">
                No messages yet.
              </p>
            )}

            {messages.map((m) => (
              <Card
                key={m.id}
                hoverEffect={false}
                glassmorphism={true}
                className={`border p-5 ${m.read ? "border-border-color" : "border-accent-primary/40"}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="block text-sm font-bold text-text-primary">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-xs text-accent-primary font-mono hover:underline">{m.email}</a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-text-tertiary">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                    {!m.read && (
                      <button
                        onClick={() => handleMarkMessageRead(m.id)}
                        className="text-[10px] font-mono px-2 py-1 rounded border border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 cursor-pointer"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-1.5 rounded text-text-tertiary hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{m.message}</p>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
