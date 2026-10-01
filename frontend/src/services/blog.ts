import { apiClient } from "./api-client"
import { BlogPost, BlogCategory, BlogTag, PaginatedResponse } from "./api.types"

export interface GetBlogPostsParams {
  search?: string
  category?: string
  tag?: string
  page?: number
  page_size?: number
}

export async function getBlogPosts(params?: GetBlogPostsParams): Promise<PaginatedResponse<BlogPost>> {
  return apiClient.get<PaginatedResponse<BlogPost>>("posts/", {
    params: {
      search: params?.search,
      category: params?.category,
      tag: params?.tag,
      page: params?.page,
      page_size: params?.page_size,
    },
  })
}

export async function getBlogCategories(): Promise<PaginatedResponse<BlogCategory>> {
  return apiClient.get<PaginatedResponse<BlogCategory>>("categories/")
}

export async function getBlogTags(): Promise<PaginatedResponse<BlogTag>> {
  return apiClient.get<PaginatedResponse<BlogTag>>("tags/")
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return apiClient.get<BlogPost>(`posts/${slug}/`)
}
