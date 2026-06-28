import mainsNuesImg from '../../assets/photo/A mains nues 2.jpg'
import SiratImg from '../../assets/photo/Sirat.jpg'

// CONSTRUCTION — récit de l'édification de la mosquée en 4 temps
const HANDS = [
  'Refus total de machines de levage lourdes par fidélité au rêve originel.',
  'Chaînes humaines pour acheminer le sable et le ciment depuis le haut de la falaise.',
  'Rôle central des femmes assurant la logistique et le soutien moral constant.',
  'Zéro accident mortel malgré les conditions de travail extrêmes au bord du gouffre.',
]

const PILLARS = [
  ['✦', 'Foi Pure', 'Inspiration divine'],
  ['∅', 'Autonomie', 'Aucune aide extérieure'],
  ['♦', 'Persévérance', '5 ans de labeur'],
  ['◎', 'Unité', 'Mouvement Communautaire'],
]

export default function Construction() {
  return (
    <section id="construction">
      {/* Nuit Fondatrice */}
      <div className="cons-night">
        <div className="cons-night-bg" aria-hidden="true" />
        <div className="sw cons-night-inner">
          <p className="cons-ar-glow">الله أكبر</p>
          <h3 className="cons-night-title">Nuit Fondatrice</h3>
          <p className="cons-night-quote">
            « Sous la voûte étoilée de 1973, l’étincelle divine traça les contours de ce
            qui allait devenir le phare spirituel de la côte dakaroise. Une nuit où le
            silence parla plus fort que le ressac. »
          </p>
        </div>
      </div>

      {/* Bâtie à mains nues */}
      <div className="cons-hands">
        <div className="sw cons-hands-grid">
          <div>
            <span className="eyebrow gold">Construction</span>
            <h3 className="cons-hands-title">Bâtie à mains nues.</h3>
            <span className="eyebrow gold">Bâtie à mains nues par toute une communauté.</span>
            <p className="cons-lead">
              Le chantier fut une prouesse humaine sans précédent. Hommes, femmes et enfants
              de la communauté Naby Allah se sont relayés pendant 5 ans et 5 mois.
            </p>
            <ul className="cons-list">
              {HANDS.map((t) => (
                <li key={t}>
                  <span className="cons-dash" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="cons-hands-visual">
            <div className="cons-hands-frame">
              <img src={mainsNuesImg} alt="La mosquée bâtie à mains nues par la communauté" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      {/* Pont Al Sirat */}
      <div className="cons-sirat">
        <div className="sw cons-sirat-inner">
          <span className="cons-eyebrow">L’Audace Architecturale</span>
          <h3 className="cons-sirat-title">Le Pont Al Sirat</h3>
          <div className="cons-sirat-banner-img">
            <img 
            src={SiratImg} alt="Passerelle du Pont Al Sirat entre les deux minarets" loading="lazy" />
          </div>
          <p className="cons-sirat-quote">
            Reliant les deux minarets à 45 mètres de hauteur, cette passerelle symbolise
            le passage périlleux vers la félicité éternelle. Construite par de jeunes
            bâtisseurs au cœur vaillant, elle défie les vents marins et le vertige.
          </p>
        </div>
      </div>

      {/* Piliers de l'édification */}
      <div className="cons-pillars">
        <div className="sw cons-pillars-grid">
          {PILLARS.map(([sym, label, desc]) => (
            <div className="cons-pillar" key={label}>
              <span className="cons-pillar-sym">{sym}</span>
              <p className="cons-pillar-label">{label}</p>
              <p className="cons-pillar-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
