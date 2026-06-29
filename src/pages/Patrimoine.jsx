import { useEffect, useRef } from 'react'
import { FiMic, FiImage, FiArrowRight } from 'react-icons/fi'
import '../assets/css/Patrimoine.css'
import sangabiImg from '../assets/photo/Khalife de Dieu.jpg'

// Chiffres-clés de l'archive (compteurs architecturaux)
const STATS = [
  ['1926', 'Naissance', "Début de l'archive"],
  ['1977', 'Message', 'Premier appel public'],
  ['50+', 'Années', "D'archives documentées"],
  ['∞', 'Vies', 'Témoignages à préserver'],
]

// Page Patrimoine — Archives & Mémoire de la Mosquée de la Divinité.
// La Navbar et le Footer sont fournis par le gabarit (App.jsx).
export default function PatrimoinePage() {
  const pageRef = useRef(null)

  // Apparition progressive des sections au défilement (IntersectionObserver)
  useEffect(() => {
    const targets = pageRef.current?.querySelectorAll('.pat-reveal') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pat-page" ref={pageRef}>
      {/* ---------- HERO ---------- */}
      <header className="pat-hero">
        <div className="pat-container pat-hero-inner">
          <div className="pat-hero-text">
            <div className="pat-anchor">
              <span className="pat-eyebrow">Archives &amp; Mémoire</span>
            </div>
            <h1 className="pat-hero-title">
              Pour ceux qui ne l’ont pas connu.<br />
              <em>Et pour ceux qui ne sont pas encore nés.</em>
            </h1>
            <p className="pat-hero-lead">
              La Mosquée de la Divinité est un lieu de mémoire autant qu’un lieu de culte.
              Plus de 50 ans d’archives documentées. Des témoignages oraux, des photos, des
              documents fondateurs, un patrimoine unique en cours de numérisation et de préservation.
            </p>
          </div>
        </div>
      </header>

      {/* ---------- L'HÉRITAGE DE SANGABI ---------- */}
      <section className="pat-section pat-legacy pat-reveal">
        <div className="pat-container pat-legacy-grid">
          <figure className="pat-legacy-figure">
            <div className="pat-legacy-card">
              <img
                src={sangabiImg}
                alt="Mouhamed Seyni Gueye, dit Sangabi — documents et héritage fondateurs"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
          <div className="pat-legacy-text">
            <span className="pat-eyebrow">L’héritage de Sangabi</span>
            <blockquote className="pat-legacy-quote">
              « Pour ceux qui ne l’ont jamais rencontré, pour ceux qui n’ont pas vu la mosquée se construire. »
            </blockquote>
            <div className="pat-legacy-body">
              <p>
                Dans vingt ans, d’autres le porteront, des gens qui ne l’ont jamais rencontré,
                qui n’ont pas vu la mosquée se construire, qui n’ont pas entendu sa voix.
              </p>
              <p>
                Préserver cette mémoire, c’est transmettre aux générations futures une part du
                patrimoine religieux, architectural et humain de Dakar et du Sénégal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- COMPTEURS / STATS ---------- */}
      <section className="pat-section pat-stats pat-reveal">
        <div className="pat-container">
          <div className="pat-stats-grid">
            {STATS.map(([num, label, sub]) => (
              <div className="pat-stat" key={label}>
                <span className="pat-stat-num">{num}</span>
                <span className="pat-stat-label">{label}</span>
                <span className="pat-stat-sub">{sub}</span>
              </div>
            ))}
            <div className="pat-stat pat-stat--wide">
              <span className="pat-stat-num pulse">↻</span>
              <span className="pat-stat-label">En cours</span>
              <span className="pat-stat-sub">Archive numérique</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MÉDIATHÈQUE ---------- */}
      <section className="pat-section pat-media pat-reveal">
        <div className="pat-container">
          <div className="pat-media-head">
            <div>
              <span className="pat-media-eyebrow">Médiathèque</span>
              <h2 className="pat-media-title">Les voix de l’histoire.</h2>
            </div>
            <p className="pat-media-note">
              Les photographies montrent un visage. Les archives racontent une histoire.
              Mais la voix transmet quelque chose d’autre.
            </p>
          </div>

          <div className="pat-media-grid">
            {/* Vidéo principale (playlist) */}
            <div className="pat-media-main">
              <iframe
                src="https://www.youtube.com/embed/videoseries?si=_9N7G3DxA4oE-3TC&list=PLn-4i5RmTZrEngicK9AUtKRHQrU-WS1Ya"
                title="Archives vidéo de la Mosquée de la Divinité"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Cartes audio / galerie */}
            <div className="pat-media-side">
              <div className="pat-media-card">
                <FiMic className="pat-media-card-ico" />
                <h4>Sermon Historique</h4>
                <p>Le premier appel public du 1er Juillet 1977. Restauration numérique haute fidélité.</p>
                <div className="pat-progress"><i /></div>
              </div>
              <div className="pat-media-card">
                <FiImage className="pat-media-card-ico" />
                <h4>Galerie Photos</h4>
                <p>420 clichés argentiques numérisés illustrant la ferveur de la communauté Ouakamoise.</p>
                <a className="pat-media-cardlink" href="#">
                  Consulter l’album <FiArrowRight />
                </a>
              </div>
            </div>

            {/* Vignettes vidéo secondaires */}
            <div className="pat-media-thumb">
              <iframe src="https://www.youtube.com/embed/AVHTdd3obBI" title="Archive vidéo 1" allowFullScreen />
            </div>
            <div className="pat-media-thumb">
              <iframe src="https://www.youtube.com/embed/j7pBLJyXjZA" title="Archive vidéo 2" allowFullScreen />
            </div>
            <div className="pat-media-thumb">
              <iframe src="https://www.youtube.com/embed/GMaNQHtJ6to" title="Archive vidéo 3" allowFullScreen />
            </div>
          </div>

          <div className="pat-media-cta">
            <a href="#">
              Voir toutes les vidéos <FiArrowRight />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
