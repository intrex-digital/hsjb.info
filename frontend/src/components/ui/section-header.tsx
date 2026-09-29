import * as React from "react"
import { cn } from "cn"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  badge?: string
  align?: "left" | "center"
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  align = "left",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {badge && (
        <span className="inline-flex h-6 w-fit items-center justify-center rounded-full bg-secondary/50 px-3 text-xs font-semibold text-secondary-foreground shadow-sm">
          {badge}
        </span>
      )}
      
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        
        {subtitle && (
          <p className="max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
