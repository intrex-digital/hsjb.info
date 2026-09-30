import { middleware } from "./middleware"
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock NextRequest and NextResponse
vi.mock("next/server", () => {
  return {
    NextResponse: {
      next: vi.fn(() => ({ type: "next" })),
      redirect: vi.fn((url) => ({
        type: "redirect",
        url: url.toString(),
        cookies: {
          delete: vi.fn(),
        },
      })),
    },
    NextRequest: vi.fn(),
  }
})

// Mock jose
vi.mock("jose", () => ({
  jwtVerify: vi.fn(),
}))

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createMockRequest(pathname: string, cookies: Record<string, string> = {}) {
    return {
      nextUrl: {
        pathname,
      },
      url: `http://localhost:3000${pathname}`,
      cookies: {
        get: vi.fn((key: string) => cookies[key] ? { value: cookies[key] } : undefined),
      },
    } as unknown as NextRequest
  }

  it("should ignore non-admin routes", async () => {
    const req = createMockRequest("/some-other-page")
    const res = await middleware(req)
    expect(res).toEqual({ type: "next" })
  })

  it("should allow login page for unauthenticated users", async () => {
    const req = createMockRequest("/admin/login")
    const res = await middleware(req)
    expect(res).toEqual({ type: "next" })
  })

  it("should redirect unauthenticated users from protected admin routes", async () => {
    const req = createMockRequest("/admin/dashboard")
    const res = await middleware(req)
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect((res as any).url).toContain("/admin/login?next=%2Fadmin%2Fdashboard")
  })

  it("should allow access to protected routes with a valid token", async () => {
    (jwtVerify as any).mockResolvedValueOnce(true)
    const req = createMockRequest("/admin/dashboard", { access: "valid-token" })
    const res = await middleware(req)
    expect(res).toEqual({ type: "next" })
  })

  it("should redirect to login and clear cookies for an invalid token on protected routes", async () => {
    (jwtVerify as any).mockRejectedValueOnce(new Error("Invalid token"))
    const req = createMockRequest("/admin/dashboard", { access: "invalid-token" })
    const res = await middleware(req)
    
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect((res as any).url).toContain("/admin/login?next=%2Fadmin%2Fdashboard")
    expect((res as any).cookies.delete).toHaveBeenCalledWith("access")
    expect((res as any).cookies.delete).toHaveBeenCalledWith("refresh")
  })

  it("should redirect logged in users away from the login page", async () => {
    (jwtVerify as any).mockResolvedValueOnce(true)
    const req = createMockRequest("/admin/login", { access: "valid-token" })
    const res = await middleware(req)
    
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect((res as any).url).toBe("http://localhost:3000/admin")
  })

  it("should allow access to login page if token is present but invalid", async () => {
    (jwtVerify as any).mockRejectedValueOnce(new Error("Invalid token"))
    const req = createMockRequest("/admin/login", { access: "invalid-token" })
    const res = await middleware(req)
    
    expect(res).toEqual({ type: "next" })
  })
})
