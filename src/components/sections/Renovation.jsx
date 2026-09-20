import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../../utils/useT'
import { chargerRenovation } from '../../service/api'

// RÉNOVATION — « Préserver l'Héritage ».
//
// Les chantiers et leur avancement viennent de la base, comme sur la page
// rénovation : les deux écrans doivent annoncer le même chiffre. Les
// 65 % et 15 % qui vivaient ici étaient décoratifs, et contredisaient la
// collecte réelle affichée deux clics plus loin.
export default function Renovation() {
  const t = useT()
  const [campagne, setCampagne] = useState(null)
  const [chantiers, setChantiers] = useState([])

  useEffect(() => {
    let annule = false
    chargerRenovation()
      .then((donnees) => {
        if (annule) return
        setCampagne(donnees?.campagne || null)
        setChantiers(donnees?.chantiers || [])
      })
      .catch(() => {
        // Silencieux : la section s'efface. Un visiteur venu lire
        // l'histoire de la mosquée n'a pas à voir une erreur technique.
      })
    return () => {
      annule = true
    }
  }, [])

  // Rien en base ou API muette : la section disparaît plutôt que
  // d'afficher des barres vides.
  if (chantiers.length === 0) return null

  return (
    <section id="renovation" className="section bg-white">
      <div className="sw">
        <div className="sec-head-center">
          <span className="eyebrow red">{t('Projet de Conservation')}</span>
          <h2 className="sec-title">{t('Préserver')} <em>{t('l’Héritage')}</em></h2>
          {campagne && (
            <p className="reno2-global">
              {campagne.pourcentage}% {t('du budget global collecté')}
            </p>
          )}
        </div>

        <div className="reno2-grid" data-reveal>
          {chantiers.map((c) => {
            // Borné à 100 : un chantier sur-financé ne doit pas faire
            // déborder la barre hors de sa carte.
            const pct =
              c.estimation > 0 ? Math.min(100, Math.round((c.collecte / c.estimation) * 100)) : 0

            return (
              <div className="reno2-card" key={c.id}>
                {/* Titres et résumés sont saisis au dashboard : ils ne
                    passent pas par t(), le dictionnaire ne les connaît pas. */}
                <h4>{c.titre}</h4>
                {c.resume && <p>{c.resume}</p>}
                <div className="reno2-bar">
                  <i style={{ width: `${pct}%`, backgroundColor: c.couleur || undefined }} />
                </div>
                <p className="reno2-pct">{pct}% {t('du budget collecté')}</p>
              </div>
            )
          })}
        </div>

        <div className="reno2-actions">
          <Link to="/renovation" className="btn-teal">{t('En savoir plus sur le projet')}</Link>
        </div>
      </div>
    </section>
  )
}
