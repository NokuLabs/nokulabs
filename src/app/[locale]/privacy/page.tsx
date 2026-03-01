export default function PrivacyPage() {
  return (
    <section className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <h1 className="text-h2-mobile md:text-h2-desktop mb-6">Privacy Policy</h1>

        <p className="text-body text-secondary max-w-text mb-8">
          This policy describes how NOKU LABS handles information provided through this website.
        </p>

        <div className="space-y-6 max-w-text">
          <div>
            <h2 className="text-h4 mb-2">Data We Collect</h2>
            <p className="text-body text-secondary">
              We collect only the information you voluntarily submit via the contact form: organization name, work email, budget range, project timeline, and context summary. We do not use cookies, tracking pixels, or analytics scripts.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">How We Use It</h2>
            <p className="text-body text-secondary">
              Submitted data is used exclusively to evaluate your project request and respond via email. We do not sell, rent, or share your information with third parties.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Retention</h2>
            <p className="text-body text-secondary">
              Inquiry data is retained for the duration of the business relationship and deleted upon request. Email correspondence may be retained for up to 24 months.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Sharing</h2>
            <p className="text-body text-secondary">
              We do not share your data with third parties, advertisers, or data brokers under any circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Security</h2>
            <p className="text-body text-secondary">
              All data in transit is encrypted via TLS. Access to submitted inquiries is restricted to principals of NOKU LABS only.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Contact</h2>
            <p className="text-body text-secondary">
              To request deletion of your data or ask questions about this policy, contact us through the form on this site.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
