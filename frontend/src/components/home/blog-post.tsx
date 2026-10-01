import { BlogPost } from "@/services/api.types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface Props {
  post: BlogPost;
}

export function BlogPostView({ post }: Props) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          {post.categories.map((cat) => (
            <Badge key={cat.id} variant="secondary">
              {cat.name}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        {formattedDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published_at!}>{formattedDate}</time>
          </div>
        )}
      </header>

      {post.cover_image_url && (
        <div className="relative aspect-video w-full">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="rounded-2xl object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="pt-8 border-t border-border flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag.id} variant="outline">
            #{tag.name}
          </Badge>
        ))}
      </footer>
    </article>
  );
}
