import { Variants } from "framer-motion";

export const DURATION_MICRO = 0.15; // 150ms
export const DURATION_REVEAL = 0.4; // 400ms (between 300-500ms as per design)
export const STAGGER_DELAY = 0.06; // 60ms

export const EASE_OUT = "easeOut";

/**
 * Standard variant for revealing sections or single items.
 * Fades in and slides up 16px.
 */
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_REVEAL,
      ease: EASE_OUT,
    },
  },
};

/**
 * Variant for staggering children items (like cards).
 * Use this on the parent container.
 */
export const staggerContainerVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};
