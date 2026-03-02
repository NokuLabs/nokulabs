import ContactWizard from '@/components/interactive/ContactWizard'

export default function ContactPage() {
  return (
    <section
      id="contact"
      className="px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-label="Contact"
    >
      <div className="max-w-content mx-auto">
        <ContactWizard />
      </div>
    </section>
  )
}
