/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthProvider, useAuth } from "./auth-context"
import { apiClient } from "@/services"

// Mock the apiClient
vi.mock("@/services", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(public status: number, public data: any) {
      super("ApiError")
    }
  },
}))

const TestComponent = () => {
  const { user, isLoading, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <div data-testid="user">{user ? user.email : "No User"}</div>
      <button onClick={() => login("test@example.com", "password")}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with no user and fetch user on mount", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Initially loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Then resolves to the user
    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com")
    })
    
    expect(apiClient.get).toHaveBeenCalledWith("/auth/me/")
  })

  it("should handle failed initial fetch", async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error("Unauthorized"))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("No User")
    })
  })

  it("should allow login to update the user", async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error("Unauthorized")) // Initial fetch fails

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("No User")
    });

    // Setup mocks for login
    (apiClient.post as any).mockResolvedValueOnce({ status: "ok" });
    (apiClient.get as any).mockResolvedValueOnce({
      id: 1,
      email: "newuser@example.com",
    });

    act(() => {
      screen.getByText("Login").click()
    })

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("newuser@example.com")
    });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login/", {
      email: "test@example.com",
      password: "password",
    });
  })

  it("should clear the user on logout", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
    }); // Initial fetch succeeds

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com")
    });

    (apiClient.post as any).mockResolvedValueOnce({ status: "ok" });

    act(() => {
      screen.getByText("Logout").click()
    })

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("No User")
    })

    expect(apiClient.post).toHaveBeenCalledWith("/auth/logout/")
  })
})
