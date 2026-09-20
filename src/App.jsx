import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './assets/css/App.css'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/layout/BackToTop'
import RenovationPopup from './components/ui/RenovationPopup'
import { PanierProvider } from './context/PanierProvider'
import Panier from './components/boutique/Panier'
import BoutonPanier from './components/boutique/BoutonPanier'
import AppRoutes from './routes/AppRoutes'
import { useReveal } from './utils/useReveal'

// Coquille de l'application : contexte global + mise en page (nav / contenu / footer).
function App() {
  const { pathname, hash } = useLocation()
  const [isRenovationPopupOpen, setIsRenovationPopupOpen] = useState(true)

  // Rejoue l'apparition au défilement à chaque changement de page
  useReveal([pathname])

  // Au rechargement : revenir à l'URL de base (sans #ancre) et en haut de page
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // Retire le #section laissé dans l'URL par les liens d'ancrage
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo(0, 0)
  }, [])

  // À chaque changement de page : remonter en haut, ou rejoindre l'ancre visée
  // (ex. /#histoire depuis un bouton d'une page secondaire).
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // La cible n'existe qu'une fois la nouvelle page rendue
    const id = hash.slice(1)
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => clearTimeout(t)
  }, [pathname, hash])

  return (
    <LanguageProvider>
      <PanierProvider>
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
        <BackToTop />
        {isRenovationPopupOpen && (
          <RenovationPopup onClose={() => setIsRenovationPopupOpen(false)} />
        )}
        {/* Le panier est global : on peut ajouter un article depuis
            l'aperçu de l'accueil comme depuis la page Boutique. */}
        <BoutonPanier />
        <Panier />
      </PanierProvider>
    </LanguageProvider>
  )
}

export default App
