"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariant, staggerContainerVariant } from "@/lib/motion";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  stagger?: boolean;
  delay?: number;
  width?: "auto" | "100%";
}

export function ScrollReveal({
  children,
  stagger = false,
  delay = 0,
  width = "auto",
  className,
  ...props
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variant = stagger ? staggerContainerVariant : fadeUpVariant;

  // If user prefers reduced motion, just show the content directly without animation classes/variants.
  if (shouldReduceMotion) {
    return (
      <div style={{ width: width === "100%" ? "100%" : "auto" }} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      style={{ width: width === "100%" ? "100%" : "auto" }}
      className={className}
      custom={delay} // We could pass delay to custom if our variants used it, but fadeUpVariant is static.
      // If we want dynamic delay, we can inline it or adjust the variant. Let's apply transition delay directly if not staggering.
      {...(delay && !stagger ? { transition: { delay, duration: 0.4, ease: "easeOut" } } : {})}
    >
      {children}
    </motion.div>
  );
}
