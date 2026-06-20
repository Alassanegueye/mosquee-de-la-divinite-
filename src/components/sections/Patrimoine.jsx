import { Link } from 'react-router-dom'
import { FiRefreshCw } from 'react-icons/fi'

// PATRIMOINE — « Une archive vivante » : texte + encadré de repères, lien vers la page Patrimoine
const ARCHIVE = [
  { k: '1926', v: 'Naissance de Sangabi · début de l’archive' },
  { k: '1977', v: 'Premier appel public' },
  { k: '50+', v: 'Ans d’archives documentées' },
  { k: '∞', v: 'Témoignages à préserver' },
  { k: <FiRefreshCw />, v: 'Archive numérique en construction' },
]

export default function Patrimoine() {
  return (
    <section id="patrimoine" className="section pat-section">
      <div className="sw pat-grid">
        <div className="pat-left">
          <span className="eyebrow gold">Patrimoine</span>
          <h2 className="pat-title">Une archive vivante.</h2>
          <span className="pat-rule" aria-hidden="true" />
          <p className="pat-text">
            La Mosquée de la Divinité est un lieu de mémoire autant qu’un lieu de culte.
            Plus de 50 ans d’archives documentées, et une collecte qui remonte jusqu’à la
            naissance de Sangabi en 1926.
          </p>
          <p className="pat-text">
            Témoignages oraux, photos d’archives, documents fondateurs — un patrimoine
            unique en cours de numérisation et de préservation. En partenariat avec Ubbil
            Innovation Hub, nous construisons une archive numérique de l’histoire et de la
            mémoire de la mosquée.
          </p>
          <Link to="/patrimoine" className="btn-gold pat-cta">Découvrir le patrimoine →</Link>
        </div>

        <div className="pat-box">
          {ARCHIVE.map((r, i) => (
            <div className="pat-row" key={i}>
              <span className="pat-k">{r.k}</span>
              <span className="pat-v">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
