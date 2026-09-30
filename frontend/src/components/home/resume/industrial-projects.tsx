"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IndustrialProject } from "@/services/api.types"
import { Calendar, Building2, ExternalLink, X, Code2 } from "lucide-react"

export function IndustrialProjectsSection({ items }: { items: IndustrialProject[] }) {
  const [selectedProject, setSelectedProject] = React.useState<IndustrialProject | null>(null)

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedProject])

  if (!items || items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-muted-foreground">No industrial projects available.</p>
      </div>
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <>
      {/* Grid View */}
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((project) => (
          <motion.div
            key={project.id}
            layoutId={`project-card-${project.id}`}
            onClick={() => setSelectedProject(project)}
            className="group cursor-pointer flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Thumbnail / Header area */}
            <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                  <Building2 className="w-16 h-16" />
                </div>
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white line-clamp-1">{project.title}</h3>
                <p className="text-sm text-zinc-300 font-medium">{project.role}</p>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{project.company}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-xs font-semibold text-primary mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span>View Details</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 md:p-6 lg:p-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              layoutId={`project-card-${selectedProject.id}`}
              className="relative w-full max-w-4xl max-h-full overflow-hidden flex flex-col bg-white dark:bg-zinc-950 rounded-2xl md:rounded-3xl shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 w-full bg-zinc-100 dark:bg-zinc-900 shrink-0">
                  {selectedProject.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <Building2 className="w-24 h-24" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                      {selectedProject.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{selectedProject.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(selectedProject.start_date)} -{" "}
                          {selectedProject.is_current ? "Present" : formatDate(selectedProject.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
                  {/* Left Column: Description */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        Role Overview
                      </h4>
                      <p className="text-lg font-semibold text-primary mb-4">
                        {selectedProject.role}
                      </p>
                      <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Metadata */}
                  <div className="w-full md:w-72 shrink-0 space-y-8">
                    {selectedProject.technologies && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
                          <Code2 className="w-4 h-4 text-primary" />
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.split(",").map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-zinc-200 dark:border-zinc-800"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedProject.link && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
                          <ExternalLink className="w-4 h-4 text-primary" />
                          Live Project
                        </h4>
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          View Project
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
