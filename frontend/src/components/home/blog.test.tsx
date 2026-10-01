import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlogSection } from "./blog";
import * as blogService from "@/services/blog";
import { BlogPost, BlogCategory } from "@/services/api.types";

vi.mock("@/services/blog", () => ({
  getBlogPosts: vi.fn(),
}));

const mockCategories: BlogCategory[] = [
  {
    id: 1,
    name: "Architecture",
    slug: "architecture",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  { id: 2, name: "Frontend", slug: "frontend", created_at: "2026-01-01", updated_at: "2026-01-01" },
];

const mockPosts: BlogPost[] = [
  {
    id: 101,
    title: "Understanding Microservices & Monoliths",
    slug: "understanding-microservices-monoliths",
    excerpt: "A deep dive into system design trade-offs.",
    content: "Detailed markdown content about architectural paradigms...",
    cover_image_url: "https://example.com/cover1.jpg",
    status: "published",
    published_at: "2026-09-15T12:00:00Z",
    categories: [mockCategories[0]],
    tags: [],
    created_at: "2026-09-15T12:00:00Z",
    updated_at: "2026-09-15T12:00:00Z",
  },
  {
    id: 102,
    title: "Next.js 16 App Router Patterns",
    slug: "nextjs-16-app-router-patterns",
    excerpt: "Mastering modern React Server Components.",
    content: "Let's explore server components and data fetching...",
    cover_image_url: "",
    status: "published",
    published_at: "2026-09-20T14:00:00Z",
    categories: [mockCategories[1]],
    tags: [],
    created_at: "2026-09-20T14:00:00Z",
    updated_at: "2026-09-20T14:00:00Z",
  },
];

describe("BlogSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial posts and categories correctly", () => {
    render(
      <BlogSection
        initialPosts={mockPosts}
        categories={mockCategories}
        totalCount={mockPosts.length}
      />,
    );

    expect(screen.getByText("Technical Insights & Articles")).toBeInTheDocument();
    expect(screen.getByText("Understanding Microservices & Monoliths")).toBeInTheDocument();
    expect(screen.getByText("Next.js 16 App Router Patterns")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Categories" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Architecture" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Frontend" })).toBeInTheDocument();
  });

  it("filters posts by category when a category button is clicked", async () => {
    vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
      status: "ok",
      count: 1,
      next: null,
      previous: null,
      results: [mockPosts[0]],
    });

    render(
      <BlogSection
        initialPosts={mockPosts}
        categories={mockCategories}
        totalCount={mockPosts.length}
      />,
    );

    const archButton = screen.getByRole("button", { name: "Architecture" });
    fireEvent.click(archButton);

    await waitFor(() => {
      expect(blogService.getBlogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "architecture",
          page: 1,
        }),
      );
    });
  });

  it("searches posts when user types in the search input", async () => {
    const user = userEvent.setup();
    vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
      status: "ok",
      count: 1,
      next: null,
      previous: null,
      results: [mockPosts[1]],
    });

    render(
      <BlogSection
        initialPosts={mockPosts}
        categories={mockCategories}
        totalCount={mockPosts.length}
      />,
    );

    const searchInput = screen.getByPlaceholderText(/Search articles/i);
    await user.type(searchInput, "Next.js");

    await waitFor(
      () => {
        expect(blogService.getBlogPosts).toHaveBeenCalledWith(
          expect.objectContaining({
            search: "Next.js",
            page: 1,
          }),
        );
      },
      { timeout: 1000 },
    );
  });

  it("shows empty state when no posts match", async () => {
    vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
      status: "ok",
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<BlogSection initialPosts={[]} categories={mockCategories} totalCount={0} />);

    await waitFor(() => {
      expect(screen.getByText("No articles found")).toBeInTheDocument();
    });
  });

  it("renders pagination and responds to page change", async () => {
    vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
      status: "ok",
      count: 12,
      next: "http://api.test/posts/?page=2",
      previous: null,
      results: mockPosts,
    });

    render(
      <BlogSection
        initialPosts={mockPosts}
        categories={mockCategories}
        totalCount={12}
        pageSize={6}
      />,
    );

    expect(screen.getByText(/Showing 1 – 6 of 12 articles/i)).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: /Next page/i });
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(blogService.getBlogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          page_size: 6,
        }),
      );
    });
  });
});
