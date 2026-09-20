import actionNdogou from '../../assets/photo/Korite.jpg'
import actionSchool from '../../assets/photo/Fayfaat.jpg'
import actionBlood from '../../assets/photo/1er Octobre.jpg'
import actionMedical from '../../assets/photo/659156031_18319742143264052_4431240640787869140_n.jpg'
import actionSetSetal from '../../assets/photo/Journées prieres.jpg'
import actionSolidarity from '../../assets/photo/Exposition-2.jpg'

const ACTIONS = [
  {
    title: 'Ndogou gratuit — Ramadan',
    body: 'Du lundi au vendredi pendant le Ramadan. Rupture du jeûne offerte sur place. 150 personnes accueillies en moyenne chaque soir.',
    image: actionNdogou,
    alt: 'Tables de rupture du jeûne pendant le Ramadan'
  },
  {
    title: 'Soutien scolaire',
    body: "Organisé par CEEMNA, le collectif des élèves et étudiants du mouvement Naby Allah. 300 kits scolaires à chaque rentrée depuis 2012. Plus de 3 600 enfants accompagnés. Soutien tout au long de l'année.",
    image: actionSchool,
    alt: 'Enfants accompagnés dans le cadre du soutien scolaire'
  },
  {
    title: 'Don de sang',
    body: 'Organisé par CEEMNA en partenariat avec les Scouts et Guides Musulmans du Sénégal. Chaque mars depuis 2013. 100 poches par édition. Plus de 1 000 poches au total.',
    image: actionBlood,
    alt: 'Don de sang organisé par la communauté'
  },
  {
    title: 'Consultation médicale gratuite',
    body: 'Organisée par la Commission Médicale Naby Allah et le Club Médical de Ouakam. Chaque mars, des soins gratuits sont offerts à la communauté et aux habitants du quartier.',
    image: actionMedical,
    alt: 'Consultation médicale gratuite pour les habitants du quartier'
  },
  {
    title: 'Set Setal',
    body: "Organisé par UFMNA, l'union des femmes musulmanes du mouvement Naby Allah. Chaque 2e week-end de décembre, la communauté se mobilise pour nettoyer la mosquée et ses alentours.",
    image: actionSetSetal,
    alt: 'Mobilisation communautaire pour nettoyer la mosquée'
  },
  {
    title: 'Solidarité Communautaire',
    body: "Aide aux plus démunis tout au long de l'année. Un soutien discret et continu, au cœur de la pratique Naby Allah.",
    image: actionSolidarity,
    alt: 'Solidarité et entraide au sein de la communauté'
  }
]

export default function Communaute() {
  return (
    <section id="communaute" className="section bg-soft">
      <div className="sw">
        <div className="comm2-head">
          <div className="comm2-heading-wrap">
            <h2 className="comm2-title">Actions communautaires</h2>
          </div>
        </div>

        <div className="actions">
          {ACTIONS.map((action) => (
            <article className="action" key={action.title}>
              <div className="action-photo">
                <img src={action.image} alt={action.alt} loading="lazy" />
              </div>
              <div className="action-body">
                <h3 className="action-title">{action.title}</h3>
                <p>{action.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
