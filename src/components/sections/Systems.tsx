import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

export default function Systems() {
  return (
    <section id="systems" className="bg-surface border-y border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <SectionLabel>Reference Work</SectionLabel>

        <h2 className="text-h2-mobile md:text-h2-desktop mb-8 text-balance">
          CertDSP — operational-grade certification issuance.
        </h2>

        <p className="text-body-lg text-secondary mb-10 max-w-text">
          Built for regulated workflows: local-first data, reliable template rendering, PDF archiving,
          and audit-ready RBAC with immutable logs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" href="#engagement" aria-label="Discuss a similar system">
            Discuss a Similar System
          </Button>
        </div>
      </div>
    </section>
  )
}