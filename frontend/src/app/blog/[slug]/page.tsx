import { BlogPost } from "@/services/api.types";
import { getBlogPostBySlug } from "@/services/blog";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/home/blog-post";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    return {
      title: `${post.title} | hsjb.info`,
      description: post.excerpt,
    };
  } catch {
    return { title: "Blog Post Not Found | hsjb.info" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: BlogPost;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="container max-w-4xl px-4 py-16">
      <BlogPostView post={post} />
    </div>
  );
}
