import { FiShoppingBag } from 'react-icons/fi'
import { usePanier } from '../../context/usePanier'
import { useT } from '../../utils/useT'

/**
 * Bouton flottant d'accès au panier.
 *
 * Masqué tant que le panier est vide : un panier à zéro article n'a rien
 * à montrer et encombrerait l'écran sur mobile, déjà occupé par la barre
 * d'appel au don.
 */
export default function BoutonPanier() {
  const t = useT()
  const { nombreArticles, ouvrir, ouvert } = usePanier()

  if (nombreArticles === 0 || ouvert) return null

  return (
    <button
      type="button"
      className="btn-panier"
      onClick={ouvrir}
      aria-label={`${t('Voir le panier')} (${nombreArticles})`}
    >
      <FiShoppingBag />
      <span className="btn-panier-badge">{nombreArticles}</span>
    </button>
  )
}
