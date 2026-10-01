import { Metadata } from "next"
import { BlogSection } from "@/components/home/blog"
import { BlogPost, BlogCategory, PaginatedResponse } from "@/services/api.types"

export const metadata: Metadata = {
  title: "Technical Blog | hsjb.info",
  description: "Writings on full-stack architecture, distributed systems, and best practices.",
}

async function getInitialPosts(): Promise<PaginatedResponse<BlogPost>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/posts/?page=1&page_size=6`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch initial blog posts")
    return res.json()
  } catch (error) {
    console.error("Initial blog posts fetch error:", error)
    return {
      status: "ok",
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  }
}

async function getCategories(): Promise<BlogCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/categories/`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch categories")
    const data = await res.json()
    return data.results || []
  } catch (error) {
    console.error("Categories fetch error:", error)
    return []
  }
}

export default async function BlogPage() {
  const [postsData, categories] = await Promise.all([
    getInitialPosts(),
    getCategories(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-6 pb-16">
        <BlogSection
          initialPosts={postsData.results}
          categories={categories}
          totalCount={postsData.count ?? postsData.results.length}
          pageSize={6}
          title="All Technical Articles"
          subtitle="Explore the complete archive of articles, guides, and architectural case studies."
          badge="Blog Directory"
        />
      </main>
    </div>
  )
}
