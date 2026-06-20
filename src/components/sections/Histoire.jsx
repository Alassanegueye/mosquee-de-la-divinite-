import { images } from '../../data/content'

// HISTOIRE — « Née d'un rêve divin » (mise en page de référence : texte / citation + grille d'images)
export default function Histoire() {
  return (
    <section id="histoire" className="section bg-cream">
      <div className="sw">
        <div className="hist2-grid">
          {/* Colonne gauche : récit */}
          <div className="hist2-left">
            <span className="eyebrow red">Origines</span>
            <h2 className="sec-title title-margin">Née d’un rêve <br className="br-mobile-hide" /><em>divin</em></h2>
            <div className="hist2-body">
              <p>Une mosquée sur la Corniche de Ouakam. Deux minarets de 45 mètres face à l’océan. Une coupole de 80 tonnes suspendue dans l’air marin.</p>
              <p>Elle existe parce qu’un homme a reçu un message, un ordre, une vision, et a choisi de ne pas le garder pour lui.</p>
              <p>Cet homme s’appelle <strong>Mouhamed Gorgui Seyni Gueye</strong>, dit Sangabi.</p>
              <p>Depuis sa révélation de 1973, Sangabi a dessiné la mosquée telle qu’il l’avait vue. Cheikh Ngom, architecte de renom, a traduit fidèlement ses esquisses en plans.</p>
              <p>Mais la construction elle-même, chaque pierre posée, chaque minaret érigé, chaque sac de ciment porté, c’est la communauté qui l’a faite. De ses mains. Quartier par quartier. Famille par famille.</p>
              <p>Cette même communauté l’a aussi financée. Chacun selon ses moyens. Étape par étape.</p>
            </div>
          </div>

          {/* Colonne droite : citation + grille d'images (emplacements) */}
          <div className="hist2-right">
            <div className="hist2-quote">
              <p>«&nbsp;La vision venait d’en haut. Les esquisses venaient de Sangabi. L’édifice venait de la communauté.&nbsp;»</p>
              <span className="bar" />
            </div>
            <div className="hist2-imgs">
              <div className="col5">
                <img src={images.khalifeJeune} alt="Le Khalife jeune" className="hist2-img" loading="lazy" />
              </div>
              <div className="col7">
                <div>
                  <img src={images.khalifeReco} alt="Le Khalife en reconnaissance sur le site" className="hist2-img" loading="lazy" />
                </div>
                <div>
                  <img src={images.avantMosquee} alt="Le site avant la construction de la mosquée" className="hist2-img" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
