"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import { BlogPost, BlogCategory } from "@/services/api.types"
import { getBlogPosts } from "@/services/blog"
import { SectionHeader } from "@/components/ui/section-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { cn } from "@/lib/utils"

interface BlogSectionProps {
  initialPosts?: BlogPost[]
  categories?: BlogCategory[]
  totalCount?: number
  pageSize?: number
  showHeader?: boolean
  title?: string
  subtitle?: string
  badge?: string
}

function calculateReadingTime(content: string = ""): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Draft"
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BlogSection({
  initialPosts = [],
  categories = [],
  totalCount = 0,
  pageSize = 6,
  showHeader = true,
  title = "Technical Insights & Articles",
  subtitle = "Writings on full-stack architecture, distributed systems, and best practices.",
  badge = "Technical Blog",
}: BlogSectionProps) {
  const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts)
  const [total, setTotal] = React.useState<number>(totalCount || initialPosts.length)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const isInitialMount = React.useRef(true)

  // Debounce search query changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page to 1 when category changes
  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setCurrentPage(1)
  }

  // Fetch posts on search/category/page change
  const fetchPosts = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getBlogPosts({
        search: debouncedSearch || undefined,
        category: selectedCategory || undefined,
        page: currentPage,
        page_size: pageSize,
      })
      setPosts(response.results || [])
      setTotal(response.count ?? response.results?.length ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts.")
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, selectedCategory, currentPage, pageSize])

  // Trigger fetch on dependencies change (skip first render if initialPosts match)
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (initialPosts.length > 0 && !debouncedSearch && !selectedCategory && currentPage === 1) {
        return
      }
    }
    fetchPosts()
  }, [debouncedSearch, selectedCategory, currentPage, fetchPosts, initialPosts.length])

  const totalPages = Math.ceil(total / pageSize) || 1

  const handleClearFilters = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setSelectedCategory(null)
    setCurrentPage(1)
  }

  return (
    <section id="blog" className="relative py-24 bg-surface dark:bg-background overflow-hidden">
      {/* Subtle ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-primary-soft/40 blur-3xl"
      />

      <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        {showHeader && (
          <ScrollReveal>
            <SectionHeader
              badge={badge}
              title={title}
              subtitle={subtitle}
              align="center"
              className="mb-12"
            />
          </ScrollReveal>
        )}

        {/* Filter and Search Bar */}
        <ScrollReveal delay={0.1} className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                id="blog-search-input"
                type="search"
                placeholder="Search articles, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl bg-background dark:bg-surface border-border focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                type="button"
                onClick={() => handleCategorySelect(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface dark:bg-card border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(isSelected ? null : cat.slug)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-surface dark:bg-card border border-border text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Content Area */}
        {error ? (
          <ErrorState
            title="Failed to load blog posts"
            description={error}
            onRetry={fetchPosts}
            className="my-8"
          />
        ) : isLoading ? (
          /* Loading Skeleton Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pageSize > 6 ? 6 : pageSize }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm"
              >
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-6 w-4/5 rounded" />
                <Skeleton className="h-16 w-full rounded" />
                <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon={<BookOpen className="h-6 w-6 text-primary" />}
            title="No articles found"
            description={
              debouncedSearch || selectedCategory
                ? "No blog posts match your current search query or category filter."
                : "No blog posts have been published yet. Check back soon!"
            }
            action={
              (debouncedSearch || selectedCategory) && (
                <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )
            }
            className="my-8"
          />
        ) : (
          /* Blog Grid */
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {posts.map((post, idx) => {
                  const readingTime = calculateReadingTime(post.content)
                  return (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="group flex flex-col rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Cover Image */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative aspect-video w-full overflow-hidden bg-muted/20 block"
                        aria-label={`Read article: ${post.title}`}
                      >
                        {post.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/20 to-primary-soft text-primary/60">
                            <BookOpen className="w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-xs font-mono font-medium tracking-wider uppercase opacity-75">
                              Technical Post
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Metadata Row: Category & Reading Time */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {post.categories && post.categories.length > 0 ? (
                              post.categories.slice(0, 2).map((cat) => (
                                <Badge
                                  key={cat.id}
                                  variant="secondary"
                                  className="text-xs font-medium cursor-pointer hover:bg-secondary-strong"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleCategorySelect(cat.slug)
                                  }}
                                >
                                  {cat.name}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="text-xs font-medium">
                                Article
                              </Badge>
                            )}

                            <span className="inline-flex items-center gap-1 text-xs text-muted font-medium ml-auto">
                              <Clock className="w-3.5 h-3.5" />
                              {readingTime}
                            </span>
                          </div>

                          {/* Post Title */}
                          <h3 className="font-heading text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                              {post.title}
                            </Link>
                          </h3>

                          {/* Post Excerpt */}
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Card Footer: Date & Read Link */}
                        <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover group-hover:translate-x-0.5 transition-all"
                          >
                            Read article
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6">
                <p className="text-xs text-muted font-medium">
                  Showing {(currentPage - 1) * pageSize + 1} &ndash;{" "}
                  {Math.min(currentPage * pageSize, total)} of {total} articles
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="gap-1 h-9 rounded-lg"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1
                      const isCurrent = pageNum === currentPage
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={isLoading}
                          className={cn(
                            "h-9 w-9 rounded-lg text-xs font-medium transition-colors",
                            isCurrent
                              ? "bg-primary text-primary-foreground font-bold shadow-sm"
                              : "border border-border bg-surface text-foreground hover:bg-secondary/40"
                          )}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
                    className="gap-1 h-9 rounded-lg"
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
