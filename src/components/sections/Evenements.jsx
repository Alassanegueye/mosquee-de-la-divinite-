import marsImg from '../../assets/photo/Fayfaat.jpg'
import juinImg from '../../assets/photo/DJI_0419.jpg'
import laylatImg from '../../assets/photo/Leylatul Qadr.jpg'
import maouloudImg from '../../assets/photo/Malwloud.jpg'
import octobreImg from '../../assets/photo/1er Octobre.jpg'
import decembreImg from '../../assets/photo/Journées prieres.jpg'

// ÉVÉNEMENTS — « Un calendrier vivant » : 2 commémorations majeures + événements nocturnes / autres
const FEATURED = [
  {
    img: marsImg,
    fit: 'contain',
    tag: 'Dernier samedi de mars',
    title: 'Commémoration de Mars',
    text: 'Commémoration de la descente spirituelle de Sangabi — Khalife de Dieu sur Terre. Un rassemblement annuel de recueillement, de mémoire et de fraternité.',
  },
  {
    img: juinImg,
    tag: 'Dernier samedi de juin',
    title: 'Commémoration de Juin',
    text: 'Commémoration de la descente spirituelle de la Mosquée de la Divinité — la nuit fondatrice du 28 au 29 juin 1973. Le moment le plus solennel du calendrier Naby Allah.',
  },
]

const NOCTURNES = [
  {
    img: laylatImg,
    tag: 'Nuit sacrée · Ramadan',
    name: 'Laylatul Qadr',
    detail: 'Nuit du Destin · la nuit la plus sacrée du Ramadan · à partir de 23h00',
  },
  {
    img: maouloudImg,
    tag: 'Nuit de célébration',
    name: 'Maouloud',
    detail: 'Naissance du Prophète Muhammad ﷺ · à partir de 23h00',
  },
]

const AUTRES = [
  {
    img: octobreImg,
    tag: 'Commémoration annuelle',
    name: '1er Octobre',
    detail: 'Commémoration de l’inauguration de la Mosquée · 1997',
  },
  {
    img: decembreImg,
    tag: 'Journées de prières · Décembre',
    name: 'Journées de Décembre',
    detail: 'Dernier ou avant-dernier vendredi de décembre · après le Jumaah',
  },
]

function MiniEvent({ ev, theme }) {
  return (
    <article className={`ev-mini ev-mini--${theme}`}>
      <div className="ev-mini-photo">
        <img src={ev.img} alt={ev.name} loading="lazy" />
      </div>
      <div className="ev-mini-body">
        <span className="ev-mini-tag">{ev.tag}</span>
        <h4 className="ev-mini-name">{ev.name}</h4>
        <p className="ev-mini-detail">{ev.detail}</p>
      </div>
    </article>
  )
}

export default function Evenements() {
  return (
    <section id="evenements" className="section ev-section">
      <div className="sw">
        <div className="ev-head">
          <div className="ey ey-g">Événements</div>
          <h2 className="h2 h2-dk">Un calendrier vivant.</h2>
        </div>

        {/* Deux commémorations majeures */}
        <div className="ev-feature-grid">
          {FEATURED.map((f) => (
            <article className="ev-feature" key={f.title}>
              <div className={`ev-feature-photo${f.fit === 'contain' ? ' ev-feature-photo--contain' : ''}`}>
                <img src={f.img} alt={f.title} loading="lazy" />
              </div>
              <div className="ev-feature-body">
                <span className="ev-eyebrow">{f.tag}</span>
                <h3 className="ev-feature-title">{f.title}</h3>
                <p className="ev-feature-text">{f.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Événements nocturnes / Autres événements */}
        <div className="ev-cols">
          <div className="ev-col">
            <span className="ev-col-eyebrow gold">Événements nocturnes</span>
            {NOCTURNES.map((ev) => (
              <MiniEvent ev={ev} theme="gold" key={ev.name} />
            ))}
          </div>
          <div className="ev-col">
            <span className="ev-col-eyebrow red">Autres événements</span>
            {AUTRES.map((ev) => (
              <MiniEvent ev={ev} theme="red" key={ev.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
