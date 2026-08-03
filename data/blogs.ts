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
}

export const initialBlogs: BlogPost[] = [];
