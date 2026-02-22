import type { Variants } from "framer-motion";

export const motionTokens = {
  ease: [0.22, 1, 0.36, 1] as const, // institutional: smooth, no bounce
  duration: {
    fast: 0.22,
    normal: 0.35,
    slow: 0.5,
  },
  stagger: {
    subtle: 0.06,
    normal: 0.1,
  },
  offsetY: {
    subtle: 16,
    normal: 20,
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.ease },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: motionTokens.offsetY.subtle },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.ease },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionTokens.stagger.normal,
      delayChildren: 0.04,
    },
  },
};

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: motionTokens.offsetY.normal },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease },
  },
};