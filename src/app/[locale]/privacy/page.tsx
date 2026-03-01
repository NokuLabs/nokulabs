import { getTranslations } from 'next-intl/server'

export default async function PrivacyPage() {
  const t = await getTranslations('legal.privacy')

  return (
    <section className="px-6 lg:px-12 py-section-mobile md:py-section-desktop">
      <div className="max-w-content mx-auto">
        <h1 className="text-h2-mobile md:text-h2-desktop mb-6">{t('title')}</h1>

        <p className="text-body text-secondary max-w-text mb-8">
          {t('intro')}
        </p>

        <div className="space-y-6 max-w-text">
          <div>
            <h2 className="text-h4 mb-2">{t('dataWeCollect.title')}</h2>
            <p className="text-body text-secondary">{t('dataWeCollect.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('howWeUse.title')}</h2>
            <p className="text-body text-secondary">{t('howWeUse.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('retention.title')}</h2>
            <p className="text-body text-secondary">{t('retention.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('sharing.title')}</h2>
            <p className="text-body text-secondary">{t('sharing.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('security.title')}</h2>
            <p className="text-body text-secondary">{t('security.body')}</p>
          </div>

          <div>
            <h2 className="text-h4 mb-2">{t('contact.title')}</h2>
            <p className="text-body text-secondary">{t('contact.body')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}