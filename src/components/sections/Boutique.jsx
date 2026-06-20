import { Link } from 'react-router-dom'
import { images } from '../../data/content'

// BOUTIQUE — « Boutique Patrimoine » : 4 produits avec visuels
const PRODUCTS = [
  [images.puzzleImg, 'Puzzle Édition Limitée', '25 000 FCFA'],
  [images.bagImg, 'Tote Bag Coton Bio', '8 000 FCFA'],
  [images.hoodieImg, 'Hoodie Brodé', '20 000 FCFA'],
  [images.blocNoteImg, 'Carnet de Notes', '12 000 FCFA'],
]

export default function Boutique() {
  return (
    <section id="boutique" className="section bg-soft">
      <div className="sw">
        <div className="shop2-head">
          <div>
            <span className="eyebrow gold">Support &amp; Artisanat</span>
            <h2 className="sec-title">Boutique</h2>
          </div>
        </div>

        <div className="shop2-grid">
          {PRODUCTS.map(([img, name, price]) => (
            <article className="shop2-card" key={name}>
              <div className="thumb"><img src={img} alt={name} loading="lazy" /></div>
              <h5 className="shop2-name">{name}</h5>
              <p className="shop2-price">{price}</p>
            </article>
          ))}
        </div>

        <div className="shop2-cta-wrap">
          <Link to="/boutique" className="btn-teal">Voir tout</Link>
        </div>
      </div>
    </section>
  )
}
