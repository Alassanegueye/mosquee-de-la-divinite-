import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiEye, FiShoppingBag, FiArrowRight, FiAlertTriangle,
  FiTruck, FiMapPin, FiUser,
} from 'react-icons/fi'
import '../assets/css/Boutique.css'
import { useT } from '../utils/useT'
import { usePanier } from '../context/usePanier'
import { chargerProduits } from '../service/api'
import { visuelProduit, formaterPrix } from '../utils/catalogue'
import bagImg from '../assets/photo/Shopping_Bag_Mockup_v01.jpg'
import heroImg from '../assets/photo/DJI_0681.jpg'
import enfantsImg from '../assets/photo/Korite.jpg'

// Les trois raisons d'acheter (section institutionnelle)
const POINTS = [
  ['01', 'Pérennité', "Financement direct de l'entretien du site."],
  ['02', 'Transmission', 'Supports pédagogiques pour la jeunesse.'],
  ['03', 'Patrimoine', "Rayonnement de l'architecture islamique."],
]

// Carte produit de la galerie. Tout article affiché vient du catalogue
// géré dans le dashboard : il porte donc toujours un identifiant en base
// et peut être mis au panier.
function CarteProduit({ p }) {
  const t = useT()
  const { ajouter } = usePanier()
  const [ajoute, setAjoute] = useState(false)
  // Packshot (produit détouré, cadre carré) ou photo de mise en scène ?
  // Un packshot carré recadré en 3:4 perd un quart de sa largeur, soit
  // le produit lui-même. On lit les dimensions réelles au chargement
  // plutôt que de demander à l’équipe de cocher une case de plus.
  const [packshot, setPackshot] = useState(false)

  function ajouterAuPanier() {
    // On transmet le visuel déjà résolu : le tiroir du panier n'a pas à
    // refaire le choix entre l'image de l'API et le repli.
    ajouter({ ...p.produit, image: p.img }, 1)
    // Retour visuel court : l'ouverture du tiroir confirme déjà l'action,
    // ce libellé sert aux ajouts successifs sans fermer le tiroir.
    setAjoute(true)
    setTimeout(() => setAjoute(false), 1600)
  }

  return (
    <article className="shopg-card">
      <div className={`shopg-media${p.img ? '' : ' shopg-media--empty'}${packshot ? ' shopg-media--contain' : ''}`}>
        {p.badge && <span className="shopg-badge">{t(p.badge)}</span>}
        {/* Un article saisi sans photo garde une carte lisible plutôt
            qu'une image cassée. */}
        {p.img ? (
          <>
            <img
              src={p.img}
              alt={p.name}
              loading="lazy"
              onLoad={(e) => {
                const { naturalWidth: l, naturalHeight: h } = e.currentTarget
                if (l && h && Math.abs(l / h - 1) < 0.08) setPackshot(true)
              }}
            />
            <div className="shopg-discover">
              <span><FiEye /> {t('Découvrir')}</span>
            </div>
          </>
        ) : (
          <FiShoppingBag aria-hidden="true" />
        )}
      </div>
      <div className="shopg-body">
        <p className="shopg-cat">{p.cat}</p>
        <h4 className="shopg-name">{p.name}</h4>
        <p className="shopg-desc">{p.desc}</p>
        <div className="shopg-price-row">
          <span className="shopg-price-label">{t('Prix')}</span>
          <span className="shopg-price">{p.price}</span>
        </div>
        {p.rupture ? (
          <button type="button" className="shopg-add shopg-add--indispo" disabled>
            {t('Momentanément indisponible')}
          </button>
        ) : (
          <button
            type="button"
            className={`shopg-add${ajoute ? ' shopg-add--ok' : ''}`}
            onClick={ajouterAuPanier}
          >
            <FiShoppingBag /> {ajoute ? t('Ajouté au panier') : t('Ajouter au panier')}
          </button>
        )}
      </div>
    </article>
  )
}

/** Variante de présentation pour la gamme spirituelle : même source de
 *  données, mise en page plus contemplative. */
function CarteSpirituelle({ p }) {
  const t = useT()
  const { ajouter } = usePanier()

  return (
    <article className="shop-spirit">
      <div className={`shop-spirit-photo${p.img ? '' : ' shopg-media--empty'}`}>
        {p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : <FiShoppingBag aria-hidden="true" />}
      </div>
      <h4>{p.name}</h4>
      <p className="txt">{p.desc}</p>
      <p className="shopg-price">{p.price}</p>
      {p.rupture ? (
        <button type="button" className="btn-gold btn-inline" disabled>
          {t('Momentanément indisponible')}
        </button>
      ) : (
        <button
          type="button"
          className="btn-gold btn-inline"
          onClick={() => ajouter({ ...p.produit, image: p.img }, 1)}
        >
          {t('Ajouter au panier')}
        </button>
      )}
    </article>
  )
}


/** Carte fantôme affichée pendant le chargement du catalogue. La grille
 *  garde ainsi sa hauteur : sans elle, la page saute au moment où les
 *  articles arrivent. */
function CarteSquelette() {
  return (
    <article className="shopg-card shopg-skeleton" aria-hidden="true">
      <div className="shopg-skeleton-media" />
      <div className="shopg-skeleton-corps">
        <span className="shopg-skeleton-ligne shopg-skeleton-ligne--court" />
        <span className="shopg-skeleton-ligne" />
        <span className="shopg-skeleton-ligne" />
        <span className="shopg-skeleton-ligne shopg-skeleton-ligne--bouton" />
      </div>
    </article>
  )
}
/** Traduit un produit de l'API vers la forme attendue par CarteProduit.
 *  Les libellés ne passent pas par t() : ils sont saisis dans le
 *  dashboard, le dictionnaire i18n ne les connaît pas. */
function versCarte(produit) {
  const rupture = !produit.surCommande && produit.stock !== null && produit.stock <= 0
  return {
    id: produit.id,
    filter: produit.categorie?.slug || '',
    cat: produit.categorie?.nom || '',
    name: produit.nom,
    desc: produit.description || '',
    price: formaterPrix(produit.prix, produit.devise),
    img: visuelProduit(produit),
    badge: produit.badge || undefined,
    rupture,
    // Objet transmis au panier : identifiant + prix d'affichage.
    produit,
  }
}

export default function BoutiquePage() {
  const t = useT()
  const [activeFilter, setActiveFilter] = useState('Tous les objets')

  // Le catalogue vient entièrement de l'API : aucun article n'est écrit
  // dans le code. Ce que l'équipe saisit dans le dashboard est ce que le
  // visiteur voit — sinon la boutique afficherait des prix qui n'engagent
  // personne.
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [horsLigne, setHorsLigne] = useState(false)

  useEffect(() => {
    let annule = false
    chargerProduits({ limit: 100 })
      .then((donnees) => {
        if (annule) return
        setProduits((donnees.items || []).map(versCarte))
      })
      .catch(() => {
        // Plutôt qu'un faux catalogue : on le dit. Le reste de la page
        // (philosophie, retrait, livraison) tient debout sans articles.
        if (!annule) setHorsLigne(true)
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [])

  // Filtres construits à partir des gammes réellement présentes : une
  // gamme vide ne doit pas afficher un onglet qui ne renvoie rien.
  const gammes = Array.from(
    new Map(
      produits
        .filter((p) => p.filter && p.cat)
        .map((p) => [p.filter, p.cat])
    ).entries()
  )

  const visibleProducts =
    activeFilter === 'Tous les objets'
      ? produits
      : produits.filter((p) => p.filter === activeFilter || p.cat === activeFilter)

  /** Articles d'une gamme, pour les sections thématiques de la page. */
  const parGamme = (slug) => produits.filter((p) => p.filter === slug)

  return (
    <div className="boutique-page-root shop-page bg-surface text-on-surface font-body" style={{ minHeight: '100vh' }}>
      {/* ---------- HERO ---------- */}
      <section className="shop-hero">
        <div className="shop-hero-bg" aria-hidden="true">
          <img src={heroImg} alt="" />
        </div>
        <div className="shop-in shop-hero-in">
          <span className="shop-eyebrow">{t('Boutique Officielle')}</span>
          <h1 className="shop-hero-title">
            {t('Porter le message.')}
            <span className="solid">{t('Soutenir l’œuvre.')}</span>
          </h1>
          <p className="shop-hero-lead">
            {t('Chaque acquisition contribue directement à la préservation et au rayonnement de la Mosquée de la Divinité. Un pont entre le spirituel et le matériel.')}
          </p>
          <div className="shop-hero-ctas">
            <a className="btn-gold" href="#catalogue">{t('Explorer les gammes')}</a>
            <Link className="btn-dk" to="/#message">{t('Notre Philosophie')}</Link>
          </div>
        </div>
      </section>

      {/* ---------- GALERIE FILTRABLE ---------- */}
      <section className="shopg" id="catalogue">
        <div className="shopg-inner">
          <div className="shopg-filters">
            <button
              type="button"
              className={`shopg-filter${activeFilter === 'Tous les objets' ? ' active' : ''}`}
              onClick={() => setActiveFilter('Tous les objets')}
            >
              {t('Tous les objets')}
            </button>
            {gammes.map(([valeur, libelle]) => (
              <button
                key={valeur}
                type="button"
                className={`shopg-filter${activeFilter === valeur ? ' active' : ''}`}
                onClick={() => setActiveFilter(valeur)}
              >
                {libelle}
              </button>
            ))}
          </div>
          <div className="shopg-divider" />

          {chargement ? (
            <div className="shopg-grid">
              {Array.from({ length: 4 }, (_, i) => (
                <CarteSquelette key={i} />
              ))}
            </div>
          ) : horsLigne ? (
            <div className="shopg-grid">
              <div className="shopg-etat">
                <FiAlertTriangle aria-hidden="true" />
                <p>{t('Le catalogue est momentanément indisponible. Merci de réessayer dans un instant.')}</p>
              </div>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="shopg-grid">
              <div className="shopg-etat">
                <FiShoppingBag aria-hidden="true" />
                <p>{t('Aucun article en vente pour le moment.')}</p>
              </div>
            </div>
          ) : (
            <div className="shopg-grid" data-reveal>
              {visibleProducts.map((p) => (
                <CarteProduit p={p} key={p.id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- GAMME YEETE (éducation & éveil) ---------- */}
      <section className="shop-sec" id="gamme-enfants">
        <div className="shop-in shop-yeete-grid">
          <div data-reveal>
            <span className="shop-eyebrow">{t('Éducation & Éveil')}</span>
            <h3 className="shop-h2">{t('Gamme Yeete')}</h3>
            <p className="shop-lead">
              {t('Inspirée par la pédagogie Montessori, cette collection propose des jeux et supports éducatifs pour transmettre l’héritage spirituel et architectural dès le plus jeune âge.')}
            </p>
            {/* Section éditoriale : les articles de la gamme se retrouvent
                dans le catalogue ci-dessus, avec leurs prix réels. */}
            <a className="shop-link" href="#catalogue">
              {t('Voir les articles disponibles')} <FiArrowRight />
            </a>
          </div>

          <div className="shop-yeete-visual" data-reveal>
            <div className="shop-yeete-photo arch-mask">
              <img
                src={enfantsImg}
                alt={t('Enfants et familles de la communauté un jour de fête')}
                loading="lazy"
              />
            </div>
            <div className="shop-yeete-badge">
              <h4>الأولاد</h4>
              <p>{t('Pour les futurs bâtisseurs')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TEXTILE & ÉQUIPEMENT ---------- */}
      {/* Vue par gamme, alimentée par le catalogue. La section disparaît
          quand la gamme est vide : mieux vaut pas de section qu'une
          section vide. */}
      {parGamme('textile').length > 0 && (
        <section className="shop-sec shop-textile" id="textile">
          <div className="shop-in">
            <div className="shop-head-row">
              <div>
                <span className="shop-eyebrow">{t('Identité Visuelle')}</span>
                <h3 className="shop-h2">
                  {t('Textile &')} <span className="solid">{t('Équipement')}</span>
                </h3>
                <p className="shop-lead">
                  {t('Une gamme premium conçue pour les membres, les bénévoles et les sympathisants. Chaque pièce arbore l’insigne officiel de Masdjidou Rabbani.')}
                </p>
              </div>
              <button
                type="button"
                className="shop-link"
                onClick={() => setActiveFilter('textile')}
              >
                {t('Voir tout le textile')} <FiArrowRight />
              </button>
            </div>

            <div className="shopg-grid" data-reveal>
              {parGamme('textile').map((p) => (
                <CarteProduit p={p} key={p.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- GAMME SPIRITUELLE ---------- */}
      {parGamme('spirituelle').length > 0 && (
        <section className="shop-sec" id="spirituelle">
          <div className="shop-in">
            <div className="shop-center-head">
              <span className="shop-eyebrow">{t('La Paix Intérieure')}</span>
              <h3 className="shop-h2">{t('Spirituelle')}</h3>
              <div className="shop-center-rule" />
            </div>

            <div className="shop-spirit-grid" data-reveal>
              {parGamme('spirituelle').map((p) => (
                <CarteSpirituelle p={p} key={p.id} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- SIGNALÉTIQUE (institutionnel) ---------- */}
      <section className="shop-sign" id="signaletique">
        <div className="shop-sign-grid">
          <div className="shop-sign-left">
            <span className="shop-eyebrow">{t('Institutionnel')}</span>
            <h3 className="shop-h2">
              {t('L’Empreinte de la')} <span className="solid">{t('Divinité')}</span>
            </h3>
            <div className="shop-sign-products">
              <div>
                <div className="shop-sign-photo">
                  <img src={bagImg} alt={t('Tote Bag Premium Mosquée de la Divinité')} loading="lazy" />
                </div>
                <h5>{t('Tote Bag Premium')}</h5>
                <p>{t('Toile de coton robuste avec marquage sérigraphié haute définition.')}</p>
              </div>
              <div className="shop-sign-offset">
                <div className="shop-sign-photo">
                  {/* Emplacement réservé : visuel des casquettes à venir */}
                  <FiUser />
                </div>
                <h5>{t('Casquettes Officielles')}</h5>
                <p>{t('Modèles ajustables avec broderie relief de l’emblème Rabbani.')}</p>
              </div>
            </div>
          </div>

          <div className="shop-sign-right">
            <p className="shop-quote">
              «&nbsp;{t('L’achat est un don avec un objet en retour. Le don est un achat sans objet.')}&nbsp;»
            </p>
            <p className="shop-quote-sub">{t('Philosophie de la Boutique Officielle')}</p>
            <div className="shop-sign-rule" />
            <div className="shop-points">
              {POINTS.map(([num, titre, texte]) => (
                <div className="shop-point" key={num}>
                  <span className="shop-point-num">{num}</span>
                  <div>
                    <h6>{t(titre)}</h6>
                    <p>{t(texte)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LIVRAISON & RETRAIT ---------- */}
      <section className="shop-sec" id="assistance">
        <div className="shop-in">
          <div className="shop-logi-card">
            <FiTruck className="shop-logi-ico" aria-hidden="true" />
            <div className="shop-logi-grid">
              <div>
                <h3 className="shop-h3">{t('Logistique & Retraits')}</h3>
                <p className="shop-lead">
                  {t('Nous assurons une livraison fluide sur tout le territoire sénégalais. Les commandes peuvent également être retirées directement au guichet officiel de la Mosquée à Ouakam.')}
                </p>
                <div className="shop-logi-list">
                  <div className="shop-logi-item">
                    <span className="ico"><FiMapPin /></span>
                    <div>
                      <b>{t('Point de Retrait Ouakam')}</b>
                      <span>{t('Lundi - Dimanche | 09h00 - 18h00')}</span>
                    </div>
                  </div>
                  <div className="shop-logi-item">
                    <span className="ico"><FiTruck /></span>
                    <div>
                      <b>{t('Livraison Dakar & Régions')}</b>
                      <span>{t('Sous 24h à 72h ouvrés')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shop-form">
                <h4>{t('Besoin d’assistance ?')}</h4>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder={t('Votre nom')} />
                  <input type="email" placeholder={t('Votre email')} />
                  <textarea placeholder={t('Votre message')} rows="3" />
                  <button type="submit" className="btn-gold">{t('Envoyer la demande')}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
