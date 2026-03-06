import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Systems from '@/components/sections/Systems'

const SITE_URL = 'https://nokulabs.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.work' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `${SITE_URL}/${locale}/work`,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/work`,
      languages: {
        en: `${SITE_URL}/en/work`,
        ro: `${SITE_URL}/ro/work`,
      },
    },
  }
}

export default function WorkPage() {
  return <Systems />
}
