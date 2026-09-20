import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  HardHat, 
  Zap, 
  Volume2, 
  Users, 
  ArrowRight, 
  Heart, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Layers, 
  PackageCheck,
  Building,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chargerRenovation, urlMedia } from '../service/api';
import { useT } from '../utils/useT';
import logoRenovation from '../assets/photo/LOGO_RENOVATION-02.png';

// La base ne stocke qu'un nom d'icône : y mettre un composant React
// obligerait à redéployer le site pour changer le pictogramme d'un chantier.
const ICONES = { HardHat, Building2, Zap, Volume2, Building, ShieldCheck, Layers, PackageCheck, Sparkles };

/** 1 -> « Un », 4 -> « Quatre »… au-delà, le chiffre suffit. */
const EN_LETTRES = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit'];
function enLettres(n) {
  return EN_LETTRES[n] || String(n);
}

/** 123000000 -> « 123.000.000 FCFA », la notation de la brochure. */
function montant(valeur, devise = 'FCFA') {
  return `${Number(valeur || 0).toLocaleString('fr-FR').split(/\s/).join('.')} ${devise}`;
}


// =========================================================================
// LOGO OFFICIEL DE LA CAMPAGNE
// =========================================================================
// Le logo vient de la base (modifiable au dashboard) ; le fichier livré
// avec le site sert de repli pour qu'une base vierge reste signée.
// Fichier image et non SVG inline : le logo est un visuel de charte, pas
// une illustration a redessiner. Les props restent celles de l ancien
// composant pour ne pas toucher aux appels.
function RenovationLogo({ className = '', size = 'md', source }) {
  // Ce composant vit hors de la page : il lui faut son propre hook pour
  // traduire le texte alternatif de l'image.
  const t = useT();
  const hauteur =
    size === 'sm' ? 'max-h-16'
    : size === 'md' ? 'max-h-24 sm:max-h-28'
    : size === 'lg' ? 'max-h-36 sm:max-h-44'
    : 'max-h-56';

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <img
        src={source || logoRenovation}
        alt={t("Projet Rénovation — Mosquée de la Divinité")}
        className={`w-auto h-auto max-w-full object-contain ${hauteur}`}
      />
    </div>
  );
}

// =========================================================================
// COMPOSANT PRINCIPAL DE LA PAGE RÉNOVATION (JSX)
// =========================================================================
export default function RenovationView() {
  const navigate = useNavigate();
  // Traduction par texte source : le français reste écrit ici, l’anglais
  // vit dans data/i18n.js. Une clé absente retombe sur le français.
  const t = useT();
  // Contenu de la page : campagne, chantiers, responsables et moyens de
  // paiement viennent tous de la base, pilotés depuis le dashboard.
  const [contenu, setContenu] = useState(null);
  const [indisponible, setIndisponible] = useState(false);

  useEffect(() => {
    let annule = false;
    chargerRenovation()
      .then((donnees) => { if (!annule) setContenu(donnees); })
      .catch(() => { if (!annule) setIndisponible(true); });
    return () => { annule = true; };
  }, []);

  const campagne = contenu?.campagne;
  const devise = campagne?.devise || 'FCFA';
  const TOTAL_BUDGET = campagne?.objectif ?? 0;
  const currentCollected = campagne?.collecte ?? 0;
  // Aucune donnée encore reçue : on masque les montants au lieu
  // d'annoncer un objectif nul.
  const chiffresPrets = Boolean(campagne);

  // Modales
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [natureModalOpen, setNatureModalOpen] = useState(false);

  // Formulaire don financier
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donationAmount, setDonationAmount] = useState(25000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [targetedProject, setTargetedProject] = useState('global');
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Formulaire don en nature
  const [natureItemType, setNatureItemType] = useState('ciment_fer');
  const [natureDescription, setNatureDescription] = useState('');
  const [natureContact, setNatureContact] = useState('');
  const [natureSuccess, setNatureSuccess] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast("Numéro copié dans le presse-papier !");
    }
  };

  const handleGoToFullDonation = () => {
    navigate('/dons');
  };

  // Chantiers de la campagne. Les noms de champs restent ceux du
  // composant : seule la source change, le rendu n'est pas touché.
  const projects = (contenu?.chantiers || []).map((c) => ({
    id: c.id,
    code: c.code,
    title: c.titre,
    estimate: c.estimation,
    formattedEstimate: montant(c.estimation, devise),
    icon: ICONES[c.icone] || Building2,
    color: c.couleur || '#0e4b50',
    badge: c.badge,
    image: urlMedia(c.image),
    summary: c.resume,
    works: c.travaux || [],
    collected: c.collecte,
    progress: c.estimation > 0 ? Math.min(100, Math.round((c.collecte / c.estimation) * 100)) : 0,
  }));
  // Calcul du taux global (à 0% au démarrage)
  // Le pourcentage vient du serveur : deux clients qui le recalculent
  // finissent par diverger d'un arrondi.
  const overallProgress = campagne?.pourcentage ?? 0;

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    const effectiveAmt = donationAmount === 'custom' ? Number(customAmount) : donationAmount;
    if (!effectiveAmt || effectiveAmt <= 0) {
      showToast("Veuillez sélectionner ou saisir un montant valide.");
      return;
    }
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setDonateModalOpen(false);
      showToast(`Qu'Allah vous bénisse ! Votre don de ${effectiveAmt.toLocaleString('fr-FR')} FCFA a été enregistré.`);
    }, 2200);
  };

  const handleNatureSubmit = (e) => {
    e.preventDefault();
    if (!natureDescription.trim() || !natureContact.trim()) {
      showToast("Veuillez renseigner la description du don et votre contact.");
      return;
    }
    setNatureSuccess(true);
    setTimeout(() => {
      setNatureSuccess(false);
      setNatureModalOpen(false);
      setNatureDescription('');
      setNatureContact('');
      showToast("Votre proposition de don en nature a été transmise à la commission des travaux.");
    }, 2200);
  };

  // LES 3 RESPONSABLES DU CHANTIER ACTUELS (avec photos en cercle)
  const activeLeaders = (contenu?.responsables || []).map((r) => ({
    id: r.id,
    name: r.nom,
    roleTitle: r.roleTitre,
    responsibility: r.responsabilite,
    image: urlMedia(r.image),
    bio: r.bio,
  }));

  return (
    <div id="grands-travaux-light-page" className="renovation-preview w-full bg-[#f8fafb] text-[#1c3336] selection:bg-[#C11616] selection:text-white min-h-screen">

      {/* Tant que les chiffres ne sont pas arrivés, un voile discret plutôt
          qu un objectif à 0 FCFA qui passerait pour la réalité de la collecte. */}
      {!contenu && !indisponible && (
        <div className="fixed inset-x-0 top-0 h-0.5 bg-[#C11616]/70 animate-pulse z-50" aria-hidden="true" />
      )}

      {/* Contenu injoignable : on le dit plutot que d afficher une page de
          chiffres a zero qui passerait pour la realite de la collecte. */}
      {indisponible && (
        <div className="bg-[#fcf3f3] border-b border-[#f5c6c6] text-[#C11616] text-center text-xs tracking-wider uppercase font-bold py-3 px-6">{t("Les chiffres de la campagne sont momentanement indisponibles.")}</div>
      )}
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-white border-2 border-[#0e4b50] text-[#0e4b50] text-xs py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Sparkles size={16} className="text-[#C11616]" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          0. TOP BRANDING BAR : LOGO CHARTE OFFICIELLE (Style Light)
          ========================================================================= */}
      <div className="w-full bg-white border-b border-[#d6e3e5] pt-24 pb-6 px-6 shadow-sm">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <RenovationLogo size="md" source={urlMedia(campagne?.logo)} />
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs tracking-wider">
            <div className="bg-[#f0f5f6] border border-[#c3d8da] text-[#0e4b50] px-4 py-2 rounded-full flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C11616] animate-pulse" />
              <span>{t("CAMPAGNE OFFICIELLE DE SAUVEGARDE")}</span>
            </div>
            <div className="bg-[#fcf3f3] border border-[#f5c6c6] text-[#C11616] px-4 py-2 rounded-full font-bold">
              <span>{t("FI SABILILAH · DAKAR")}</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          I. HERO MAJESTUEUX : STYLE LIGHT AVEC LA MOSQUÉE DE LA DIVINITÉ VISIBLE
          ========================================================================= */}
      <section 
        id="hero-renovation-light"
        className="relative py-12 md:py-20 px-6 md:px-14 lg:px-20 border-b border-[#d6e3e5] overflow-hidden"
      >
        {/* Photo de fond authentique de la Mosquée de la Divinité face à l'Océan */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Pas de <img> sans source : le navigateur afficherait une
              icône de fichier cassé en plein écran. */}
          {urlMedia(campagne?.imageHero) && (
            <img
              src={urlMedia(campagne.imageHero)}
              alt={t("Mosquée de la Divinité de Dakar face à l'Océan Atlantique")}
              className="w-full h-full object-cover object-center filter contrast-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafb] via-transparent to-white/60" />
        </div>

        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Colonne Gauche : Titre et Appel officiel */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#e8f1f2]/95 backdrop-blur-sm border border-[#b8d4d7] text-[#0e4b50] text-xs uppercase tracking-[0.2em] font-bold shadow-xs">
              <Building size={14} className="text-[#C11616]" />
              <span>{t("La Mosquée a Besoin de Vous · 30 Ans face à l'Océan")}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-[#0c282b] leading-[1.08] tracking-tight">{t("Ensemble, rénovons la")}<span className="text-[#C11616] font-normal italic block">{t("Maison de Dieu")}</span>
            </h1>

            {/* Citation officielle de la brochure */}
            <div className="bg-white/95 backdrop-blur-md border-l-4 border-[#C11616] p-5 rounded-r-xl shadow-md border-y border-r border-slate-200">
              <p className="text-xs text-[#0e4b50] uppercase tracking-wider font-bold mb-1">{t("30 Ans d'Existence face à l'Érosion Maritime")}</p>
              <p className="text-lg sm:text-xl text-[#243e41] italic leading-relaxed">{t("« Depuis plus de 30 ans, la Mosquée de la Divinité résiste vaillamment à l’érosion maritime et aux embruns de l'Atlantique. Aujourd'hui, préserver ce sanctuaire sacré exige la mobilisation solidaire de chacun. »")}</p>
            </div>

            {/* Vignette photo de la Mosquée */}
            {urlMedia(campagne?.imageHero) && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg bg-slate-900 group max-w-xl">
              <img
                src={urlMedia(campagne.imageHero)}
                alt={t("Vue de la Mosquée de la Divinité")}
                className="w-full h-36 sm:h-44 object-cover object-[center_38%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f1c11c] animate-pulse" />
                  <span className="text-xs uppercase tracking-wider font-semibold">{t("Mosquée de la Divinité · Ouakam, Dakar")}</span>
                </div>
                <span className="text-[10px] font-mono bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20 text-slate-100">{t("Édifiée en 1992")}</span>
              </div>
            </div>
            )}

            {/* Boutons d'action principaux */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleGoToFullDonation}
                className="bg-[#C11616] hover:bg-[#a61313] text-white text-xs tracking-[0.2em] uppercase font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-[#C11616]/30 cursor-pointer active:scale-98"
              >
                <Heart size={16} fill="currentColor" />
                <span>FAIRE UN DON (FI SABILILAH)</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => setNatureModalOpen(true)}
                className="bg-white/95 hover:bg-white border-2 border-[#0e4b50] text-[#0e4b50] text-xs tracking-[0.2em] uppercase font-bold py-4 px-7 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <PackageCheck size={16} />
                <span>Don en Nature (Matériaux)</span>
              </button>
            </div>

            {/* Indicateurs de réassurance */}
            <div className="pt-2 flex items-center gap-6 text-xs text-[#2d494c] tracking-wider font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0e4b50]" />{t("Devis Audités")}</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0e4b50]" />{t("Comité d’Ingénieurs")}</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0e4b50]" />{t("Transparence Totale")}</span>
            </div>
          </div>

          {/* Colonne Droite : Carte Jauge Officielle À ZÉRO */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md border-2 border-[#d6e3e5] rounded-3xl p-7 sm:p-9 shadow-2xl text-left space-y-6 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                <div>
                  <span className="text-[11px] tracking-widest text-[#C11616] uppercase font-bold block">{t("Budget Global des Travaux")}</span>
                  <span className="text-sm text-[#506e71]">{t("Estimations officielles des 4 chantiers")}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0e4b50] block">
                    {chiffresPrets ? `${overallProgress}%` : '—'}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">{t("Souscription")}</span>
                </div>
              </div>

              {/* Jauge Visuelle mise à ZÉRO */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-[#eef3f4] rounded-full overflow-hidden p-0.5 border border-[#c9dadc]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#C11616] to-[#0e4b50] rounded-full shadow-sm"
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-[#3b595c] font-semibold">
                  <span>{t("Collecté :")}<strong className="text-[#C11616] text-sm">{chiffresPrets ? montant(currentCollected, devise) : '—'}</strong></span>
                  <span>{t("Objectif :")}<strong className="text-[#0e4b50] text-sm">{chiffresPrets ? montant(TOTAL_BUDGET, devise) : '—'}</strong></span>
                </div>
              </div>

              {/* Synthèse des 4 montants de la brochure */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-[#355255] font-bold block">{t("Estimations par Chantier :")}</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#fafbfc] p-3 rounded-xl border border-[#d6e3e5] flex justify-between items-center">
                    <div>
                      <span className="text-[#C11616] text-[10px] font-bold block">{t("PROJET A")}</span>
                      <span className="text-[10px] text-[#557275] font-sans">{t("Structure")}</span>
                    </div>
                    <span className="font-bold text-[#0c282b]">123 M</span>
                  </div>
                  <div className="bg-[#fafbfc] p-3 rounded-xl border border-[#d6e3e5] flex justify-between items-center">
                    <div>
                      <span className="text-[#0e4b50] text-[10px] font-bold block">{t("PROJET B")}</span>
                      <span className="text-[10px] text-[#557275] font-sans">{t("Toilettes")}</span>
                    </div>
                    <span className="font-bold text-[#0c282b]">52 M</span>
                  </div>
                  <div className="bg-[#fafbfc] p-3 rounded-xl border border-[#d6e3e5] flex justify-between items-center">
                    <div>
                      <span className="text-[#b78103] text-[10px] font-bold block">{t("PROJET C")}</span>
                      <span className="text-[10px] text-[#557275] font-sans">{t("Élec / Solaire")}</span>
                    </div>
                    <span className="font-bold text-[#0c282b]">10 M</span>
                  </div>
                  <div className="bg-[#fafbfc] p-3 rounded-xl border border-[#d6e3e5] flex justify-between items-center">
                    <div>
                      <span className="text-[#167078] text-[10px] font-bold block">{t("PROJET D")}</span>
                      <span className="text-[10px] text-[#557275] font-sans">{t("Sonorisation")}</span>
                    </div>
                    <span className="font-bold text-[#0c282b]">15 M</span>
                  </div>
                </div>
              </div>

              {/* Reste à collecter */}
              <div className="bg-[#f0f5f6] border border-[#b8d4d7] p-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#0e4b50] font-bold uppercase tracking-wider">{t("Reste à Financer :")}</span>
                <span className="font-mono font-extrabold text-[#C11616] text-sm">
                  {(TOTAL_BUDGET - currentCollected).toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* Boutons d'action carte */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoToFullDonation}
                  className="w-full bg-[#0e4b50] hover:bg-[#09363a] text-white text-xs tracking-wider uppercase font-bold py-3.5 rounded-xl transition-all text-center cursor-pointer shadow-sm"
                >{t("Faire un Don")}</button>
                <button
                  onClick={handleGoToFullDonation}
                  className="w-full bg-white hover:bg-slate-50 border border-[#c2d7da] text-[#0e4b50] text-xs tracking-wider uppercase font-bold py-3.5 rounded-xl transition-all text-center cursor-pointer shadow-sm"
                >{t("Modes de paiement")}</button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          II. LES QUATRE CHANTIERS : AVEC IMAGES DÉDIÉES & CHIFFRES (Style Light)
          ========================================================================= */}
      <section id="les-quatre-projets" className="w-full bg-white py-20 px-6 md:px-14 lg:px-20 border-b border-[#d6e3e5]">
        <div className="max-w-[1240px] mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-[#C11616] text-xs tracking-[0.25em] uppercase font-bold">
              <Layers size={16} />
              <span>Programme d'Exécution · {projects.length} Chantier{projects.length > 1 ? 's' : ''} Prioritaire{projects.length > 1 ? 's' : ''}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl text-[#0c282b] font-light tracking-tight leading-tight">
              {enLettres(projects.length)} Projet{projects.length > 1 ? 's' : ''} pour Sauvegarder la Mosquée
            </h2>
            <p className="text-lg md:text-xl text-[#39575a] leading-relaxed">{t("« Votre contribution servira à financer un ensemble de projets de rénovation de la mosquée. » Chaque projet fait l’objet d’un devis technique rigoureux et peut être financé individuellement.")}</p>
          </div>

          {/* Grille des 4 projets avec images illustratives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const IconComp = project.icon;
              return (
                <div
                  key={project.id}
                  className="bg-[#fafbfc] border border-[#d6e3e5] rounded-3xl overflow-hidden hover:border-[#0e4b50] hover:shadow-2xl transition-all duration-300 text-left flex flex-col justify-between group"
                >
                  <div>
                    {/* Image illustrative du projet */}
                    <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                        />
                      ) : (
                        // Chantier sans photo : aplat aux couleurs du projet
                        // plutôt qu'un cadre vide au milieu de la grille.
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${project.color}14` }}
                        >
                          <project.icon size={52} style={{ color: project.color, opacity: 0.45 }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      
                      {/* Badge Projet & Code */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span 
                          className="text-xs font-bold text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md"
                          style={{ backgroundColor: project.color }}
                        >
                          {project.code}
                        </span>
                        <span className="bg-white/95 text-[#0c282b] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                          {project.badge}
                        </span>
                      </div>

                      {/* Devis Officiel */}
                      <div className="absolute bottom-4 right-4 text-right bg-white/95 backdrop-blur-sm border border-slate-200 py-1.5 px-4 rounded-xl shadow-lg">
                        <span className="text-[9px] uppercase tracking-wider text-[#557275] block font-bold">{t("Estimation du Chantier")}</span>
                        <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#0c282b]">
                          {project.formattedEstimate}
                        </span>
                      </div>
                    </div>

                    {/* Contenu textuel officiel */}
                    <div className="p-7 sm:p-8 space-y-5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-sm"
                          style={{ backgroundColor: `${project.color}15`, color: project.color }}
                        >
                          <IconComp size={22} />
                        </div>
                        <h3 className="text-2xl sm:text-3xl text-[#0c282b] font-medium leading-snug">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-base text-[#3d595c] leading-relaxed">
                        {project.summary}
                      </p>

                      {/* Liste exacte des travaux de la brochure */}
                      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 space-y-2.5 shadow-sm">
                        <span className="text-xs text-[#0e4b50] uppercase tracking-wider font-bold block">{t("Les Travaux Prévus :")}</span>
                        <ul className="space-y-2 text-sm text-[#243e41]">
                          {project.works.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-[#C11616] mt-2 shrink-0" />
                              <span className="leading-relaxed font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Barre d'action et jauge à zéro */}
                  <div className="p-7 sm:p-8 pt-0">
                    <div className="border-t border-[#e2e8f0] pt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#557275]">{t("Progression du financement :")}</span>
                        <strong className="text-[#0c282b] font-bold">{project.progress}% ({montant(project.collected, devise)})</strong>
                      </div>
                      <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                        />
                      </div>
                    </div>

                    <div className="pt-5 flex items-center justify-between gap-3">
                      <button
                        onClick={handleGoToFullDonation}
                        className="w-full bg-[#0e4b50] hover:bg-[#082a2d] text-white text-xs tracking-wider uppercase font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <Heart size={14} fill="currentColor" className="text-[#C11616]" />
                        <span>Financer le {project.code}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bannière de récapitulation globale */}
          <div className="bg-[#f0f5f6] border-2 border-[#b8d4d7] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6 text-left shadow-sm">
            <div className="space-y-2">
              <span className="text-xs text-[#C11616] uppercase tracking-widest font-bold block">{t("Totalité des 4 Projets de la Brochure")}</span>
              <h4 className="text-2xl sm:text-3xl text-[#0c282b] font-medium">{t("200.000.000 FCFA pour la sauvegarde complète")}</h4>
              <p className="text-base text-[#446265]">{t("Vous pouvez affecter votre don à l'un des 4 chantiers ou au fonds global de sauvegarde du patrimoine.")}</p>
            </div>
            <button
              onClick={handleGoToFullDonation}
              className="bg-[#C11616] hover:bg-[#a61313] text-white text-xs tracking-[0.2em] uppercase font-bold py-4 px-8 rounded-xl transition-all shrink-0 cursor-pointer shadow-md hover:shadow-lg"
            >{t("Participer Maintenant")}</button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          III. LES TROIS RESPONSABLES ACTUELS DU CHANTIER (Harmonieuse Section Vert Émeraude)
          ========================================================================= */}
      <section 
        id="responsables-travaux-light" 
        className="w-full bg-[#0e4b50] text-white py-24 px-6 md:px-14 lg:px-20 border-b border-[#093539] relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#187881]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#082a2d]/50 blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto space-y-16 relative z-10">
          
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs tracking-[0.25em] uppercase font-bold">
              <Users size={16} className="text-[#f1c11c]" />
              <span>Gouvernance &amp; Exécution des Travaux</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl text-white font-light tracking-tight leading-tight">{t("Responsables des Travaux de Rénovation")}</h2>
            <p className="text-lg md:text-xl text-[#d0e5e7] leading-relaxed">{t("La conduite, l'engagement financier et la responsabilité technique du présent chantier sont assurés collégialement par les trois responsables en activité ci-dessous.")}</p>
          </div>

          {/* Les 3 Responsables Actuels présentés avec PHOTO EN CERCLE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white text-[#1c3336] rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5 flex flex-col items-center">
                  
                  {/* Photo en cercle */}
                  <div className="relative">
                    <div className="renovation-leader-avatar w-36 h-36 sm:w-40 sm:h-40 rounded-full ring-4 ring-[#0e4b50] shadow-xl overflow-hidden bg-slate-100">
                      {leader.image ? (
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full rounded-full object-cover filter contrast-[1.05]"
                        />
                      ) : (
                        // Initiales tant que le portrait n'est pas téléversé.
                        <div className="w-full h-full flex items-center justify-center bg-[#0e4b50] text-white text-3xl font-light">
                          {(leader.name || '?').trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0e4b50] text-white text-[9px] uppercase tracking-wider font-bold py-1 px-3.5 rounded-full shadow-md whitespace-nowrap border border-white/30">{t("Responsable Actif")}</span>
                  </div>

                  <div className="pt-2 space-y-1">
                    <h3 className="text-2xl sm:text-3xl text-[#0c282b] font-medium leading-tight">
                      {leader.name}
                    </h3>
                    <span className="text-xs text-[#C11616] font-bold block uppercase tracking-wider">
                      {leader.roleTitle}
                    </span>
                    <span className="text-xs text-[#0e4b50] block tracking-wide font-bold">
                      {leader.responsibility}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#3d595c] leading-relaxed italic border-t border-[#e2e8f0] pt-4 text-left">
                    « {leader.bio} »
                  </p>

                </div>

                <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-center gap-2 text-xs text-[#0e4b50] font-bold tracking-wider">
                  <ShieldCheck size={16} className="text-[#C11616]" />
                  <span>{t("Comité Directeur du Chantier")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mention commémorative de Feu Mouhamed Seyni Gueye */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-white text-[#0e4b50] flex items-center justify-center shrink-0 shadow-lg">
              <Building size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[#f1c11c] uppercase tracking-widest font-bold block">
                Hommage &amp; Mémoire Spirituelle
              </span>
              <h4 className="text-xl text-white font-medium">
                Feu Mouhamed Seyni Gueye (Sanga bi, 1926-2007)
              </h4>
              <p className="text-sm text-[#d4ebea] leading-relaxed italic">{t("Bâtisseur originel de la Mosquée de la Divinité en 1992, rappelé à Dieu. Ce grand chantier perpétue sa vision sacrée sous la responsabilité exclusive du Khalife Mouhamed Naby Gueye, du Président des Travaux Ababacar Sadikh Ndoye et du Responsable Communication Cheikh Ahmet Tidiane Gueye.")}</p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          IV. COMMENT PARTICIPER (Canaux Officiels en Style Light)
          ========================================================================= */}
      <section id="comment-participer-light" className="w-full bg-white py-24 px-6 md:px-14 lg:px-20 border-b border-[#d6e3e5]">
        <div className="max-w-[1240px] mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-[#C11616] text-xs tracking-[0.25em] uppercase font-bold">
              <CheckCircle2 size={16} />
              <span>{t("Modalités Officielles de Contribution")}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl text-[#0c282b] font-light tracking-tight leading-tight">{t("Comment Participer ?")}</h2>
            <p className="text-lg md:text-xl text-[#39575a] leading-relaxed">
              Pour que chaque fidèle et bienfaiteur puisse apporter sa pierre à l'édifice selon ses moyens,{' '}
              {(contenu?.moyensPaiement || []).length > 1
                ? `${enLettres((contenu?.moyensPaiement || []).length).toLowerCase()} voies sécurisées et directes sont ouvertes.`
                : 'une voie sécurisée et directe est ouverte.'}
            </p>
          </div>

          {/* Colonnes calées sur le nombre de cartes : une grille en 4
              colonnes avec deux moyens laisserait la moitié du bloc vide. */}
          <div
            className={`grid grid-cols-1 gap-6 text-left ${
              (contenu?.moyensPaiement || []).length >= 4
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : (contenu?.moyensPaiement || []).length === 3
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'sm:grid-cols-2'
            }`}
          >

            {/* Moyens de contribution : saisis dans le dashboard, numéros
                compris. Une carte sans numéro n'affiche pas de bloc vide. */}
            {(contenu?.moyensPaiement || []).map((moyen) => {
              const accent = moyen.couleur || '#0e4b50';
              const estNature = moyen.typeAction === 'nature';
              const logo = urlMedia(moyen.logo);

              return (
                <div
                  key={moyen.id}
                  className="bg-[#fafbfc] border rounded-3xl p-6 sm:p-7 space-y-4 flex flex-col justify-between hover:shadow-lg transition-all"
                  style={{ borderColor: `${accent}33` }}
                >
                  <div className="space-y-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm"
                      style={{ backgroundColor: logo ? '#ffffff' : accent }}
                    >
                      {logo ? (
                        <img src={logo} alt={moyen.nom} className="w-full h-full object-contain p-1.5" />
                      ) : estNature ? (
                        <PackageCheck size={22} className="text-white" />
                      ) : (
                        <Building size={22} className="text-white" />
                      )}
                    </div>

                    {moyen.categorie && (
                      <span className="text-[10px] uppercase tracking-widest font-bold block" style={{ color: accent }}>
                        {moyen.categorie}
                      </span>
                    )}

                    <h3 className="text-2xl text-[#0c282b] font-medium">{moyen.nom}</h3>

                    {moyen.description && (
                      <p className="text-sm text-[#446265]">{moyen.description}</p>
                    )}

                    {moyen.numero && (
                      <div className="bg-white p-3 rounded-xl border border-[#d6e3e5] font-mono text-sm text-[#0c282b] flex justify-between items-center shadow-sm">
                        <span className="font-bold">{moyen.numero}</span>
                        <button
                          onClick={() => copyToClipboard(moyen.numero)}
                          className="text-[#0e4b50] hover:text-[#C11616] transition-colors p-1"
                          title={t("Copier le numéro")}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={estNature ? () => setNatureModalOpen(true) : handleGoToFullDonation}
                    className="w-full text-white text-[10px] uppercase tracking-wider font-bold py-3 rounded-xl transition-opacity hover:opacity-90 text-center cursor-pointer shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {moyen.libelleBouton || 'Contribuer'}
                  </button>
                </div>
              );
            })}

          </div>

          {/* Lien officiel www.mosqueedeladivinite.org */}
          <div className="bg-[#f0f5f6] border border-[#b8d4d7] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
            <div className="space-y-1">
              <span className="text-xs text-[#0e4b50] uppercase font-bold tracking-wider block">
                Site Web Officiel &amp; Suivi en Ligne
              </span>
              <p className="text-base text-[#3d595c]">{t("Pour consulter en toute transparence l'état d'avancement des devis et travaux :")}</p>
            </div>
            <a
              href="https://www.mosqueedeladivinite.org"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-[#0e4b50] border-2 border-[#0e4b50] text-xs tracking-wider uppercase font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <span>www.mosqueedeladivinite.org</span>
              <ExternalLink size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          V. APPEL SOLENNEL FINAL : "SOUTENEZ LA MAISON DE DIEU"
          ========================================================================= */}
      <section className="relative py-24 px-6 md:px-14 lg:px-20 text-center bg-gradient-to-t from-white via-[#f0f5f6] to-[#f8fafb] overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#b8d4d7] shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C11616] animate-pulse" />
            <span className="text-xs tracking-[0.25em] text-[#0e4b50] uppercase font-bold">{t("FI SABILILAH · Appel Solennel")}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light text-[#0c282b] leading-tight">{t("Soutenez la")}<span className="text-[#C11616] italic font-normal">{t("Maison de Dieu")}</span>
          </h2>

          <p className="text-xl sm:text-2xl text-[#39575a] max-w-2xl mx-auto leading-relaxed">{t("« Quiconque construit ou répare une mosquée pour Allah, Allah lui construira une demeure au Paradis. » Unissons nos forces pour que ce sanctuaire rayonne face à l’Océan pour les siècles à venir.")}</p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={handleGoToFullDonation}
              className="bg-[#C11616] hover:bg-[#a61313] text-white text-sm sm:text-base tracking-[0.2em] uppercase font-bold py-5 px-10 rounded-2xl transition-all shadow-xl hover:shadow-2xl cursor-pointer"
            >{t("JE FAIS UN DON IMMÉDIAT")}</button>

            <button
              onClick={() => setNatureModalOpen(true)}
              className="bg-white hover:bg-[#f0f5f6] border-2 border-[#0e4b50] text-[#0e4b50] text-xs sm:text-sm tracking-[0.2em] uppercase font-bold py-5 px-8 rounded-2xl transition-all cursor-pointer shadow-md"
            >{t("Proposer un don matériel")}</button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MODALE 1 : DON FINANCIER (Style Light & Sécurisé)
          ========================================================================= */}
      <AnimatePresence>
        {donateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#d6e3e5] rounded-3xl max-w-lg w-full p-7 sm:p-9 text-left space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
                <div>
                  <span className="text-[10px] text-[#C11616] uppercase tracking-widest font-bold block">{t("Mosquée de la Divinité · Les Grands Travaux")}</span>
                  <h3 className="text-2xl sm:text-3xl text-[#0c282b] font-medium">
                    Faire un Don (Fi Sabililah)
                  </h3>
                </div>
                <button
                  onClick={() => setDonateModalOpen(false)}
                  className="text-neutral-400 hover:text-black p-2 rounded-xl cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {donationSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-3xl text-[#0c282b] font-bold">{t("Votre don a été pris en compte")}</h4>
                  <p className="text-base text-[#3d595c]">{t("Qu'Allah vous comble de Ses grâces et bénisse votre geste pour la Maison de Dieu.")}</p>
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Affectation de votre don")}</label>
                    <select
                      value={targetedProject}
                      onChange={(e) => setTargetedProject(e.target.value)}
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none focus:border-[#0e4b50] font-medium"
                    >
                      <option value="global">Fonds Global des Grands Travaux (200.000.000 FCFA)</option>
                      <option value="projet_a">PROJET A : Rénovations structurelles (123.000.000 FCFA)</option>
                      <option value="projet_b">PROJET B : Toilettes modernes (52.000.000 FCFA)</option>
                      <option value="projet_c">PROJET C : Électricité & Solaire (10.000.000 FCFA)</option>
                      <option value="projet_d">PROJET D : Sonorisation & Sauvegarde (15.000.000 FCFA)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Montant du Don")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10000, 25000, 50000, 100000, 250000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2.5 px-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer font-mono ${
                            donationAmount === amt
                              ? 'bg-[#0e4b50] border-[#0e4b50] text-white shadow-sm'
                              : 'bg-[#f8fafb] border-[#d6e3e5] text-[#3d595c] hover:border-[#0e4b50]'
                          }`}
                        >
                          {amt.toLocaleString('fr-FR')} F
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setDonationAmount('custom')}
                        className={`py-2.5 px-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          donationAmount === 'custom'
                            ? 'bg-[#0e4b50] border-[#0e4b50] text-white shadow-sm'
                            : 'bg-[#f8fafb] border-[#d6e3e5] text-[#3d595c] hover:border-[#0e4b50]'
                        }`}
                      >{t("Autre")}</button>
                    </div>

                    {donationAmount === 'custom' && (
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder={t("Montant libre en FCFA")}
                        className="w-full bg-[#f8fafb] border border-[#0e4b50] rounded-xl p-3 text-[#0c282b] text-sm focus:outline-none font-mono mt-2"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Nom & Prénom (facultatif)"
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder={t("Téléphone mobile")}
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Opérateur de Paiement")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wave')}
                        className={`p-3 rounded-xl border text-center text-[11px] uppercase cursor-pointer font-bold ${
                          paymentMethod === 'wave'
                            ? 'bg-[#0094a8] border-[#0094a8] text-white shadow-sm'
                            : 'bg-[#f8fafb] border-[#d6e3e5] text-[#3d595c]'
                        }`}
                      >
                        🌊 Wave
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('om')}
                        className={`p-3 rounded-xl border text-center text-[11px] uppercase cursor-pointer font-bold ${
                          paymentMethod === 'om'
                            ? 'bg-[#f97316] border-[#f97316] text-white shadow-sm'
                            : 'bg-[#f8fafb] border-[#d6e3e5] text-[#3d595c]'
                        }`}
                      >
                        🟠 OM (*144#)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pamecas')}
                        className={`p-3 rounded-xl border text-center text-[11px] uppercase cursor-pointer font-bold ${
                          paymentMethod === 'pamecas'
                            ? 'bg-[#0e4b50] border-[#0e4b50] text-white shadow-sm'
                            : 'bg-[#f8fafb] border-[#d6e3e5] text-[#3d595c]'
                        }`}
                      >
                        🏛️ PAMECAS
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#C11616] hover:bg-[#a61313] text-white text-xs tracking-widest uppercase font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Heart size={16} fill="currentColor" />
                      <span>{t("Confirmer mon Don")}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODALE 2 : CONTRIBUTION EN NATURE (Style Light)
          ========================================================================= */}
      <AnimatePresence>
        {natureModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#d6e3e5] rounded-3xl max-w-lg w-full p-7 sm:p-9 text-left space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-4">
                <div>
                  <span className="text-[10px] text-[#C11616] uppercase tracking-widest font-bold block">{t("Commission Logistique des Travaux")}</span>
                  <h3 className="text-2xl sm:text-3xl text-[#0c282b] font-medium">{t("Proposer un Don en Nature")}</h3>
                </div>
                <button
                  onClick={() => setNatureModalOpen(false)}
                  className="text-neutral-400 hover:text-black p-2 rounded-xl cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {natureSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-3xl text-[#0c282b] font-bold">{t("Proposition Enregistrée")}</h4>
                  <p className="text-base text-[#3d595c]">{t("La commission des travaux vous contactera sous peu pour organiser la logistique sur le site de la mosquée.")}</p>
                </div>
              ) : (
                <form onSubmit={handleNatureSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Type de Matériau ou Service")}</label>
                    <select
                      value={natureItemType}
                      onChange={(e) => setNatureItemType(e.target.value)}
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none"
                    >
                      <option value="ciment_fer">Ciment marin & Fer à béton (Projet A)</option>
                      <option value="sanitaires">Sanitaires, carrelage & plomberie (Projet B)</option>
                      <option value="solaire_elec">Panneaux solaires & câblage électrique (Projet C)</option>
                      <option value="sonorisation">Équipements audio, micros & enceintes (Projet D)</option>
                      <option value="expertise">{t("Expertise en ingénierie ou main-d'œuvre qualifiée")}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Description du don et quantités")}</label>
                    <textarea
                      rows={3}
                      value={natureDescription}
                      onChange={(e) => setNatureDescription(e.target.value)}
                      placeholder={t("Ex: 50 sacs de ciment marin, 20 barres de fer 12mm, ou fourniture de 4 panneaux solaires...")}
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#0c282b] uppercase tracking-wider font-bold block">{t("Vos coordonnées complètes")}</label>
                    <input
                      type="text"
                      value={natureContact}
                      onChange={(e) => setNatureContact(e.target.value)}
                      placeholder={t("Nom complet, téléphone et ville")}
                      className="w-full bg-[#f8fafb] border border-[#c2d7da] rounded-xl p-3 text-sm text-[#0c282b] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0e4b50] hover:bg-[#082a2d] text-white text-xs tracking-widest uppercase font-bold py-4 rounded-xl transition-all cursor-pointer shadow-md mt-2"
                  >{t("Transmettre ma Proposition de Don")}</button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}