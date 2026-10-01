"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "@/services/api.types";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Ambient background styling */}
      <div className="absolute inset-0 bg-zinc-950/5 dark:bg-black/5 -z-20" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            badge="My Skills"
            title="Technical Expertise"
            subtitle="Technologies and tools I use to build robust digital solutions."
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <ScrollReveal
              key={category.id}
              delay={0.1 * (idx % 3)}
              className="group relative flex flex-col gap-6 rounded-3xl border border-zinc-200/50 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all hover:shadow-md hover:border-primary/20 dark:border-white/10 dark:bg-zinc-950/50"
            >
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {category.name}
              </h3>

              <div className="flex flex-col gap-4">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="group/skill">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {skill.icon_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={skill.icon_url}
                            alt={`${skill.name} icon`}
                            className="w-5 h-5 object-contain"
                            loading="lazy"
                          />
                        )}
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover/skill:text-primary transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                        {skill.proficiency}%
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      {/* Progress Bar Fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500/80 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
