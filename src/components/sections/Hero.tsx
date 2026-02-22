import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-section-mobile md:pb-section-desktop px-6 lg:px-12 overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 grid-background opacity-40" aria-hidden="true" />

      {/* contrast overlay (A11y) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 bg-gradient-to-b from-background via-transparent to-background"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-content mx-auto w-full">
        <div className="max-w-5xl">
          {/* ✅ LCP must NOT be delayed by opacity animations */}
          <h1
            id="hero-title"
            className="text-h1-mobile md:text-h1-desktop mb-8 text-balance"
          >
            Infrastructure-grade software for operational environments.
          </h1>

          <p className="reveal reveal-delay-1 text-h2-mobile md:text-h2-desktop text-secondary mb-8 text-balance">
            We architect systems for organizations where failure has consequences.
          </p>

          <p className="reveal reveal-delay-2 text-body-lg text-secondary mb-12 max-w-text">
            Custom development, automation engineering, and security hardening for regulated and
            mission-critical operations.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4">
            <Button variant="primary" href="#engagement" aria-label="Start a conversation">
              Start a Conversation
            </Button>
            <Button variant="secondary" href="#systems" aria-label="View reference work">
              View Reference Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}