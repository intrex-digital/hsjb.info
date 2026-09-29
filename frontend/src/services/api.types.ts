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
