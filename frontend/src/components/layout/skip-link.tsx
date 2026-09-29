import * as React from "react"
import { cn } from "cn"

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-md outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      Skip to main content
    </a>
  )
}
