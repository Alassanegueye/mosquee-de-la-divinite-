import { VIDEO, HERO_STATS } from '../../data/content'

// HERO — vidéo aérienne en fond + contenu éditorial à gauche + barre de stats en bas.
// Reproduit la maquette de référence (Masdjidou Rabbani).
export default function Hero() {
  return (
    <>
    <section id="hero">
      <video
        className="hero-bg-media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={VIDEO} type="video/mp4" />
      </video>
      <span className="hero-bg-overlay" />

      <div className="hero-v-inner">
        <div className="hero-v-content">
          <span className="hero-anchor" />
          <span className="hero-eye">Ouakam · Dakar · Sénégal</span>
          <h1 className="hero-title">Masdjidou Rabbani</h1>
          <p className="hero-quote">
            «&nbsp;Dans la nuit du <span className="g">28 au 29 juin 1973</span>, une voix ordonna
            à Sangabi de suivre une maquette lumineuse jusqu’à la baie de Ouakam.&nbsp;»
          </p>
          <div className="hero-ctas">
            <a href="#histoire" className="btn-w">Découvrir l’histoire</a>
            <a href="#visiter" className="btn-w">Visiter la mosquée</a>
            <a href="#renovation" className="btn-gold">Faire un don</a>
          </div>
        </div>
      </div>
    </section>

    <section id="reperes" className="stats-band">
      <ul className="hero-v-stats">
        {HERO_STATS.map(([num, label]) => (
          <li key={label}>
            <strong>{num}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
    </>
  )
}
