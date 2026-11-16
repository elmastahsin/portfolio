import type { Metadata } from "next";
import { getBlogs } from "@/lib/database";
import { isPublished } from "@/data/blogs";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getBlogs()).find((b) => b.slug === slug && isPublished(b));
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.summary,
      authors: [post.author],
      tags: post.tags,
      images: [post.coverImage || "/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.coverImage || "/og-image.png"],
    },
  };
}

export default function BlogPostLayout({ children }: Props) {
  return children;
}
