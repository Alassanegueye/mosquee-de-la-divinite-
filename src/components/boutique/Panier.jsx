import { useEffect, useState } from 'react'
import { FiX, FiTrash2, FiShoppingBag, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { usePanier } from '../../context/usePanier'
import { useT } from '../../utils/useT'
import { envoyerCommande, messageErreur } from '../../service/api'
import '../../assets/css/Panier.css'

const FRAIS_LIVRAISON = 2000

const CHAMPS_VIDES = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  modeLivraison: 'retrait',
  adresse: '',
  ville: 'Dakar',
  quartier: '',
  note: '',
}

/**
 * Tiroir du panier : récapitulatif, formulaire de commande, confirmation.
 *
 * Le formulaire est dans le tiroir plutôt que sur une page dédiée : le
 * visiteur qui hésite garde le catalogue derrière lui et n'a pas
 * l'impression d'entrer dans un tunnel de paiement.
 */
export default function Panier() {
  const t = useT()
  const { lignes, nombreArticles, sousTotal, ouvert, fermer, changerQuantite, retirer, vider } =
    usePanier()

  // 'panier' -> 'formulaire' -> 'confirmation'
  const [etape, setEtape] = useState('panier')
  const [valeurs, setValeurs] = useState(CHAMPS_VIDES)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [commande, setCommande] = useState(null)

  // Fermeture au clavier + blocage du défilement de la page derrière.
  useEffect(() => {
    if (!ouvert) return
    const surTouche = (e) => {
      if (e.key === 'Escape') fermer()
    }
    document.addEventListener('keydown', surTouche)
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', surTouche)
      document.body.style.overflow = avant
    }
  }, [ouvert, fermer])

  if (!ouvert) return null

  const fraisLivraison = valeurs.modeLivraison === 'livraison' ? FRAIS_LIVRAISON : 0
  const total = sousTotal + fraisLivraison
  const fcfa = (n) => `${Number(n || 0).toLocaleString('fr-FR').split(/\s/).join(' ')} FCFA`

  function maj(champ, valeur) {
    setValeurs((v) => ({ ...v, [champ]: valeur }))
  }

  async function soumettre(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      const resultat = await envoyerCommande({
        prenom: valeurs.prenom.trim(),
        nom: valeurs.nom.trim(),
        email: valeurs.email.trim(),
        telephone: valeurs.telephone.trim(),
        modeLivraison: valeurs.modeLivraison,
        adresse: valeurs.adresse.trim() || undefined,
        ville: valeurs.ville.trim() || undefined,
        quartier: valeurs.quartier.trim() || undefined,
        note: valeurs.note.trim() || undefined,
        // On n'envoie que l'identifiant et la quantité : les prix sont
        // relus en base par le serveur.
        articles: lignes.map((l) => ({ produitId: l.produitId, quantite: l.quantite })),
      })

      setCommande(resultat)
      setEtape('confirmation')
      vider()
    } catch (err) {
      setErreur(messageErreur(err, t('L’envoi de la commande a échoué')))
    } finally {
      setEnvoi(false)
    }
  }

  function fermerEtReinitialiser() {
    fermer()
    // Remise à zéro différée : sinon l'utilisateur voit le tiroir changer
    // de contenu pendant l'animation de fermeture.
    setTimeout(() => {
      setEtape('panier')
      setValeurs(CHAMPS_VIDES)
      setCommande(null)
      setErreur('')
    }, 300)
  }

  return (
    <div className="pan" role="dialog" aria-modal="true" aria-label={t('Votre panier')}>
      <div className="pan-voile" onClick={fermerEtReinitialiser} />

      <aside className="pan-tiroir">
        <header className="pan-entete">
          {etape === 'formulaire' ? (
            <button type="button" className="pan-retour" onClick={() => setEtape('panier')}>
              <FiArrowLeft /> {t('Retour au panier')}
            </button>
          ) : (
            <h2 className="pan-titre">
              <FiShoppingBag /> {t('Votre panier')}
              {nombreArticles > 0 && <span className="pan-compteur">{nombreArticles}</span>}
            </h2>
          )}
          <button type="button" className="pan-fermer" onClick={fermerEtReinitialiser} aria-label={t('Fermer')}>
            <FiX />
          </button>
        </header>

        {/* ---------- Étape 1 : récapitulatif ---------- */}
        {etape === 'panier' && (
          <>
            <div className="pan-corps">
              {lignes.length === 0 ? (
                <div className="pan-vide">
                  <FiShoppingBag />
                  <p>{t('Votre panier est vide.')}</p>
                  <button type="button" className="btn-teal" onClick={fermerEtReinitialiser}>
                    {t('Parcourir la boutique')}
                  </button>
                </div>
              ) : (
                <ul className="pan-lignes">
                  {lignes.map((l) => (
                    <li className="pan-ligne" key={l.produitId}>
                      <div className="pan-ligne-visuel">
                        {l.image ? <img src={l.image} alt="" /> : <FiShoppingBag />}
                      </div>
                      <div className="pan-ligne-corps">
                        <p className="pan-ligne-nom">{l.nom}</p>
                        <p className="pan-ligne-prix">{fcfa(l.prix)}</p>
                        <div className="pan-qte">
                          <button
                            type="button"
                            onClick={() => changerQuantite(l.produitId, l.quantite - 1)}
                            aria-label={t('Diminuer la quantité')}
                          >
                            −
                          </button>
                          <span>{l.quantite}</span>
                          <button
                            type="button"
                            onClick={() => changerQuantite(l.produitId, l.quantite + 1)}
                            aria-label={t('Augmenter la quantité')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="pan-ligne-fin">
                        <span className="pan-ligne-total">{fcfa(l.prix * l.quantite)}</span>
                        <button
                          type="button"
                          className="pan-supprimer"
                          onClick={() => retirer(l.produitId)}
                          aria-label={t('Retirer cet article')}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lignes.length > 0 && (
              <footer className="pan-pied">
                <div className="pan-total">
                  <span>{t('Sous-total')}</span>
                  <strong>{fcfa(sousTotal)}</strong>
                </div>
                <p className="pan-note">
                  {t('Les frais de livraison sont calculés à l’étape suivante.')}
                </p>
                <button type="button" className="btn-gold" onClick={() => setEtape('formulaire')}>
                  {t('Valider ma commande')}
                </button>
              </footer>
            )}
          </>
        )}

        {/* ---------- Étape 2 : coordonnées ---------- */}
        {etape === 'formulaire' && (
          <form className="pan-corps pan-form" onSubmit={soumettre}>
            <p className="pan-form-intro">
              {t('Aucun compte n’est nécessaire. Ces informations servent uniquement à vous recontacter pour votre commande.')}
            </p>

            {erreur && <p className="pan-erreur" role="alert">{erreur}</p>}

            <div className="pan-grille-2">
              <label className="pan-champ">
                <span>{t('Prénom')} *</span>
                <input
                  type="text"
                  value={valeurs.prenom}
                  onChange={(e) => maj('prenom', e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </label>
              <label className="pan-champ">
                <span>{t('Nom')} *</span>
                <input
                  type="text"
                  value={valeurs.nom}
                  onChange={(e) => maj('nom', e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="pan-champ">
              <span>{t('Adresse e-mail')} *</span>
              <input
                type="email"
                value={valeurs.email}
                onChange={(e) => maj('email', e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@exemple.com"
              />
            </label>

            <label className="pan-champ">
              <span>{t('Téléphone')} *</span>
              <input
                type="tel"
                value={valeurs.telephone}
                onChange={(e) => maj('telephone', e.target.value)}
                required
                autoComplete="tel"
                placeholder="+221 77 000 00 00"
              />
            </label>

            <fieldset className="pan-modes">
              <legend>{t('Comment souhaitez-vous recevoir votre commande ?')}</legend>
              <label className={`pan-mode${valeurs.modeLivraison === 'retrait' ? ' actif' : ''}`}>
                <input
                  type="radio"
                  name="modeLivraison"
                  value="retrait"
                  checked={valeurs.modeLivraison === 'retrait'}
                  onChange={(e) => maj('modeLivraison', e.target.value)}
                />
                <span className="pan-mode-titre">{t('Retrait à la mosquée')}</span>
                <span className="pan-mode-note">{t('Gratuit · Ouakam, Corniche-Ouest')}</span>
              </label>
              <label className={`pan-mode${valeurs.modeLivraison === 'livraison' ? ' actif' : ''}`}>
                <input
                  type="radio"
                  name="modeLivraison"
                  value="livraison"
                  checked={valeurs.modeLivraison === 'livraison'}
                  onChange={(e) => maj('modeLivraison', e.target.value)}
                />
                <span className="pan-mode-titre">{t('Livraison')}</span>
                <span className="pan-mode-note">{fcfa(FRAIS_LIVRAISON)} · {t('Dakar et environs')}</span>
              </label>
            </fieldset>

            {valeurs.modeLivraison === 'livraison' && (
              <>
                <label className="pan-champ">
                  <span>{t('Adresse')} *</span>
                  <input
                    type="text"
                    value={valeurs.adresse}
                    onChange={(e) => maj('adresse', e.target.value)}
                    required
                    autoComplete="street-address"
                    placeholder={t('Rue, villa, repère…')}
                  />
                </label>
                <div className="pan-grille-2">
                  <label className="pan-champ">
                    <span>{t('Ville')} *</span>
                    <input
                      type="text"
                      value={valeurs.ville}
                      onChange={(e) => maj('ville', e.target.value)}
                      required
                    />
                  </label>
                  <label className="pan-champ">
                    <span>{t('Quartier')}</span>
                    <input
                      type="text"
                      value={valeurs.quartier}
                      onChange={(e) => maj('quartier', e.target.value)}
                    />
                  </label>
                </div>
              </>
            )}

            <label className="pan-champ">
              <span>{t('Message (facultatif)')}</span>
              <textarea
                rows="2"
                value={valeurs.note}
                onChange={(e) => maj('note', e.target.value)}
                placeholder={t('Précision sur votre commande…')}
              />
            </label>

            <div className="pan-recap">
              <div><span>{t('Sous-total')}</span><strong>{fcfa(sousTotal)}</strong></div>
              <div><span>{t('Livraison')}</span><strong>{fcfa(fraisLivraison)}</strong></div>
              <div className="pan-recap-total"><span>{t('Total')}</span><strong>{fcfa(total)}</strong></div>
            </div>

            <button type="submit" className="btn-gold pan-submit" disabled={envoi}>
              {envoi ? t('Envoi en cours…') : t('Envoyer ma commande')}
            </button>
            <p className="pan-note">
              {t('Le paiement se fait au retrait ou à la livraison. Un membre de l’équipe vous contactera pour confirmer.')}
            </p>
          </form>
        )}

        {/* ---------- Étape 3 : confirmation ---------- */}
        {etape === 'confirmation' && commande && (
          <div className="pan-corps pan-confirmation">
            <FiCheckCircle className="pan-confirmation-ico" />
            <h3>{t('Commande enregistrée')}</h3>
            <p className="pan-reference">{commande.reference}</p>
            <p className="pan-confirmation-txt">
              {t('Conservez cette référence : elle vous permet de suivre votre commande. Un membre de l’équipe vous contactera au numéro indiqué.')}
            </p>
            <div className="pan-confirmation-recap">
              <div><span>{t('Total')}</span><strong>{fcfa(commande.total)}</strong></div>
              <div>
                <span>{t('Mode')}</span>
                <strong>
                  {commande.modeLivraison === 'livraison'
                    ? t('Livraison')
                    : t('Retrait à la mosquée')}
                </strong>
              </div>
            </div>
            <button type="button" className="btn-teal" onClick={fermerEtReinitialiser}>
              {t('Retour à la boutique')}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
