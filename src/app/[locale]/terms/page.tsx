import { getTranslations } from 'next-intl/server'

export default async function TermsPage() {
  const t = await getTranslations('legal.terms')

  return (
    <section className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <h1 className="text-h2-mobile md:text-h2-desktop mb-6">{t('title')}</h1>

        <p className="text-body text-secondary max-w-text mb-8">
          {t('intro')}
        </p>

        <div className="space-y-6 max-w-text">
          <div>
            <h2 className="text-h4 mb-2">{t('scope.title')}</h2>
            <p className="text-body text-secondary">{t('scope.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('noWarranty.title')}</h2>
            <p className="text-body text-secondary">{t('noWarranty.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('liability.title')}</h2>
            <p className="text-body text-secondary">{t('liability.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('acceptableUse.title')}</h2>
            <p className="text-body text-secondary">{t('acceptableUse.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('changes.title')}</h2>
            <p className="text-body text-secondary">{t('changes.body')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}