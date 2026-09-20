import { images, EXPO_THEMES } from '../../data/content'
import { useT } from '../../utils/useT'

export default function Exposition() {
  const t = useT()

  return (
    <section id="exposition" className="section bg-white">
      <div className="sw">
        <div className="expo-layout">
          {/* Texte à gauche */}
          <div className="expo-text" data-reveal>
            <div className="ey ey-g">{t('Exposition')}</div>
            <h2 className="h2 h2-dk">{t('Du Songe à la Mosquée.')}</h2>
            <span className="subhead-rule" />
            <p className="bp bp-dk">
              {t('Une exposition permanente retrace l’histoire de la mosquée, de la révélation en songe de 1973 à aujourd’hui. Des photographies d’archives officielles du Mouvement Naby Allah témoignent d’une construction hors du commun.')}
            </p>
          </div>

          {/* Galerie mosaïque à droite */}
          <div className="expo-gallery" data-reveal>
            <div className="expo-col">
              <div className="expo-tile expo-tile-tall">
                <img src={images.expoImg} alt={t('Exposition de la mosquée')} loading="lazy" />
              </div>
              <div className="expo-tile expo-tile-short">
                <img src={images.exposition3} alt={t('Photographie d’archive du Mouvement Naby Allah')} loading="lazy" />
              </div>
            </div>
            <div className="expo-col expo-col-offset">
              <div className="expo-tile expo-tile-short">
                <img src={images.exposition4} alt={t('Le site avant la construction de la mosquée')} loading="lazy" />
              </div>
              <div className="expo-tile expo-tile-tall">
                <img src={images.expo2Img} alt={t('Archives de la mosquée')} loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        {/* Thèmes (I → VI) */}
        <div className="expo-themes expo-themes-grid" data-reveal>
          {EXPO_THEMES.map(([num, title, date, body]) => (
            <div className="et" key={num}>
              <span className="et-num">{num}</span>
              <div>
                <div className="et-title">{t(title)}{date && <span className="et-date"> · {t(date)}</span>}</div>
                <p className="et-body">{t(body)}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="expo-note">
          {t('Les photographies sont la propriété exclusive du Mouvement Naby Allah. Toute reproduction requiert une autorisation expresse.')}
        </p>
        <a href="#visiter" className="btn-teal">{t('Planifier une visite')} →</a>
      </div>
    </section>
  )
}
