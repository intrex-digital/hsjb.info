import * as React from "react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-muted/20 py-8 md:py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:px-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tighter text-foreground"
          >
            HSJB<span className="text-primary">.info</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {currentYear} Hasibul Islam. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  )
}
