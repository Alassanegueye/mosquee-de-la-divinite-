import { Link } from 'react-router-dom'
import { useT } from '../utils/useT'

// Page 404
export default function NotFound() {
  const t = useT()

  return (
    <section className="section bg-teal nf-page">
      <div className="sw nf-inner">
        <span className="eyebrow red">{t('Erreur 404')}</span>
        <h2 className="sec-title light">{t('Page')} <em>{t('introuvable')}</em></h2>
        <p className="nf-text">
          {t('La page que vous cherchez n’existe pas ou a été déplacée.')}
        </p>
        <div className="nf-ctas">
          <Link to="/" className="btn-gold">{t('Retour à l’accueil')}</Link>
          <Link to="/renovation" className="btn-w">{t('Découvrir la rénovation')}</Link>
        </div>
      </div>
    </section>
  )
}
