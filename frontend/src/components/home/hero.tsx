"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Profile } from "@/services/api.types";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Hero({ profile }: { profile: Profile }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden py-24">
      {/* Background ambient blurs */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]" />
      <div className="absolute right-0 top-0 -z-10 h-[300px] w-[300px] translate-x-1/3 -translate-y-1/4 rounded-full bg-purple-500/20 opacity-50 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/20 opacity-50 blur-[120px]" />

      <motion.div
        className="container flex max-w-5xl flex-col items-center text-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {profile.hero_image_url && (
          <motion.div variants={itemVariants} className="relative mb-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-xl ring-4 ring-primary/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.hero_image_url}
                alt={profile.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-medium tracking-wide text-primary md:text-2xl">
            Hi, I&apos;m {profile.name}
          </h2>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              {profile.headline}
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
        >
          {profile.short_bio}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <Button
            size="lg"
            className="h-14 px-8 text-base rounded-full group"
            render={<a href="#work" />}
          >
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="flex items-center gap-3">
            {profile.github_url && (
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                render={
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  />
                }
              >
                <GithubIcon className="h-5 w-5" />
              </Button>
            )}
            {profile.linkedin_url && (
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                render={
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  />
                }
              >
                <LinkedinIcon className="h-5 w-5" />
              </Button>
            )}
            {profile.twitter_url && (
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                render={
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  />
                }
              >
                <TwitterIcon className="h-5 w-5" />
              </Button>
            )}
            {profile.resume_url && (
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                title="Resume"
                render={
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Resume"
                  />
                }
              >
                <FileText className="h-5 w-5" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
