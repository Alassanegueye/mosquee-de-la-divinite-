import { images, SANGABI_BIO } from '../../data/content'
import { useT } from '../../utils/useT'

// SANGABI — image à sa taille naturelle à gauche + écritures sur deux colonnes à droite
export default function Sangabi() {
  const t = useT()

  return (
    <section id="sangabi" className="section bg-white">
      <div className="sw">
        <div className="sangabi-row">
          <div className="sangabi-photo" data-reveal>
            <img src={images.khalife} alt={t('Mouhamed Gorgui Seyni Gueye, dit Sangabi')} loading="lazy" />
          </div>
          <div className="sangabi-text" data-reveal>
            <div className="f-dates">{t('19 juillet 1926 · 12 mars 2007')}</div>
            <h3 className="f-name">Mouhamed Gorgui Seyni Gueye</h3>
            <p className="f-aka">{t('dit Sangabi · Khalifatou Lahi Fil Ardi')}</p>
            <div className="sangabi-cols">
              {SANGABI_BIO.map((p, i) => (
                <p className="f-bio" key={i}>{t(p)}</p>
              ))}
            </div>
            <blockquote className="f-quote">
              «&nbsp;{t('Dieu, qui m’a demandé de construire, nous donnera les moyens nécessaires pour réaliser cette Mosquée inchallah.')}&nbsp;»
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
