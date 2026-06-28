import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShare2, FiArrowRight, FiCheckCircle, FiCheck, FiAlertTriangle, FiShoppingBag, FiInfo } from 'react-icons/fi'
import '../assets/css/Renovation.css'
import cardPerspective from '../assets/photo/DJI_0681.jpg'
import cardChantier from '../assets/photo/13-Khalif-Chantier.jpg'
import cardMosaique from '../assets/photo/DJI_0419.jpg'
import phase1Img from '../assets/photo/image3-mosquee.jpg'
import phase2Img from '../assets/photo/Avant-Projet.png'
import phase2Img2 from '../assets/photo/Rendu-AvantP.png'

// Cartes empilées du hero
const HERO_CARDS = [
  { img: cardPerspective, label: 'Perspective Ouakam', cls: 'don-card--1', gray: true },
  { img: cardChantier, label: 'Chantier structurel', cls: 'don-card--2' },
  { img: cardMosaique, label: 'Mosaïques émeraude', cls: 'don-card--3' },
]

// « Construite par des mains ordinaires » — trois gestes
const HANDS = [
  ['Geste de bâtisseur', 'Des mains qui ont porté des sacs de ciment.'],
  ['Dévouement physique', 'Des mains qui ont grimpé à 45 mètres de hauteur.'],
  ['Force collective', 'Des mains qui ont nourri les bénévoles jour après jour pendant cinq années.'],
]

const PHASE1_POINTS = [
  "Réfection des mosaïques traditionnelles",
  "Traitement anti-corrosion des armatures",
  "Étanchéité complète des dômes et terrasses"
]

const PHASE2_TAGS = [
  "CENTRE DE CONFÉRENCES",
  "RÉSIDENCE PÈLERINS",
  "INSTITUT ISLAMIQUE"
]


const AMOUNTS = [5000, 15000, 25000, 50000]
const METHODS = ['Wave', 'Orange', 'CB / VISA']

export default function RenovationPage() {
  const [amount, setAmount] = useState(25000)
  const [customMode, setCustomMode] = useState(false)
  const [method, setMethod] = useState('Wave')
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.classList.add('renovation-body-reset')
    return () => {
      document.body.classList.remove('renovation-body-reset')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setDone(true)
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Mosquée de la Divinité — Rénovation',
      text: 'Rejoignez le mouvement de sauvegarde de la Mosquée de la Divinité.',
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url)
      }
    } catch {
      /* partage annulé par l'utilisateur */
    }
  }

  return (
    <div id="renovation-don" className="don-page">
      {/* ---------- HERO ---------- */}
      <section className="don-hero">
        <div className="sw don-hero-grid">
          <div className="don-hero-text">
            <span className="don-eyebrow"><i className="don-dot don-dot--red" />Appel à la communauté · Appel au monde</span>
            <h1 className="don-hero-title">
              Elle a été bâtie<br />par des mains.
              <em>Elle sera restaurée<br />par des mains.</em>
            </h1>
            <span className="don-hero-rule" />
            <p className="don-hero-sub">Le même geste. Une nouvelle génération.</p>
            <p className="don-hero-lead">
              Rejoignez le mouvement de sauvegarde de ce chef-d’œuvre de la Corniche de Dakar, agressé par les embruns
              de l’Atlantique mais porté éternellement par la ferveur des hommes.
            </p>
            <div className="don-hero-ctas">
              <a href="#don-form" className="don-btn don-btn--red">Prêter mes mains <FiArrowRight /></a>
              <a href="#phases" className="don-btn don-btn--ghost">Découvrir le projet</a>
            </div>
          </div>

          <div className="don-hero-cards">
            {HERO_CARDS.map((c) => (
              <figure className={`don-card ${c.cls}`} key={c.label}>
                <img src={c.img} alt={c.label} className={c.gray ? 'is-gray' : ''} />
                <figcaption>{c.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CORPS : contenu + formulaire sticky ---------- */}
      <div className="sw don-body">
        <main className="don-main">
          {/* Mains ordinaires */}
          <section className="don-sec">
            <h2 className="don-h2 don-h2--anchor">
              La Mosquée de la Divinité a été construite par des mains ordinaires.
            </h2>
            <div className="don-hands">
              {HANDS.map(([k, v]) => (
                <div className="don-hand" key={k}>
                  <span className="don-hand-k">{k}</span>
                  <p className="don-hand-v">« {v} »</p>
                </div>
              ))}
            </div>
            <p className="don-p">
              Une communauté entière s’est mobilisée pour bâtir ce qui est aujourd’hui l’un des monuments religieux et
              patrimoniaux les plus emblématiques de Dakar.
            </p>
          </section>

          {/* Aujourd'hui / Dégradation */}
          <section className="don-sec">
            <div className="don-today">
              <span className="don-watermark">1992</span>
              <p className="don-p">
                Aujourd’hui, l’air marin, le soleil de la Corniche et le temps ont laissé leurs marques sur la mosquée.
                Le béton, les mosaïques et les minarets portent les traces de plus de trente années face à l’Atlantique.
              </p>
            </div>

            <div className="don-alert">
              <FiAlertTriangle className="don-alert-ico" />
              <h3 className="don-alert-title">La mosquée se dégrade.</h3>
              <p className="don-alert-1">Ce n’est pas une alarme.</p>
              <p className="don-alert-2">C’est une réalité.</p>
            </div>

            <div className="don-transmit">
              <p>
                Et cette réalité appelle le même geste qu’en 1992 : choisir de préserver ce qui a été reçu afin de
                pouvoir le transmettre.
              </p>
              <span className="don-transmit-rule" />
              <p className="don-transmit-gold">Car un patrimoine ne se transmet pas tout seul.</p>
            </div>
          </section>

          {/* Phases */}
          <section className="don-sec" id="phases">
            <div className="don-sec-head">
              <span className="don-eyebrow don-eyebrow--gold"><i className="don-dot don-dot--gold" />Projections d’avenir</span>
              <h2 className="don-h2">Un projet en <em>plusieurs phases</em></h2>
            </div>

            {/* Phase 1 : image à gauche, contenu à droite */}
            <div className="don-ph">
              <figure className="don-ph-media">
                <div className="don-ph-media-inner">
                  <img src={phase1Img} alt="Restaurer la Mosquée" />
                </div>
                <div className="don-ph-badge don-ph-badge--red">PHASE 1</div>
              </figure>
              <div className="don-ph-body don-ph-body--anchor">
                <h3 className="don-ph-title">
                  Restaurer la<br />Mosquée
                </h3>
                <p className="don-ph-text">
                  Le cœur spirituel du site nécessite une intervention d'urgence. Des fondations en béton armé à la consolidation des minarets, chaque geste vise à pérenniser la structure sans en altérer l'essence.
                </p>
                <ul className="don-ph-list don-ph-list--red">
                  {PHASE1_POINTS.map((p) => (
                    <li key={p}>
                      <FiCheckCircle className="don-ph-icon" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase 2 : contenu à gauche, image à droite */}
            <div className="don-ph don-ph--rev">
              <div className="don-ph-body don-ph-body--anchor-r">
                <h3 className="don-ph-title">
                  Le Complexe<br />Mouhamed Seyni<br />Gueye
                </h3>
                <p className="don-ph-text">
                  Au-delà de la pierre, nous bâtissons un lieu de vie et de savoir. L'extension accueillera une résidence pour les pèlerins, un centre de conférences moderne et un institut islamique d'excellence.
                </p>
                <div className="don-ph-tags">
                  {PHASE2_TAGS.map((t) => (
                    <span className="don-ph-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <figure className="don-ph-media">
                <div className="don-ph-media-inner">
                  <img src={phase2Img} />
                  <img src={phase2Img2} alt="Le Complexe Mouhamed Seyni Gueye" />
                </div>
                <div className="don-ph-badge don-ph-badge--teal">PHASE 2</div>
              </figure>
            </div>
          </section>

          {/* Trois façons de contribuer */}
          <section className="don-sec">
            <div className="don-sec-head">
              <span className="don-eyebrow don-eyebrow--gold"><i className="don-dot don-dot--gold" />Mobilisation collective</span>
              <h2 className="don-h2">Trois façons de <em>contribuer</em></h2>
            </div>

            <div className="don-ways">
              {/* Don */}
              <div className="don-way">
                <div className="don-way-head">
                  <span className="don-way-ico don-way-ico--red"><FiHeart /></span>
                  <span className="don-way-tag">Direct</span>
                </div>
                <h4 className="don-way-title">Faire un don</h4>
                <p className="don-way-lead">Chaque contribution compte.</p>
                <p className="don-way-text">
                  Qu’elle vienne d’un fidèle, d’un habitant du quartier, d’un Sénégalais de la diaspora, d’un visiteur
                  ou d’un ami du Sénégal.
                </p>
                <div className="don-way-chip">Wave · OM · Carte · Virement</div>
                <a href="#don-form" className="don-way-btn don-way-btn--red">Je fais un don</a>
              </div>

              {/* Boutique */}
              <div className="don-way">
                <div className="don-way-head">
                  <span className="don-way-tag don-way-tag--solid">Boutique solidaire</span>
                </div>
                <h4 className="don-way-title">Acheter à la boutique</h4>
                <p className="don-way-text">
                  Puzzles, carnets, reproductions d’archives, objets inspirés du patrimoine de la mosquée.
                </p>
                <div className="don-way-chip don-way-chip--gold">
                  Chaque achat contribue directement aux projets de préservation et de développement.
                </div>
                <p className="don-way-ship"><FiShoppingBag /> Livraison au Sénégal · Retrait à la mosquée.</p>
                <Link to="/boutique" className="don-way-btn don-way-btn--teal">Visiter la boutique</Link>
              </div>

              {/* Partager */}
              <div className="don-way">
                <div className="don-way-head">
                  <span className="don-way-ico"><FiShare2 /></span>
                  <span className="don-way-tag">Vocal</span>
                </div>
                <h4 className="don-way-title">Partager l’appel</h4>
                <p className="don-way-text">
                  La mosquée a été construite quartier par quartier, famille par famille. Sa restauration aussi.
                </p>
                <p className="don-way-quote">« Partager cet appel c’est déjà contribuer. »</p>
                <button type="button" onClick={handleShare} className="don-way-btn don-way-btn--ghost">
                  <FiShare2 /> Partager l’appel
                </button>
              </div>
            </div>
          </section>

          {/* Rapport d'activité & Transparence */}
          <div className="don-report">
            <div className="don-report-head">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="don-report-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 11 2 2 4-4"></path>
              </svg>
              <span>RAPPORT D'ACTIVITÉ & TRANSPARENCE</span>
            </div>
            <p className="don-report-text">
              Le plan architectural détaillé, le calendrier des travaux et le budget prévisionnel seront publiés dès leur finalisation.
            </p>
            <p className="don-report-text">
              Les fonds collectés, leur affectation et l'avancement du chantier seront rendus publics.
            </p>
          </div>

          {/* Fonds de sauvegarde — progression */}
          <div className="don-fonds">
            <div className="don-fonds-head">
              <div>
                <span className="don-fonds-eyebrow">Restaurons le monument</span>
                <h3 className="don-fonds-title">Fonds de Sauvegarde Structurelle</h3>
              </div>
              <span className="don-fonds-pct">42% du but</span>
            </div>
            <div className="don-fonds-bar"><i style={{ width: '42%' }} /></div>
            <div className="don-fonds-stats">
              <div>
                <span className="don-fonds-k">Total collecté</span>
                <p className="don-fonds-v">42 150 000 FCFA</p>
              </div>
              <div>
                <span className="don-fonds-k">Objectif global</span>
                <p className="don-fonds-v don-fonds-v--muted">100 000 000 FCFA</p>
              </div>
            </div>
            <p className="don-fonds-note">
              <FiInfo />
              Les budgets sont administrés de manière transparente par le comité de la Mosquée d’Ouakam. Tous les fonds
              servent exclusivement aux travaux d’ingénierie et de gros-œuvre maritime.
            </p>
          </div>
        </main>

        {/* ---------- Formulaire de contribution (sticky) ---------- */}
        <aside className="don-aside" id="don-form">
          <form className="don-form" onSubmit={handleSubmit}>
            <div className="don-form-head">
              <FiHeart className="don-form-heart" />
              <h3>Faire une contribution</h3>
            </div>

            <span className="don-label">Montant du don (FCFA)</span>
            <div className="don-amounts">
              {AMOUNTS.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={`don-amount${!customMode && amount === a ? ' is-active' : ''}`}
                  onClick={() => { setAmount(a); setCustomMode(false) }}
                >
                  {a.toLocaleString('fr-FR')} F
                </button>
              ))}
              <button
                type="button"
                className={`don-amount don-amount--free${customMode ? ' is-active' : ''}`}
                onClick={() => setCustomMode(true)}
              >
                Montant Libre
              </button>
            </div>
            {customMode && (
              <input
                type="number"
                min="500"
                step="500"
                className="don-input don-input--amount"
                placeholder="Saisir un montant en FCFA"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            )}

            <span className="don-label">Méthode de paiement</span>
            <div className="don-methods">
              {METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  className={`don-method${method === m ? ' is-active' : ''} ${m === 'Orange' ? 'don-method--orange' : ''}`}
                  onClick={() => setMethod(m)}
                >
                  {m === 'CB / VISA' ? 'CB / VISA' : m.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="don-label">Vos informations personnelles</span>
            <input type="text" className="don-input" placeholder="Nom complet ou Famille" required />
            <input type="tel" className="don-input" placeholder="Téléphone (WhatsApp de préférence)" />

            <button type="submit" className="don-submit">
              Contribuer · {amount.toLocaleString('fr-FR')} F via {method}
            </button>

            {done && (
              <p className="don-thanks">
                Merci ! Votre intention de don de {amount.toLocaleString('fr-FR')} F via {method} a bien été enregistrée.
                Un membre du mouvement Naby Allah vous recontactera.
              </p>
            )}

            <p className="don-form-note">
              Transaction sécurisée · Les fonds soutiennent exclusivement la restauration et la transmission.
            </p>
          </form>
        </aside>
      </div>
    </div>
  )
}
