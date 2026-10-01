import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BlogPostView } from "./blog-post";
import { BlogPost } from "@/services/api.types";

const mockPost: BlogPost = {
  id: 1,
  title: "Building Resilient Distributed Systems",
  slug: "building-resilient-distributed-systems",
  excerpt: "Key concepts for designing distributed applications.",
  content:
    "# Distributed Systems\n\nHere is a code block:\n\n```python\ndef test():\n    return True\n```",
  cover_image_url: "https://example.com/cover.jpg",
  status: "published",
  published_at: "2026-09-25T12:00:00Z",
  categories: [
    { id: 1, name: "Architecture", slug: "architecture", created_at: "", updated_at: "" },
  ],
  tags: [{ id: 1, name: "Python", slug: "python", created_at: "", updated_at: "" }],
  created_at: "2026-09-25T12:00:00Z",
  updated_at: "2026-09-25T12:00:00Z",
};

describe("BlogPostView Component", () => {
  it("renders post title, category, date, content, and tags", () => {
    render(<BlogPostView post={mockPost} />);

    expect(screen.getByText("Building Resilient Distributed Systems")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByText("September 25, 2026")).toBeInTheDocument();
    expect(screen.getByText("#Python")).toBeInTheDocument();
    expect(screen.getByAltText("Building Resilient Distributed Systems")).toBeInTheDocument();
  });
});
