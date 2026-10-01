"use client";

import * as React from "react";
import { Profile } from "@/services/api.types";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function About({ profile }: { profile: Profile }) {
  if (!profile.about_text) return null;

  // Split about text by double newlines for paragraphs
  const paragraphs = profile.about_text.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <section id="about" className="relative overflow-hidden py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionHeader
            badge="About Me"
            title="Get to know me"
            subtitle="My background, experience, and what I do."
            align="left"
            className="mb-12"
          />
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-start">
          {profile.about_image_url && (
            <ScrollReveal delay={0.2} className="relative group">
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border bg-muted shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.about_image_url}
                  alt="About me"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Decorative background element */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/20 to-transparent blur-2xl rounded-[3rem] opacity-50" />
            </ScrollReveal>
          )}

          <ScrollReveal delay={profile.about_image_url ? 0.4 : 0.2} className="flex flex-col gap-6">
            <div className="prose prose-zinc dark:prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
              {paragraphs.map((text, idx) => (
                <p key={idx} className="mb-6 last:mb-0">
                  {text}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
