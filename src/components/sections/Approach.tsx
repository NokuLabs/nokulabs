import SectionLabel from '@/components/ui/SectionLabel'
import type { ApproachColumn } from '@/types'

const columns: ApproachColumn[] = [
  {
    title: 'Operate on constraints',
    description:
      'We design under real operational limits: offline-first, audit trails, and strict change control.',
  },
  {
    title: 'Engineer for failure',
    description:
      'We assume failures happen and build systems that degrade safely, log everything, and recover cleanly.',
  },
  {
    title: 'Ship with discipline',
    description:
      'Clear scopes. Deterministic delivery. Documentation that survives audits and personnel turnover.',
  },
]

export default function Approach() {
  return (
    <section id="approach" className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <SectionLabel>Approach</SectionLabel>

        <h2 className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          Architecture-first delivery.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((c) => (
            <div key={c.title} className="border border-border bg-surface rounded-2xl p-8">
              <h3 className="text-h4 mb-3">{c.title}</h3>
              <p className="text-body text-secondary">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}