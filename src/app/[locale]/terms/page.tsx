import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.terms' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/terms`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms`,
      languages: {
        en: `${SITE_URL}/en/terms`,
        ro: `${SITE_URL}/ro/terms`,
      },
    },
  }
}

export default function TermsPage() {
  return (
    <section className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <h1 className="text-h2-mobile md:text-h2-desktop mb-6">Terms of Service</h1>

        <p className="text-body text-secondary max-w-text mb-8">
          By accessing this website you agree to the following terms. If you do not agree, please do not use this site.
        </p>

        <div className="space-y-6 max-w-text">
          <div>
            <h2 className="text-h4 mb-2">Scope</h2>
            <p className="text-body text-secondary">
              These terms govern access to the NOKU LABS informational website. Separate contractual terms apply to any engagement, project, or services agreement entered into with NOKU LABS.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">No Warranty</h2>
            <p className="text-body text-secondary">
              This website and its content are provided &quot;as is&quot; without warranties of any kind. NOKU LABS does not guarantee the accuracy, completeness, or timeliness of any information presented.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Limitation of Liability</h2>
            <p className="text-body text-secondary">
              NOKU LABS shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of or reliance on this website or its content.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Acceptable Use</h2>
            <p className="text-body text-secondary">
              You agree not to use this site for unlawful purposes, to distribute malicious content, or to attempt unauthorized access to any system or data.
            </p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">Changes</h2>
            <p className="text-body text-secondary">
              These terms may be updated without notice. Continued use of the site constitutes acceptance of the current terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
