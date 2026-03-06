import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Security from '@/components/sections/Security'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.security' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/security`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/security`,
      languages: {
        en: `${SITE_URL}/en/security`,
        ro: `${SITE_URL}/ro/security`,
      },
    },
  }
}

export default function SecurityPage() {
  return <Security />
}
