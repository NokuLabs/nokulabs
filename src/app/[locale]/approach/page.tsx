import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Approach from '@/components/sections/Approach'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.approach' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/approach`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/approach`,
      languages: {
        en: `${SITE_URL}/en/approach`,
        ro: `${SITE_URL}/ro/approach`,
      },
    },
  }
}

export default function ApproachPage() {
  return <Approach />
}
