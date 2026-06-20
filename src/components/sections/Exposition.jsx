import { images, EXPO_THEMES } from '../../data/content'

export default function Exposition() {
  return (
    <section id="exposition" className="section bg-white">
      <div className="sw">
        <div className="expo-layout">
          {/* Texte à gauche */}
          <div className="expo-text">
            <div className="ey ey-g">Exposition</div>
            <h2 className="h2 h2-dk">Du Songe à la Mosquée.</h2>
            <span className="subhead-rule" />
            <p className="bp bp-dk">
              Une exposition permanente retrace l’histoire de la mosquée, de la révélation en
              songe de 1973 à aujourd’hui. Des photographies d’archives officielles du Mouvement
              Naby Allah témoignent d’une construction hors du commun.
            </p>
          </div>

          {/* Galerie mosaïque à droite */}
          <div className="expo-gallery">
            <div className="expo-col">
              <div className="expo-tile expo-tile-tall">
                <img src={images.expoImg} alt="Exposition de la mosquée" loading="lazy" />
              </div>
              <div className="expo-tile expo-tile-short">
                <img src={images.exposition3} alt="Photographie d’archive du Mouvement Naby Allah" loading="lazy" />
              </div>
            </div>
            <div className="expo-col expo-col-offset">
              <div className="expo-tile expo-tile-short">
                <img src={images.exposition4} alt="Le site avant la construction de la mosquée" loading="lazy" />
              </div>
              <div className="expo-tile expo-tile-tall">
                <img src={images.expo2Img} alt="Archives de la mosquée" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        {/* Thèmes (I → VI) */}
        <div className="expo-themes expo-themes-grid">
          {EXPO_THEMES.map(([num, title, date, body]) => (
            <div className="et" key={num}>
              <span className="et-num">{num}</span>
              <div>
                <div className="et-title">{title}{date && <span className="et-date"> · {date}</span>}</div>
                <p className="et-body">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="expo-note">
          Les photographies sont la propriété exclusive du Mouvement Naby Allah. Toute reproduction
          requiert une autorisation expresse.
        </p>
        <a href="#visiter" className="btn-teal">Planifier une visite →</a>
      </div>
    </section>
  )
}
