import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../globals.css'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '../i18n'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: true })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap', preload: true })

export const metadata: Metadata = {
  title: 'NOKU LABS – Infrastructure-grade software for operational environments',
  description:
    'We architect systems for organizations where failure has consequences. Custom development, automation engineering, and security hardening for regulated and mission-critical operations.'
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

  const messages = (await import(`../messages/${locale}.json`)).default

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-primary antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main id="main-content" role="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}