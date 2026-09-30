"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "cn"
import {
  Education,
  Training,
  Certification,
  IndustrialProject,
  TrainingProject,
} from "@/services/api.types"
import { SectionHeader } from "@/components/ui/section-header"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

import { EducationSection } from "./education"
import { TrainingSection } from "./training"
import { CertificationsSection } from "./certifications"
import { IndustrialProjectsSection } from "./industrial-projects"
import { TrainingProjectsSection } from "./training-projects"

export interface ResumeData {
  education: Education[]
  training: Training[]
  certifications: Certification[]
  industrialProjects: IndustrialProject[]
  trainingProjects: TrainingProject[]
}

const tabs = [
  { id: "education", label: "Education" },
  { id: "training", label: "Professional Training" },
  { id: "certifications", label: "Certifications" },
  { id: "industrial-projects", label: "Industrial Projects" },
  { id: "training-projects", label: "Training Projects" },
] as const

type TabId = typeof tabs[number]["id"]

export function Resume({ data }: { data: ResumeData }) {
  const [activeTab, setActiveTab] = React.useState<TabId>("education")

  return (
    <section id="resume" className="relative py-24 bg-zinc-50/50 dark:bg-zinc-950/20 overflow-hidden">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            badge="Resume"
            title="My Background"
            subtitle="My academic and professional journey."
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Navigation Sidebar */}
          <ScrollReveal delay={0.2} className="w-full lg:w-64 shrink-0">
            {/* Mobile: Horizontal scroll, Desktop: Vertical flex */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center justify-center lg:justify-start px-6 py-3 lg:py-4 text-sm md:text-base font-medium rounded-full lg:rounded-xl transition-colors whitespace-nowrap lg:whitespace-normal text-left",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-resume-tab"
                        className="absolute inset-0 bg-primary rounded-full lg:rounded-xl shadow-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Content Area */}
          <ScrollReveal delay={0.3} className="flex-1 min-h-[500px]">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Dynamic Sections */}
                  {activeTab === "education" && (
                    <EducationSection items={data.education} />
                  )}
                  {activeTab === "training" && (
                    <TrainingSection items={data.training} />
                  )}
                  {activeTab === "certifications" && (
                    <CertificationsSection items={data.certifications} />
                  )}
                  {activeTab === "industrial-projects" && (
                    <IndustrialProjectsSection items={data.industrialProjects} />
                  )}
                  {activeTab === "training-projects" && (
                    <TrainingProjectsSection items={data.trainingProjects} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
