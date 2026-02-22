import SectionLabel from '@/components/ui/SectionLabel'
import type { TrustPillar } from '@/types'

const pillars: TrustPillar[] = [
  {
    title: 'Audit-ready by design',
    description: 'Immutable logs, RBAC, and deterministic outputs built into the workflow.',
    icon: 'shield',
  },
  {
    title: 'Operational discipline',
    description: 'Clear scope, clear ownership, and documentation that holds under scrutiny.',
    icon: 'workflow',
  },
  {
    title: 'Local-first capability',
    description: 'Systems that keep working when networks fail or constraints tighten.',
    icon: 'code',
  },
]

export default function TrustSignals() {
  return (
    <section id="trust" className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <SectionLabel>Trust Signals</SectionLabel>

        <h2 className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          Built for environments where errors have consequences.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className="border border-border bg-background/40 rounded-2xl p-8">
              <h3 className="text-h4 mb-3">{p.title}</h3>
              <p className="text-body text-secondary">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}