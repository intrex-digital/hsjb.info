import { ApiError, type ApiErrorResponse } from "./api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

class ApiClient {
  private get baseUrl() {
    return API_BASE_URL;
  }

  /**
   * Helper to build a URL with query string parameters.
   */
  private buildUrl(endpoint: string, params?: FetchOptions["params"]): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  /**
   * Core request method handling fetch, standard headers, JSON parsing, and error normalization.
   */
  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers: customHeaders, ...customOptions } = options;

    const url = this.buildUrl(endpoint, params);

    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    });

    const config: RequestInit = {
      ...customOptions,
      headers,
      // Pass cookies automatically for our upcoming httpOnly JWT auth implementation
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Try parsing JSON regardless of success/failure so we can read standard error format
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Check if data matches our standard ApiErrorResponse envelope
        if (isJson && data && typeof data === "object" && data.status === "error") {
          throw new ApiError(data as ApiErrorResponse);
        }

        // Fallback for non-standard errors (e.g., 500 HTML page or network level issue)
        throw new ApiError({
          status: "error",
          code: "unknown_error",
          message: typeof data === "string" ? data : response.statusText,
          detail: null,
        });
      }

      return data as T;
    } catch (error) {
      // Re-throw ApiError unmodified
      if (error instanceof ApiError) {
        throw error;
      }

      // Catch network-level failures (e.g. server is down)
      throw new ApiError({
        status: "error",
        code: "network_error",
        message: error instanceof Error ? error.message : "A network error occurred",
        detail: null,
      });
    }
  }

  // Convenience methods
  get<T>(endpoint: string, options?: Omit<FetchOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: Omit<FetchOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
