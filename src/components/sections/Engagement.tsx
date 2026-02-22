'use client'

import { motion } from 'framer-motion'
import ContactForm from '@/components/ui/ContactForm'
import { fadeUpVariants, staggerContainerVariants } from '@/components/motion/variants'

export default function Engagement() {
  return (
    <section
      id="engagement"
      className="py-section-mobile md:py-section-desktop px-6 lg:px-12 bg-surface"
      aria-labelledby="engagement-title"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainerVariants}
        >
          <motion.h2
            id="engagement-title"
            className="text-h2-mobile md:text-h2-desktop mb-6"
            variants={fadeUpVariants}
          >
            Request an Architecture Review.
          </motion.h2>

          <motion.p
            className="text-body-lg text-secondary mb-6"
            variants={fadeUpVariants}
          >
            This is a qualification gate — not a generic contact form. We’ll review your context,
            identify risk areas, and reply with a recommended next step.
          </motion.p>

          <motion.p
            className="text-body text-secondary"
            variants={fadeUpVariants}
          >
            Expected response window: <span className="text-primary">24–48 hours</span>. If your request
            is time-sensitive, specify it in the submission.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUpVariants}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}