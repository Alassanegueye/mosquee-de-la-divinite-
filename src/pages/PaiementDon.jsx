// src/pages/PaiementDon.jsx
import { useState, useEffect } from 'react';
import '../assets/css/PaiementDon.css';
import { chargerRenovation, urlMedia } from '../service/api';
import QRCode from 'qrcode';
import { 
  Building2, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  PhoneCall
} from 'lucide-react';

export default function PaiementDon() {
  const [activeTab, setActiveTab] = useState('mobile'); // 'mobile' | 'virement'
  const [operator, setOperator] = useState('wave'); // 'wave' | 'om'

  // Logos des opérateurs : gérés au dashboard, comme ceux de la page
  // rénovation. Une seule source pour les deux écrans, sinon les visuels
  // finissent par diverger.
  const [logos, setLogos] = useState({ wave: null, om: null });

  useEffect(() => {
    let annule = false;
    chargerRenovation()
      .then((donnees) => {
        if (annule) return;
        const moyens = donnees?.moyensPaiement || [];
        const trouver = (motif) =>
          moyens.find((m) => new RegExp(motif, 'i').test(m.nom))?.logo || null;
        setLogos({ wave: urlMedia(trouver('wave')), om: urlMedia(trouver('orange')) });
      })
      .catch(() => {
        // Repli sur les pastilles lettrées : la page de don doit rester
        // utilisable même si les visuels sont injoignables.
      });
    return () => {
      annule = true;
    };
  }, []);
  const [selectedAmount, setSelectedAmount] = useState(15000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // VOS COORDONNÉES OFFICIELLES
  const WAVE_PHONE = "+221 77 820 19 92";
  const WAVE_PAYMENT_BASE = "https://pay.wave.com/m/M_mosquee_divinite_dakar";
  const OM_MERCHANT_CODE = "854 219";

  const BANK_INFO = {
    bankName: "Banque de l'Habitat du Sénégal (BHS)",
    agency: "Agence Almadies - Ouakam (Dakar)",
    accountHolder: "Comité de Sauvegarde de la Mosquée de la Divinité",
    codeBanque: "SN012",
    codeGuichet: "01234",
    numCompte: "012345678901",
    cleRib: "45",
    ribComplet: "SN012 01234 012345678901 45",
    iban: "SN54 SN01 2012 3401 2345 6789 0145",
    bicSwift: "BHSNSNDAXXX",
    referenceConseillee: "DON-RENOVATION-DIVINITE"
  };

  const currentAmount = selectedAmount === 'custom' 
    ? (Number(customAmount) > 0 ? Number(customAmount) : 10000)
    : selectedAmount;

  // Génération dynamique du QR Code
  useEffect(() => {
    const payload = operator === 'wave'
      ? `${WAVE_PAYMENT_BASE}?amount=${currentAmount}&memo=Don-Divinite`
      : `OM:merchant=${OM_MERCHANT_CODE};amount=${currentAmount};recipient=${WAVE_PHONE}`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1.5,
      color: {
        dark: operator === 'wave' ? '#003b46' : '#2b1404',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err));
  }, [operator, currentAmount]);

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleOpenWaveLink = () => {
    window.open(`${WAVE_PAYMENT_BASE}?amount=${currentAmount}`, '_blank');
  };

  const handleOpenOmLink = () => {
    const ussdString = `*144*391*${OM_MERCHANT_CODE.replace(/\s/g, '')}*${currentAmount}#`;
    window.location.href = `tel:${encodeURIComponent(ussdString)}`;
  };

  return (
    <div className="paiement-page">
      
      {/* En-tête */}
      <div className="payment-header">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C11616] animate-pulse" />
          <span className="font-cinzel text-xs text-[#f1c11c] tracking-[0.25em] uppercase font-bold">
            Soutien &amp; Sauvegarde Sacrée
          </span>
        </div>
        <h1 className="font-cormorant text-3xl sm:text-5xl text-white font-light tracking-tight">
          Paiements &amp; Dons Officiels
        </h1>
        <p className="font-cormorant text-base sm:text-lg text-[#c0c8c9] max-w-2xl italic">
          Chaque contribution par Mobile Money ou Virement Bancaire finance directement les travaux de sécurisation et de rénovation de la Mosquée de la Divinité.
        </p>
      </div>

      {/* Onglets Mobile Money / Virement */}
      <div className="max-w-[1100px] mx-auto">
        <div className="payment-tabs">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`payment-tab flex-1 py-3 px-4 rounded-lg font-cinzel text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'mobile'
                ? 'payment-tab-active bg-[#123e43] text-white border border-[#f1c11c]/40 shadow-lg'
                : 'text-[#c0c8c9] hover:text-white'
            }`}
          >
            <Smartphone size={16} className={activeTab === 'mobile' ? 'text-[#f1c11c]' : 'text-neutral-400'} />
            <span>Mobile Money</span>
          </button>

          <button
            onClick={() => setActiveTab('virement')}
            className={`payment-tab flex-1 py-3 px-4 rounded-lg font-cinzel text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'virement'
                ? 'payment-tab-active bg-[#123e43] text-white border border-[#f1c11c]/40 shadow-lg'
                : 'text-[#c0c8c9] hover:text-white'
            }`}
          >
            <Building2 size={16} className={activeTab === 'virement' ? 'text-[#f1c11c]' : 'text-neutral-400'} />
            <span>Virement Bancaire (RIB)</span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : MOBILE MONEY */}
        {activeTab === 'mobile' && (
          <div className="payment-mobile-layout">
            
            {/* Formulaire de don */}
            <div className="payment-form">
              
              {/* Opérateur */}
              <div>
                <label className="font-cinzel text-xs text-white uppercase tracking-wider font-semibold block mb-3">
                  1. Opérateur de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperator('wave')}
                    className={`payment-operator ${operator === 'wave' ? 'is-active' : ''} p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      operator === 'wave'
                        ? 'bg-[#002f35] border-[#1dc3d6] ring-1 ring-[#1dc3d6]'
                        : 'bg-[#121414] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`payment-brand payment-brand-wave${logos.wave ? ' payment-brand--image' : ''}`}
                      aria-hidden="true"
                    >
                      {logos.wave ? <img src={logos.wave} alt="" /> : 'W'}
                    </span>
                    <p className="payment-brand-name payment-brand-name-wave">Wave Sénégal</p>
                    <p className="payment-brand-description">Lien direct &amp; QR Code</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperator('om')}
                    className={`payment-operator ${operator === 'om' ? 'is-active' : ''} p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      operator === 'om'
                        ? 'bg-[#2a1708] border-[#f97316] ring-1 ring-[#f97316]'
                        : 'bg-[#121414] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`payment-brand payment-brand-orange${logos.om ? ' payment-brand--image' : ''}`}
                      aria-hidden="true"
                    >
                      {logos.om ? <img src={logos.om} alt="" /> : 'OM'}
                    </span>
                    <p className="payment-brand-name payment-brand-name-orange">Orange Money</p>
                    <p className="payment-brand-description payment-brand-description-orange">Code marchand &amp; USSD</p>
                  </button>
                </div>
              </div>

              {/* Montant */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-cinzel text-xs text-white uppercase tracking-wider font-semibold">
                    2. Montant du don
                  </label>
                  <span className="font-cormorant text-[#f1c11c] font-bold text-base">
                    {currentAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[2000, 5000, 10000, 15000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`payment-amount ${selectedAmount === amt ? 'is-active' : ''} py-2.5 px-2 rounded-lg font-cormorant text-base border transition-all cursor-pointer ${
                        selectedAmount === amt
                          ? 'bg-[#123e43] border-[#f1c11c] text-[#f1c11c] font-bold'
                          : 'bg-[#121414] border-white/5 text-[#c0c8c9] hover:border-white/20'
                      }`}
                    >
                      {amt.toLocaleString('fr-FR')} F
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAmount('custom')}
                    className={`payment-amount ${selectedAmount === 'custom' ? 'is-active' : ''} py-2.5 px-2 rounded-lg font-cormorant text-base border transition-all cursor-pointer ${
                      selectedAmount === 'custom'
                        ? 'bg-[#123e43] border-[#f1c11c] text-[#f1c11c] font-bold'
                        : 'bg-[#121414] border-white/5 text-[#c0c8c9] hover:border-white/20'
                    }`}
                  >
                    Autre montant
                  </button>
                </div>

                {selectedAmount === 'custom' && (
                  <div className="mt-3 relative">
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Entrez le montant en FCFA"
                      className="w-full bg-[#121414] border border-[#f1c11c]/50 rounded-lg p-3 text-white focus:outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-neutral-400">FCFA</span>
                  </div>
                )}
              </div>

              {/* Coordonnées donateur (optionnel) */}
              <div className="border-t border-white/5 pt-5 space-y-3">
                <label className="font-cinzel text-xs text-white uppercase tracking-wider font-semibold block">
                  3. Vos informations (facultatif - pour l'attestation de don)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Nom ou Famille"
                    className="w-full bg-[#121414] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="N° Mobile (+221 ...)"
                    className="w-full bg-[#121414] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

            </div>

            {/* QR Code & Action directe */}
            <div className="payment-side">
              <div className={`payment-card ${
                operator === 'wave'
                  ? 'bg-gradient-to-b from-[#0a2327] to-[#121414] border-[#1dc3d6]/40'
                  : 'bg-gradient-to-b from-[#241306] to-[#121414] border-[#f97316]/40'
              }`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-cinzel text-base font-bold flex items-center gap-2">
                    <span
                      className={`payment-brand payment-brand-small ${
                        operator === 'wave' ? 'payment-brand-wave' : 'payment-brand-orange'
                      }${logos[operator] ? ' payment-brand--image' : ''}`}
                      aria-hidden="true"
                    >
                      {logos[operator] ? <img src={logos[operator]} alt="" /> : operator === 'wave' ? 'W' : 'OM'}
                    </span>
                    <span className={operator === 'wave' ? 'payment-brand-name-wave' : 'payment-brand-name-orange'}>
                      {operator === 'wave' ? 'Wave Sénégal' : 'Orange Money'}
                    </span>
                  </h3>
                  <span className="font-cormorant text-2xl font-bold text-[#f1c11c]">
                    {currentAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                {/* QR Code */}
                <div className="bg-[#121414] p-5 rounded-xl border border-white/10 flex flex-col items-center justify-center">
                  <div className="p-2.5 bg-white rounded-lg shadow-inner">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="QR Code Paiement" className="w-48 h-48 object-contain" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 animate-pulse" />
                    )}
                  </div>
                  <p className="font-cinzel text-xs text-white tracking-wider mt-3 text-center">
                    Scannez avec l'application {operator === 'wave' ? 'Wave' : 'Orange Money'}
                  </p>
                </div>

                {/* Bouton d'action direct */}
                <div className="space-y-3">
                  {operator === 'wave' ? (
                    <button
                      type="button"
                      onClick={handleOpenWaveLink}
                      className="w-full bg-[#1dc3d6] hover:bg-[#19a7b7] text-[#002f35] font-cinzel text-xs tracking-widest uppercase font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <ExternalLink size={16} /> Ouvrir l'application Wave
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenOmLink}
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-cinzel text-xs tracking-widest uppercase font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Smartphone size={16} /> Valider par USSD (*144#)
                    </button>
                  )}

                  {/* Numéro et code marchand à copier */}
                  <div className="bg-[#121414] p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-neutral-400 block font-cinzel text-[10px]">
                        {operator === 'wave' ? 'Numéro Marchand Wave' : 'Code Marchand OM'}
                      </span>
                      <span className="font-mono text-white font-bold">
                        {operator === 'wave' ? WAVE_PHONE : OM_MERCHANT_CODE}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(operator === 'wave' ? WAVE_PHONE : OM_MERCHANT_CODE, 'code')}
                      className="text-[#f1c11c] hover:text-white font-cinzel text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'code' ? <><Check size={12} className="text-emerald-400" /> Copié</> : <><Copy size={12} /> Copier</>}
                    </button>
                  </div>
                </div>

                {/* Confirmation reçu */}
                <button
                  type="button"
                  onClick={() => setReceiptModalOpen(true)}
                  className="w-full bg-[#123e43] hover:bg-[#18535a] border border-[#f1c11c]/30 text-white font-cinzel text-xs tracking-wider uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={14} className="text-[#f1c11c]" />
                  J'ai effectué mon transfert · Mon attestation
                </button>
              </div>

              {/* Assistance WhatsApp */}
              <div className="bg-[#1a1c1c] border border-white/5 rounded-xl p-4 text-left flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-white font-semibold block">Besoin d'aide ou confirmation ?</span>
                  <span className="text-neutral-400">Trésorerie WhatsApp : +221 77 820 19 92</span>
                </div>
                <a
                  href={`https://wa.me/221778201992?text=${encodeURIComponent(`Bonjour, je souhaite des renseignements pour faire un don de ${currentAmount} FCFA pour la Mosquée de la Divinité.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white py-2 px-3 rounded-lg transition-colors font-cinzel text-[10px] tracking-wider uppercase flex items-center gap-1"
                >
                  <PhoneCall size={12} /> WhatsApp
                </a>
              </div>
            </div>

          </div>
        )}

        {/* CONTENU ONGLET 2 : VIREMENT BANCAIRE (RIB) */}
        {activeTab === 'virement' && (
          <div className="payment-bank-panel">
            
            <div className="border-b border-white/10 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <span className="font-cinzel text-xs text-[#9a7800] tracking-widest uppercase font-bold flex items-center gap-2">
                  <Building2 size={16} /> Relevé d'Identité Bancaire Officiel (RIB)
                </span>
                  <div className="payment-bank-brand" aria-label="Compte PAMECAS">
                    <span className="payment-pamecas-mark">pamecas</span>
                    <span className="payment-pamecas-tag">Partenaire bancaire</span>
                  </div>
                <h2 className="font-cormorant text-2xl sm:text-3xl text-white font-medium mt-1">
                  Coordonnées pour Virement Bancaire
                </h2>
              </div>

              <button
                onClick={() => {
                  const allRib = `BANQUE : ${BANK_INFO.bankName}
TITULAIRE : ${BANK_INFO.accountHolder}
RIB : ${BANK_INFO.ribComplet}
IBAN : ${BANK_INFO.iban}
BIC / SWIFT : ${BANK_INFO.bicSwift}
LIBELLÉ : ${BANK_INFO.referenceConseillee}`;
                  copyToClipboard(allRib, 'all');
                }}
                className="bg-[#C11616] hover:bg-[#a80f0f] text-white font-cinzel text-xs tracking-wider uppercase py-2.5 px-4 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {copiedKey === 'all' ? <><Check size={14} /> Tout est copié !</> : <><Copy size={14} /> Copier tout le RIB</>}
              </button>
            </div>

            {/* Grille des coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Titulaire */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 space-y-1">
                <span className="text-neutral-400 font-cinzel text-[10px] uppercase">Bénéficiaire / Titulaire</span>
                <p className="text-white font-bold font-cormorant text-lg">{BANK_INFO.accountHolder}</p>
                <p className="text-[#a4ced4] text-xs">Mosquée de la Divinité · Ouakam, Dakar</p>
              </div>

              {/* Banque */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 space-y-1">
                <span className="text-neutral-400 font-cinzel text-[10px] uppercase">Banque &amp; Agence</span>
                <p className="text-white font-semibold">{BANK_INFO.bankName}</p>
                <p className="text-neutral-400 text-xs">{BANK_INFO.agency}</p>
              </div>

              {/* RIB National UEMOA */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-cinzel text-[10px] uppercase">RIB National (Sénégal / UEMOA)</span>
                  <button
                    onClick={() => copyToClipboard(BANK_INFO.ribComplet, 'rib')}
                    className="text-[#f1c11c] font-cinzel text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'rib' ? 'Copié' : 'Copier'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-black/40 p-2 rounded text-xs"><span className="text-[9px] text-neutral-400 block">Banque</span>{BANK_INFO.codeBanque}</div>
                  <div className="bg-black/40 p-2 rounded text-xs"><span className="text-[9px] text-neutral-400 block">Guichet</span>{BANK_INFO.codeGuichet}</div>
                  <div className="bg-black/40 p-2 rounded text-xs"><span className="text-[9px] text-neutral-400 block">Compte</span>{BANK_INFO.numCompte}</div>
                  <div className="bg-black/40 p-2 rounded text-xs text-[#f1c11c] font-bold"><span className="text-[9px] text-neutral-400 block">Clé</span>{BANK_INFO.cleRib}</div>
                </div>
              </div>

              {/* IBAN International */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-cinzel text-[10px] uppercase">IBAN (International &amp; Diaspora)</span>
                  <button
                    onClick={() => copyToClipboard(BANK_INFO.iban.replace(/\s/g, ''), 'iban')}
                    className="text-[#f1c11c] font-cinzel text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'iban' ? 'Copié' : 'Copier'}
                  </button>
                </div>
                <p className="font-mono text-sm sm:text-base font-bold text-[#f1c11c] break-all bg-black/40 p-2.5 rounded">
                  {BANK_INFO.iban}
                </p>
              </div>

              {/* SWIFT / BIC */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-neutral-400 font-cinzel text-[10px] uppercase block">Code BIC / SWIFT</span>
                  <span className="font-mono text-base font-bold text-white tracking-widest">{BANK_INFO.bicSwift}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(BANK_INFO.bicSwift, 'bic')}
                  className="text-[#f1c11c] font-cinzel text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'bic' ? 'Copié' : 'Copier'}
                </button>
              </div>

              {/* Référence / Libellé */}
              <div className="bg-[#121414] p-5 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-neutral-400 font-cinzel text-[10px] uppercase block">Motif conseillé</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">{BANK_INFO.referenceConseillee}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(BANK_INFO.referenceConseillee, 'ref')}
                  className="text-[#f1c11c] font-cinzel text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'ref' ? 'Copié' : 'Copier'}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Modal Reçu de confirmation */}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1c1c] border border-white/20 rounded-2xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-cinzel text-sm font-bold text-[#f1c11c]">Attestation de Don Enregistrée</h3>
              <button onClick={() => setReceiptModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-neutral-300">
              Merci à <strong>{donorName || 'Fidèle Donateur'}</strong> pour votre contribution de{' '}
              <strong className="text-[#f1c11c]">{currentAmount.toLocaleString('fr-FR')} FCFA</strong>.
            </p>
            <p className="text-xs text-neutral-400">
              Qu'Allah bénisse votre geste pour la restauration et la pérennité de la Mosquée de la Divinité.
            </p>
            <button
              onClick={() => setReceiptModalOpen(false)}
              className="w-full bg-[#123e43] text-white py-2.5 rounded font-cinzel text-xs uppercase tracking-wider"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}