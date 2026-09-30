/**
 * Standard API error structure from the backend.
 */
export interface ApiErrorResponse {
  status: "error"
  code: string
  message: string
  detail?: Record<string, string[]> | null
}

/**
 * Standard paginated response envelope from the backend.
 */
export interface PaginatedResponse<T> {
  status: "ok"
  count: number | null
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Custom Error class that encapsulates our standard backend error format.
 */
export class ApiError extends Error {
  public code: string
  public detail?: Record<string, string[]> | null

  constructor(response: ApiErrorResponse) {
    super(response.message)
    this.name = "ApiError"
    this.code = response.code
    this.detail = response.detail
  }
}

export interface Profile {
  name: string
  headline: string
  short_bio: string
  hero_image_url: string
  about_text: string
  about_image_url: string
  email: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  resume_url: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  icon_url: string
  proficiency: number
  order: number
  category: number
}

export interface SkillCategory {
  id: number
  name: string
  order: number
  skills: Skill[]
}
