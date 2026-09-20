import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { useT } from '../../utils/useT'
import { usePanier } from '../../context/usePanier'
import { chargerProduits } from '../../service/api'
import { visuelProduit, formaterPrix } from '../../utils/catalogue'

// BOUTIQUE — « Boutique Patrimoine » : aperçu sur l'accueil des articles
// mis en vedette depuis le dashboard. Aucun article n'est écrit ici : une
// vitrine qui affiche des produits inexistants fait perdre son temps au
// visiteur et décrédibilise la boutique.
export default function Boutique() {
  const t = useT()
  const { ajouter } = usePanier()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    let annule = false
    chargerProduits({ vedette: true, limit: 4 })
      .then((donnees) => {
        if (annule) return
        setArticles(
          (donnees?.items || []).map((p) => ({
            id: p.id,
            nom: p.nom,
            prixTexte: formaterPrix(p.prix, p.devise),
            img: visuelProduit(p),
            produit: p,
          }))
        )
      })
      .catch(() => {
        // Silencieux : la section s'efface, inutile d'afficher une erreur
        // technique à un visiteur venu lire l'histoire de la mosquée.
      })
    return () => {
      annule = true
    }
  }, [])

  // Rien en vedette (ou API muette) : la section disparaît de l'accueil
  // au lieu d'y laisser une grille vide.
  if (articles.length === 0) return null

  return (
    <section id="boutique" className="section bg-soft">
      <div className="sw">
        <div className="shop2-head">
          <div>
            <span className="eyebrow gold">{t('Support & Artisanat')}</span>
            <h2 className="sec-title">{t('Boutique')} <em className="red-em">{t('Patrimoine')}</em></h2>
          </div>
        </div>

        <div className="shop2-grid" data-reveal>
          {articles.map((a) => (
            <article className="shop2-card" key={a.id}>
              {/* Les noms de produits viennent du dashboard : ils ne passent
                  pas par t(), le dictionnaire i18n ne les connaît pas. */}
              <div className="thumb">
                {a.img ? (
                  <img src={a.img} alt={a.nom} loading="lazy" />
                ) : (
                  <FiShoppingBag aria-hidden="true" />
                )}
              </div>
              <h5 className="shop2-name">{a.nom}</h5>
              <p className="shop2-price">{a.prixTexte}</p>
              <button
                type="button"
                className="shop2-add"
                onClick={() => ajouter({ ...a.produit, image: a.img }, 1)}
              >
                <FiShoppingBag /> {t('Ajouter au panier')}
              </button>
            </article>
          ))}
        </div>

        <div className="shop2-cta-wrap">
          <Link to="/boutique" className="btn-teal">{t('Voir tout')}</Link>
        </div>
      </div>
    </section>
  )
}
