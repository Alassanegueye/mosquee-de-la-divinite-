import { FiChevronDown } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { VIDEO, HERO_STATS } from '../../data/content'
import heroPoster from '../../assets/photo/DJI_0681.jpg'
import { useT } from '../../utils/useT'

// HERO — vidéo aérienne (montrée en entier) + contenu éditorial dessous.
export default function Hero() {
  const t = useT()

  return (
    <>
    <section id="hero">
      {/* La vidéo est affichée entière (16:9), sans recadrage ni voile */}
      <div className="hero-media">
        <video
          className="hero-bg-media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
      </div>

      <div className="hero-v-inner">
        <div className="hero-v-content">
          <span className="hero-anchor" />
          <span className="hero-eye">{t('Ouakam · Dakar · Sénégal')}</span>
          <h1 className="hero-title">Mosquée de la Divinité</h1>
          {/* Sous-titre déjà bilingue par nature : il ne passe pas par t(). */}
          <h4 className="hero-eye">Masdjidou Rabbani | Mosque of the Divinity</h4>
          <p className="hero-quote">
            «&nbsp;{t('Dans la nuit du')} <span className="g">{t('28 au 29 juin 1973')}</span>
            {t(', une voix ordonna à Sangabi de suivre une maquette lumineuse jusqu’à la baie de Ouakam.')}&nbsp;»
          </p>
          <div className="hero-ctas">
            <a href="#histoire" className="btn-w">{t('Découvrir l’histoire')}</a>
            <a href="#visiter" className="btn-w">{t('Visiter la mosquée')}</a>
            <Link to="/dons" className="btn-gold">{t('Faire un don')}</Link>
          </div>
        </div>

        <a href="#histoire" className="hero-scroll" aria-label={t('Continuer vers l’histoire')}>
          <FiChevronDown />
        </a>
      </div>
    </section>

    <section id="reperes" className="stats-band">
      <ul className="hero-v-stats">
        {HERO_STATS.map(([num, label]) => (
          <li key={label}>
            <strong>{t(num)}</strong>
            <span>{t(label)}</span>
          </li>
        ))}
      </ul>
    </section>
    </>
  )
}
