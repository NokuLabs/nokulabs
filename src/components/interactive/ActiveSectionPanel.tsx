'use client'

import type { CubeFace } from '@/components/interactive/CubeNav'
import About from '@/components/sections/About'
import Capabilities from '@/components/sections/Capabilities'
import Approach from '@/components/sections/Approach'
import Security from '@/components/sections/Security'
import TrustSignals from '@/components/sections/TrustSignals'
import Systems from '@/components/sections/Systems'
import ContactWizard from '@/components/interactive/ContactWizard'

function ContactSection() {
  return (
    <section
      id="contact-inline"
      className="bg-surface border-t border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-label="Contact"
    >
      <div className="max-w-content mx-auto">
        <ContactWizard />
      </div>
    </section>
  )
}

const SECTIONS: Record<CubeFace, React.ComponentType> = {
  about:        About,
  capabilities: Capabilities,
  approach:     Approach,
  work:         Systems,
  security:     Security,
  contact:      ContactSection,
}

export default function ActiveSectionPanel({ face }: { face: CubeFace }) {
  const Section = SECTIONS[face]
  return <Section />
}
