'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

export default function Systems() {
  const t      = useTranslations('systems')
  const locale = useLocale()

  return (
    <section
      id="systems"
      className="bg-surface border-y border-border px-6 lg:px-12 py-section-mobile md:py-section-desktop"
      aria-labelledby="systems-title"
    >
      <div className="max-w-content mx-auto">
        <SectionLabel>{t('label')}</SectionLabel>

        <h2 id="systems-title" className="text-h2-mobile md:text-h2-desktop mb-8 text-balance">
          {t('title')}
        </h2>

        <p className="text-body-lg text-secondary mb-10 max-w-text">
          {t('body')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" href={`/${locale}/contact`}>
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
