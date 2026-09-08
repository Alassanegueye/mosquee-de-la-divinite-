import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import mosqueImage from '../../assets/photo/DJI_0681.jpg'

export default function RenovationPopup({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="renovation-popup-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className="renovation-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="renovation-popup-title"
      >
        <button
          className="renovation-popup-close"
          type="button"
          aria-label="Fermer la fenêtre"
          onClick={onClose}
        >
          ×
        </button>
        <div className="renovation-popup-content">
          <p className="ey renovation-popup-eyebrow">Projet en cours</p>
          <h2 id="renovation-popup-title">La mosquée se rénove</h2>
          <p>
            Découvrez le projet de rénovation et les façons de participer à sa réalisation.
          </p>
          <div className="renovation-popup-actions">
            <Link className="btn-gold" to="/renovation" onClick={onClose}>
              Découvrir le projet
            </Link>
            <button className="renovation-popup-secondary" type="button" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
        <div className="renovation-popup-image-wrap">
          <img
            className="renovation-popup-image"
            src={mosqueImage}
            alt="Vue aérienne de la Mosquée de la Divinité"
          />
        </div>
      </section>
    </div>
  )
}