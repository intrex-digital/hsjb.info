"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/contexts/auth-context"
import { ApiError } from "@/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldError } from "@/components/ui/field-error"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, user, isLoading } = useAuth()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({})

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!isLoading && user?.is_staff) {
      router.replace("/admin")
    }
  }, [user, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      await login(email, password)
      toast.success("Welcome back!")
      router.push("/admin")
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.detail && typeof err.detail === "object") {
          setFieldErrors(err.detail as Record<string, string[]>)
        } else {
          toast.error(err.message || "Invalid credentials.")
        }
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm">
          {/* Icon + heading */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">Admin Login</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to access the dashboard
              </p>
            </div>
          </div>

          <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="admin@hsjb.info"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.email && <FieldError error={fieldErrors.email[0]} />}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!fieldErrors.password}
                  required
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && <FieldError error={fieldErrors.password[0]} />}
            </div>

            <Button
              id="admin-login-submit"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          hsjb.info &mdash; Admin Panel
        </p>
      </motion.div>
    </div>
  )
}
