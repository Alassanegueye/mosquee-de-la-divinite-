import visuelMosquee from '../../assets/photo/DJI_0681.jpg'

// VISITER — « Un lieu ouvert à tous » : carte infos pratiques + photo + 3 points clés
const INFOS = [
  ['Adresse', 'Corniche-Ouest, Ouakam, Dakar'],
  ['Accès', 'Taxi · Applications de covoiturage · Marche depuis la Corniche-Ouest'],
  ['Tenue', 'Tenue modeste requise'],
  ['Coordonnées', '14°44’N · 17°31’W'],
]

const HIGHLIGHTS = [
  [
    'Vue sur l’Atlantique',
    'Deux minarets de 45 mètres face à l’océan. Un panorama unique, particulièrement au coucher du soleil sur la Corniche-Ouest.',
  ],
  [
    'Architecture divine',
    'Chaque détail fidèlement construit depuis la maquette révélée en songe en 1973. Mosaïques blanc et vert de l’Islam, une coupole suspendue en béton armé de 80 tonnes, deux minarets de 45 mètres face à l’Atlantique.',
  ],
  [
    'Accès non-musulmans',
    'Les non-musulmans sont bienvenus sur l’esplanade et dans les couloirs. La salle de prière est réservée aux musulmans. À travers les fenêtres, les visiteurs peuvent admirer l’architecture intérieure. Tenue modeste requise.',
  ],
]

export default function Visiter() {
  return (
    <section id="visiter" className="section bg-cream">
      <div className="sw">
        <div className="ey ey-g">Visiter</div>
        <h2 className="h2 h2-dk vis-head">Un lieu ouvert à tous.</h2>

        {/* Carte noire — informations pratiques */}
        <div className="vis-card">
          <div className="vis-card-left">
            <h3 className="vis-card-title">Corniche-Ouest,<br />Ouakam.</h3>
            <p className="vis-card-text">
              Perchée entre les falaises et l’Atlantique, la Mosquée de la Divinité est l’un des
              monuments les plus photographiés du Sénégal. Elle accueille fidèles et voyageurs du
              monde entier.
            </p>
          </div>
          <div className="vis-card-info">
            {INFOS.map(([k, v]) => (
              <div className="vis-info-row" key={k}>
                <span className="vis-info-k">{k}</span>
                <span className="vis-info-v">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grande photo aérienne */}
        <div className="vis-photo">
          <img
            src={visuelMosquee}
            alt="Vue aérienne de la Mosquée de la Divinité sur la baie de Ouakam"
            loading="lazy"
          />
        </div>

        {/* 3 points clés */}
        <div className="vis-highlights">
          {HIGHLIGHTS.map(([title, body]) => (
            <div className="vis-hl" key={title}>
              <span className="vis-hl-line" aria-hidden="true" />
              <h4 className="vis-hl-title">{title}</h4>
              <p className="vis-hl-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
