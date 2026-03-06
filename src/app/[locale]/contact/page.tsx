import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContactWizard from '@/components/interactive/ContactWizard'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.contact' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/contact`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: {
        en: `${SITE_URL}/en/contact`,
        ro: `${SITE_URL}/ro/contact`,
      },
    },
  }
}

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
