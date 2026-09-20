import { useT } from '../../utils/useT'

// TIMELINE — « Le Fil du Temps » : chronologie sacrée en alternance (réf)
const STEPS = [
  ['1973', 'La révélation en songe', 'Dans la nuit du 28 au 29 juin, Sangabi voit une maquette lumineuse descendre du ciel. Une voix le conduit jusqu’à la baie de Ouakam. Sur la porte de droite : ALLAHOU AKBAR en lettres d’or. Il dessine. Il attend.'],
  ['1977', 'Premier appel public à Ouakam', 'Sangabi sort du silence. Il transmet le message, Jub, Ragal Yàlla, Sellal, et appelle les hommes à revenir vers Dieu. La communauté Naby Allah prend forme.'],
  ['1979', 'Reconnaissance du site', 'Sangabi confirme l’emplacement exact selon les révélations. Le 31 décembre 1979, la première manifestation a lieu sur le site.'],
  ['1992', 'Pose de la première pierre', '29 janvier 1992. Sangabi pose lui-même la première cotisation. « Dieu qui m’a demandé de construire nous donnera les moyens. » Les travaux débutent le 20 mai.'],
  ['1992–1997', 'L’épopée de la construction', 'Sans machines. Toute une communauté au travail. La coupole suspendue de 80 tonnes en béton armé, une prouesse architecturale réalisée à mains nues.'],
  ['1997', 'Inauguration', 'La Mosquée de la Divinité ouvre ses portes le 1er octobre. L’invité d’honneur devait être El Hadji Abdou Aziz Sy, Khalife Général des Tidianes. Son fils Mame Alpha Sy honore la cérémonie.'],
  ['2007', 'Disparition de Sangabi', 'Le 12 mars 2007, Sangabi est rappelé à Dieu. Le message demeure. La mosquée demeure. La communauté demeure.'],
]

export default function Timeline() {
  const t = useT()

  return (
    <section id="timeline" className="section bg-teal">
      <div className="sw">
        <div className="sec-head-center">
          <span className="eyebrow red">{t('Chronologie Sacrée')}</span>
          <h2 className="sec-title light">{t('Le Fil du')} <em>{t('Temps')}</em></h2>
        </div>

        <div className="timeline2">
          <span className="tl2-line" />
          {STEPS.map(([year, title, body], i) => (
            <div className={`tl2-row ${i % 2 === 0 ? 'left' : 'right'}`} key={year} data-reveal>
              <span className="tl2-dot" />
              <div className="tl2-card">
                <p className="tl2-year">{t(year)}</p>
                <h4 className="tl2-title">{t(title)}</h4>
                <p className="tl2-body">{t(body)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
