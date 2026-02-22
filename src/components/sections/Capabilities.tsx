import { Code2, Cog, Workflow, Shield } from 'lucide-react'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ServiceCard } from '@/types'

const services: ServiceCard[] = [
  {
    title: 'Systems Architecture',
    description:
      'Infrastructure design, integration planning, and technical roadmap development.',
    icon: 'code',
  },
  {
    title: 'Automation Engineering',
    description: 'Process digitization, workflow orchestration, and operational tooling.',
    icon: 'cog',
  },
  {
    title: 'AI Workflow Integration',
    description:
      'Model deployment, pipeline automation, and operational ML within existing systems.',
    icon: 'workflow',
  },
  {
    title: 'Security Hardening',
    description:
      'Threat modeling, architecture review, access control design, and audit preparation.',
    icon: 'shield',
  },
]

const iconMap = {
  code: Code2,
  cog: Cog,
  workflow: Workflow,
  shield: Shield,
} as const

export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <SectionLabel>Capabilities</SectionLabel>

        <h2 className="text-h2-mobile md:text-h2-desktop mb-12 text-balance">
          Built for high-trust, high-stakes environments.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap]
            return (
              <div key={s.title} className="border border-border bg-background/40 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon aria-hidden="true" className="w-5 h-5 text-primary" />
                  <h3 className="text-h4">{s.title}</h3>
                </div>
                <p className="text-body text-secondary">{s.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}