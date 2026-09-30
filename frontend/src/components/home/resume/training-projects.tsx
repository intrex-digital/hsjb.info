import * as React from "react"
import { TrainingProject } from "@/services/api.types"
import { Calendar, Users, ExternalLink, Code2 } from "lucide-react"

export function TrainingProjectsSection({ items }: { items: TrainingProject[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-muted-foreground">No training projects available.</p>
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
        <div key={item.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          
          {/* Timeline Icon */}
          <div className="flex items-center justify-center w-10 h-10 mt-6 rounded-full border-4 border-white dark:border-zinc-950 bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
            <Users className="w-5 h-5" />
          </div>

          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-500/30">
            <div className="flex flex-col gap-1 mb-3">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <div className="text-lg font-medium text-indigo-500 flex items-center gap-2">
                <span>{item.role}</span>
                <span className="text-muted-foreground text-sm font-normal px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  {item.institution}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(item.start_date)} - {item.is_current ? "Present" : formatDate(item.end_date)}
                </span>
              </div>
            </div>

            {item.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
                {item.description}
              </p>
            )}

            {/* Footer containing Tech and Links */}
            {(item.technologies || item.link) && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                {item.technologies && (
                  <div className="flex items-start gap-2">
                    <Code2 className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.split(",").map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-md"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link w-fit"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4 ml-1.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
