import * as React from "react"
import { Training } from "@/services/api.types"
import { Calendar, MapPin, Award } from "lucide-react"

export function TrainingSection({ items }: { items: Training[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-muted-foreground">No professional training history available.</p>
      </div>
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          
          {/* Timeline Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
            <Award className="w-5 h-5" />
          </div>

          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-500/30">
            <div className="flex flex-col gap-1 mb-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <div className="text-lg font-medium text-blue-500">
                {item.institution}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(item.start_date)} - {item.is_current ? "Present" : formatDate(item.end_date)}
                </span>
              </div>
              {item.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            {item.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
