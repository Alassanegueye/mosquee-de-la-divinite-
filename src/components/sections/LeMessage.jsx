// LE MESSAGE — « Un Message de Vérité » : Jub / Ragal Yàlla / Sellal (réf)
const PILLARS = [
  ['الهُدَى', 'emerald', 'Jub', '(Droiture)', 'La rectitude du comportement. Être droit envers Dieu et envers les hommes.', false],
  ['تَقْوَى', 'red', 'Ragal Yàlla', '(Taqwa)', 'La conscience du Créateur. Nourrir en son cœur une crainte révérencielle.', true],
  ['أَصْلَح', 'hollow', 'Sellal', '(Réforme)', 'La pureté de l’âme. Un processus continu de transformation intérieure.', false],
]

export default function LeMessage() {
  return (
    <section id="message" className="section bg-white">
      <div className="sw">
        <div className="sec-head-center">
          <span className="eyebrow red">La Réforme Naby Allah</span>
          <h2 className="sec-title">Un Message de <em>Vérité</em></h2>
        </div>

        <div className="message2">
          {PILLARS.map(([ar, color, name, trans, body, mid]) => (
            <div className={`msg2-col ${mid ? 'mid' : ''}`} key={name}>
              <p className={`msg2-ar ${color}`}>{ar}</p>
              <h3 className="msg2-name">{name}</h3>
              <p className="msg2-trans">{trans}</p>
              <p className="msg2-body">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
