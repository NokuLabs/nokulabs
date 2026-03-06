import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Capabilities from '@/components/sections/Capabilities'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.capabilities' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/capabilities`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/capabilities`,
      languages: {
        en: `${SITE_URL}/en/capabilities`,
        ro: `${SITE_URL}/ro/capabilities`,
      },
    },
  }
}

export default function CapabilitiesPage() {
  return <Capabilities />
}
