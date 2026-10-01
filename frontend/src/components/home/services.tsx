"use client";

import * as React from "react";
import { Service } from "@/services/api.types";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Code2, PenTool, Search, Rocket, Layers, ArrowRight } from "lucide-react";

// A helper to pick an icon based on title or description if `icon_url` is missing
const getFallbackIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("design") || t.includes("ui") || t.includes("ux"))
    return <PenTool className="w-8 h-8" />;
  if (t.includes("seo") || t.includes("search") || t.includes("marketing"))
    return <Search className="w-8 h-8" />;
  if (t.includes("deploy") || t.includes("devops") || t.includes("cloud"))
    return <Rocket className="w-8 h-8" />;
  if (t.includes("architecture") || t.includes("system")) return <Layers className="w-8 h-8" />;
  return <Code2 className="w-8 h-8" />;
};

export function Services({ items, profileEmail }: { items: Service[]; profileEmail: string }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="services" className="relative py-24 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent dark:from-amber-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-transparent dark:from-orange-900/10 pointer-events-none" />

      <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <SectionHeader
            badge="Services"
            title="What I Offer"
            subtitle="Specialized services tailored to help your business scale and succeed."
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, idx) => {
            const mailtoLink = `mailto:${profileEmail}?subject=Enquiry regarding: ${encodeURIComponent(service.title)}`;

            return (
              <ScrollReveal
                key={service.id}
                delay={0.1 * (idx % 3)}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-amber-500/30 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 mb-6 transition-transform group-hover:scale-110 duration-300">
                    {service.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.icon_url}
                        alt={service.title}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      getFallbackIcon(service.title)
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Pricing
                    </span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {service.price_range || "Contact for pricing"}
                    </span>
                  </div>

                  <a
                    href={mailtoLink}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors shadow-sm group/btn"
                    aria-label={`Enquire about ${service.title}`}
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:-rotate-45" />
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
