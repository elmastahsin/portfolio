export interface BlogTranslation {
  title: string;
  summary: string;
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // HTML or Markdown formatted content
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
  author: string;
  tags?: string[];
  // Missing status means "published" so posts created before drafts existed stay visible.
  status?: "draft" | "published";
  tr?: BlogTranslation;
  linkedinPost?: string;
  linkedinPostUrn?: string;
  linkedinSharedAt?: string;
}

export const initialBlogs: BlogPost[] = [];

export function isPublished(post: BlogPost): boolean {
  return post.status !== "draft";
}

export function localizePost(post: BlogPost, language: "en" | "tr"): BlogPost {
  if (language === "tr" && post.tr) {
    return { ...post, ...post.tr };
  }
  return post;
}
