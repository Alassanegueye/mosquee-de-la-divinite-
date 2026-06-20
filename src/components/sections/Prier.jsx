import { images } from '../../data/content'
import Placeholder from '../ui/Placeholder'
import koriteImg from '../../assets/photo/Korite.jpg'
import tabaskiImg from '../../assets/photo/Tabaski.jpg'
import fayfaatImg from '../../assets/photo/Fayfaat.jpg'
import tasbihImg from '../../assets/photo/Journées prieres.jpg'

// PRIER — « Les Heures Sacrées » : grille des 5 prières (réf)
const PRAYERS = [
  ['الفجر', 'Fajr', '05:45', images.fajrImg],
  ['الظهر', 'Dhuhr', '13:15', images.jumaaImg],
  ['العصر', 'Asr', '16:40', images.asrImg],
  ['المغرب', 'Maghrib', '19:30', images.maghribImg],
  ['العشاء', 'Isha', '20:45', images.ishaImg],
]

// Prières spéciales (fêtes)
const SPECIALS = [
  {
    ar: 'صَلَاة الفِطْر',
    name: 'Julli Korité',
    sub: 'Eid al-Fitr',
    time: 'généralement à 9h00',
    img: koriteImg,
    caption: 'Julli Korité · Eid al-Fitr · Familles en tenues de fête · Enfants, adultes, personnes âgées',
  },
  {
    ar: 'صَلَاة الأَضْحَى',
    name: 'Julli Tabaski',
    sub: 'Eid al-Adha',
    time: 'généralement à 9h00',
    img: tabaskiImg,
    caption: 'Julli Tabaski · Eid al-Adha · Rassemblement familial · Toutes générations présentes',
  },
]

// Prières propres à la Mosquée de la Divinité
const PROPRES = [
  {
    img: fayfaatImg,
    ar: 'صَلَاة الفَيْفَات',
    name: 'Salatul Fayfaat',
    when: 'Dernier vendredi du Ramadan, après le Jumaah',
    desc: 'Une prière de réparation. Pour les prières accomplies imparfaitement ou oubliées sans le vouloir, afin de les réparer devant Dieu.',
  },
  {
    img: tasbihImg,
    ar: 'صَلَاة التَّسْبِيح',
    name: 'Salatul Tasbih',
    when: 'Dernier ou avant-dernier vendredi de décembre, après le Jumaah',
    desc: 'La prière de glorification. Allah pardonne vos péchés passés et futurs, grands et petits, oubliés ou intentionnels.',
  },
]

export default function Prier() {
  return (
    <section id="prier" className="section bg-teal">
      <div className="sw">
        <div className="prier-head">
          <div className="prier-head-left">
            <span className="eyebrow red">Prière</span>
            <h2 className="prier-title">La prière,<br />au cœur du lieu.</h2>
            <span className="eyebrow gold">Les Cinq Prières Quotidiennes</span>
          </div>
          <div className="prier-head-right">
            <p>
              La Mosquée de la Divinité accueille les cinq prières quotidiennes et l’ensemble
              du calendrier islamique. Tous les fidèles sont les bienvenus.
            </p>
          </div>
        </div>

        <div className="prayers2">
          {PRAYERS.map(([ar, name, time, img]) => (
            <div className="prayer2" key={name}>
              <div className="prayer2-top">
                <p className="prayer2-ar">{ar}</p>
                <p className="prayer2-name">{name}</p>
                <p className="prayer2-time">{time}</p>
              </div>
              <div className="prayer2-photo">
                {img
                  ? <img src={img} alt={name} className="ph" loading="lazy" />
                  : <Placeholder dark />}
              </div>
            </div>
          ))}
        </div>

        {/* Jumaah — prière du vendredi */}
        <div className="jumaah">
          <span className="eyebrow gold">Prière du vendredi</span>
          <div className="jumaah-photo">
            <img src={images.jumaaImg} alt="Prière du vendredi à la Mosquée de la Divinité" loading="lazy" />
          </div>
          <div className="jumaah-card">
            <div className="jumaah-ar">الجُمُعَة</div>
            <div className="jumaah-content">
              <span className="jumaah-label">Jumaah</span>
              <h3 className="jumaah-time">Chaque vendredi à 14h00</h3>
              <div className="jumaah-note">
                <span className="jumaah-note-k">Tenue recommandée</span>
                <p>La tenue blanche est de mise pour la prière du vendredi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prières spéciales (fêtes) */}
        <div className="special">
          <span className="eyebrow gold">Prières spéciales</span>
          <div className="special-grid">
            {SPECIALS.map((s) => (
              <article className="special-card" key={s.name}>
                <div className="special-photo">
                  <img src={s.img} alt={s.name} loading="lazy" />
                </div>
                <div className="special-body">
                  <p className="special-ar">{s.ar}</p>
                  <p className="special-name">{s.name}</p>
                  <p className="special-sub">{s.sub}</p>
                  <p className="special-time">{s.time}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Prières propres à la Mosquée de la Divinité */}
        <div className="pp">
          <span className="eyebrow gold">Prières propres à la Mosquée de la Divinité</span>
          <div className="pp-grid">
            {PROPRES.map((p) => (
              <article className="pp-card" key={p.name}>
                <div className="pp-photo">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <div className="pp-body">
                  <p className="pp-ar">{p.ar}</p>
                  <h4 className="pp-name">{p.name}</h4>
                  <p className="pp-when">{p.when}</p>
                  <div className="pp-rule" aria-hidden="true" />
                  <p className="pp-desc">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
