// Contenu du site centralisé (médias + données réutilisées) — source unique de vérité.
import khalife from '../assets/Khalife de Dieu.jpg'
import expoImg from '../assets/Exposition.jpg'
import expo2Img from '../assets/Exposition-2.jpg'
import fajrImg from '../assets/Fajr.jpg'
import ishaImg from '../assets/Isha.jpg'
import maghribImg from '../assets/MAGHRIB.jpg'
import heroVideo from '../assets/hero3.mp4'
import khalifeJeune from '../assets/Khalife Jeune.jpg'
import khalifeReco from '../assets/Le khalife en reconnaissance sur le site.jpg'
import avantMosquee from '../assets/Avant Mosquée.jpg'
import exposition3 from '../assets/exposition 3.jpg'
import exposition4 from '../assets/ecposition 4.jpg'
import asrImg from '../assets/asr.jpg'
import jumaaImg from '../assets/Jumaa.jpg'
import puzzleImg from '../assets/puzzle.webp'
import bagImg from '../assets/Shopping_Bag_Mockup_v01.jpg'
import hoodieImg from '../assets/Hoodie.webp'
import blocNoteImg from '../assets/Bloc-Note.webp'

export const VIDEO = heroVideo

export const images = {
  khalife, expoImg, expo2Img, fajrImg, ishaImg, maghribImg,
  khalifeJeune, khalifeReco, avantMosquee,
  exposition3, exposition4, asrImg, jumaaImg,
  puzzleImg, bagImg, hoodieImg, blocNoteImg,
}

// Navigation du footer : libellé + ancre
export const FOOTER_NAV = [
  ['Histoire', '#histoire'], ['Visiter', '#visiter'], ['Prier', '#prier'],
  ['Le Message', '#message'], ['Communauté', '#communaute'],
  ['Rénovation', '#renovation'], ['Boutique', '#boutique'],
]

// ===== HERO ===== (chiffres-clés de la barre de statistiques)
export const HERO_STATS = [
  ['1973', 'Révélation fondatrice'],
  ['5 ans 5 mois', 'De construction'],
  ['45 m', 'Hauteur des minarets'],
  ['80 t', 'Coupole béton armé'],
]

// ===== SANGABI ===== (biographie affichée dans la section image + texte)
export const SANGABI_BIO = [
  'Né à Dakar, formé au dessin industriel au Lycée Maurice Delafosse, ancien comptable chez BTP Augier. Il a participé à la construction de la Grande Mosquée de Touba, comme comptable.',
  'En 1963, Dieu lui ordonna une retraite spirituelle. Il se retira du monde. Sans revenus ni moyens. Quatorze ans de silence intérieur.',
  'Sa femme, Sokhna Sagar Diagne, l’accompagna à travers ces années d’épreuve avec une foi et une dignité inébranlables.',
  'Durant cette retraite, Dieu l’investit comme Khalife de Dieu sur Terre. Et dans la nuit du 28 au 29 juin 1973, la mosquée lui fut révélée en songe. Une maquette lumineuse parachutée du ciel. ALLAHOU AKBAR en lettres d’or sur la porte de droite.',
  'Le 6 mars 1977, sa retraite achevée, Sangabi fit son premier appel public à Ouakam, appelant les hommes à revenir vers Dieu. Le mouvement Naby Allah était né.',
  'Tout au long de sa vie, il rappela le message que Dieu lui avait confié, trois principes pour quiconque veut vivre en paix avec Dieu, avec les autres et avec soi-même : Jub. Ragal Yàlla. Sellal.',
  'La mosquée, il la partagea avec la communauté. Il ne la leur confia pas de loin. Il était là. Chaque jour sur le chantier. Gérant les cotisations, suivant les travaux, travaillant avec eux.',
  'Le 1er octobre 1997, la mosquée était debout. Sangabi aussi. Dix ans plus tard, le 12 mars 2007, il s’en alla. L’œuvre et le message sont toujours là.',
]

// ===== EXPOSITION ===== (chapitres I → VI)
export const EXPO_THEMES = [
  ['I', 'Le Songe', '1973', 'La nuit du 28 au 29 juin. La maquette lumineuse. ALLAHOU AKBAR en lettres d’or. Un homme dessine ce qu’il a vu. Il attend.'],
  ['II', 'La Reconnaissance du site', '1979', 'L’emplacement confirmé selon les révélations. Le 31 décembre 1979, première manifestation sur le site.'],
  ['III', 'La Première Pierre', '1992', '29 janvier 1992. Cérémonie officielle. Les travaux débutent le 20 mai. Une communauté choisit de bâtir.'],
  ['IV', 'La Construction', '1992–1997', 'Cinq ans et cinq mois. Sans machines ni subventions. Les minarets de 45 m. Le pont Al Sirat. La coupole de 80 tonnes.'],
  ['V', 'L’Inauguration', '1er octobre 1997', 'La Mosquée de la Divinité ouvre ses portes. Ce qui a été reçu en songe est maintenant debout dans la pierre.'],
  ['VI', 'Aujourd’hui', '', 'La mosquée vivante — prières quotidiennes, événements, archive en construction, rénovation à venir.'],
]
