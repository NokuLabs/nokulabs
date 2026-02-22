import SectionLabel from '@/components/ui/SectionLabel'

export default function Security() {
  return (
    <section id="security" className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <SectionLabel>Security</SectionLabel>

        <h2 className="text-h2-mobile md:text-h2-desktop mb-8 text-balance">
          Security hardening is part of the architecture — not an add-on.
        </h2>

        <ul className="space-y-4 text-body text-secondary max-w-text">
          <li>Threat modeling and risk mapping</li>
          <li>Access control design (RBAC), audit logging, and change control</li>
          <li>Encryption at rest, secrets handling, and local-only data strategies</li>
          <li>Operational security posture review</li>
        </ul>
      </div>
    </section>
  )
}