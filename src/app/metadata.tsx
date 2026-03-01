import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nokulabs.com'),
  title: 'NOKU LABS – Infrastructure-grade software for operational environments',
  description:
    'We architect systems for organizations where failure has consequences. Custom development, automation engineering, and security hardening for regulated and mission-critical operations. / Arhitectăm sisteme pentru organizații unde eșecul are consecințe. Dezvoltare custom, automatizări și hardening de securitate pentru operațiuni reglementate.',
  keywords: [
    // EN
    'infrastructure software',
    'systems architecture',
    'automation engineering',
    'security hardening',
    'mission-critical systems',
    'operational software',
    'compliance systems',
    // RO
    'arhitectură sisteme',
    'automatizări',
    'dezvoltare software',
    'securitate cibernetică',
    'hardening',
    'sisteme critice',
    'conformitate',
    'sector public',
  ],
  authors: [{ name: 'NOKU LABS' }],
  creator: 'NOKU LABS',
  publisher: 'NOKU LABS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'NOKU LABS – Infrastructure-grade software for operational environments',
    description:
      'Infrastructure-grade development, automation engineering, and security hardening for regulated operations.',
    siteName: 'NOKU LABS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOKU LABS – Infrastructure-grade software for operational environments',
    description: 'We architect systems for organizations where failure has consequences.',
  },
}