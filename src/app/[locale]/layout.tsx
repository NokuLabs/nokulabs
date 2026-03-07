import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionTransition from '@/components/layout/SectionTransition'
import { HomePanelProvider } from '@/context/HomePanelContext'

import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '../i18n'

const SITE_URL = 'https://nokulabs.com'

// ─── Structured data ──────────────────────────────────────────────────────────
// Schema.org JSON-LD for Organization + Service.
// "SoftwareCompany" is not a valid Schema.org type — Organization covers the
// full identity; a separate Service node captures the practice offering.
// Fields intentionally omitted (no verified data in project):
//   logo, sameAs (social profiles), address, telephone, founder, employee.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':       'Organization',
      '@id':         `${SITE_URL}/#organization`,
      name:          'NOKU Labs',
      url:           SITE_URL,
      email:         'contact@nokulabs.com',
      description:   'We architect systems for organizations where failure has consequences. Custom development, automation engineering, and security hardening for regulated and mission-critical operations.',
      areaServed:    'Global',
      knowsAbout: [
        'Systems Architecture',
        'Automation Engineering',
        'AI Workflow Integration',
        'Security Hardening',
        'Custom Software Development',
      ],
    },
    {
      '@type':       'Service',
      '@id':         `${SITE_URL}/#services`,
      name:          'Engineering Consulting Services',
      description:   'Architecture-first software delivery for regulated and mission-critical environments.',
      provider:      { '@id': `${SITE_URL}/#organization` },
      areaServed:    'Global',
      serviceType: [
        'Custom Development',
        'Automation Engineering',
        'AI Integration',
        'Security Hardening',
        'Systems Architecture',
      ],
    },
  ],
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap', preload: true })

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t          = await getTranslations({ locale, namespace: 'meta.home' })
  const ogLocale   = locale === 'ro' ? 'ro_RO' : 'en_US'
  const pageUrl    = `${SITE_URL}/${locale}`

  return {
    metadataBase: new URL(SITE_URL),
    title:        t('title'),
    description:  t('description'),
    openGraph: {
      title:       t('title'),
      description: t('description'),
      type:        'website',
      url:         pageUrl,
      siteName:    'NOKU Labs',
      locale:      ogLocale,
      images: [
        {
          url:    '/og/nokulabs-og.jpg',
          width:  1200,
          height: 630,
          alt:    'NOKU Labs — Infrastructure-grade software for operational environments',
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      title:       t('title'),
      description: t('description'),
      images:      ['/og/nokulabs-og.jpg'],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en:          `${SITE_URL}/en`,
        ro:          `${SITE_URL}/ro`,
        'x-default': `${SITE_URL}/ro`,
      },
    },
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  // Required for static rendering: sets locale without reading HTTP headers.
  setRequestLocale(locale)

  const messages = (await import(`../messages/${locale}.json`)).default

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-screen bg-background text-primary antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <HomePanelProvider>
            <Header />
            <SectionTransition>
              <main id="main-content" role="main">{children}</main>
            </SectionTransition>
            <Footer />
          </HomePanelProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}