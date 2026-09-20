import { images } from '../../data/content'
import { useT } from '../../utils/useT'

// HISTOIRE — « Née d'un rêve divin » (mise en page de référence : texte / citation + grille d'images)
export default function Histoire() {
  const t = useT()

  return (
    <section id="histoire" className="section hist2-section">
      <div className="sw">
        <div className="hist2-grid">
          {/* Colonne gauche : récit */}
          <div className="hist2-left" data-reveal>
            <span className="eyebrow red">{t('Origines')}</span>
            <h2 className="sec-title title-margin">{t('Née d’un rêve')} <br className="br-mobile-hide" /><em>{t('divin')}</em></h2>
            <div className="hist2-body">
              <p>{t('Une mosquée sur la Corniche de Ouakam. Deux minarets de 45 mètres face à l’océan. Une coupole de 80 tonnes suspendue dans l’air marin.')}</p>
              <p>{t('Elle existe parce qu’un homme a reçu un message, un ordre, une vision, et a choisi de ne pas le garder pour lui.')}</p>
              <p>{t('Cet homme s’appelle')} <strong>Mouhamed Gorgui Seyni Gueye</strong>{t(', dit Sangabi.')}</p>
              <p>{t('Depuis sa révélation de 1973, Sangabi a dessiné la mosquée telle qu’il l’avait vue. Cheikh Ngom, architecte de renom, a traduit fidèlement ses esquisses en plans.')}</p>
              <p>{t('Mais la construction elle-même, chaque pierre posée, chaque minaret érigé, chaque sac de ciment porté, c’est la communauté qui l’a faite. De ses mains. Quartier par quartier. Famille par famille.')}</p>
              <p>{t('Cette même communauté l’a aussi financée. Chacun selon ses moyens. Étape par étape.')}</p>
            </div>
          </div>

          {/* Colonne droite : citation + grille d'images (emplacements) */}
          <div className="hist2-right" data-reveal>
            <figure className="hist2-quote">
              <span className="hist2-qmark open" aria-hidden="true">“</span>
              <blockquote>{t('La vision venait d’en haut. Les esquisses venaient de Sangabi. L’édifice venait de la communauté.')}</blockquote>
              <span className="hist2-qmark close" aria-hidden="true">”</span>
              <span className="bar" />
            </figure>
            <div className="hist2-imgs">
              <div className="col5">
                <img src={images.khalifeJeune} alt={t('Le Khalife jeune')} className="hist2-img" loading="lazy" />
              </div>
              <div className="col7">
                <div>
                  <img src={images.khalifeReco} alt={t('Le Khalife en reconnaissance sur le site')} className="hist2-img" loading="lazy" />
                </div>
                <div>
                  <img src={images.avantMosquee} alt={t('Le site avant la construction de la mosquée')} className="hist2-img" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
