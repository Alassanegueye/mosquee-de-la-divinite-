import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './assets/css/App.css'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/layout/BackToTop'
import AppRoutes from './routes/AppRoutes'

// Coquille de l'application : contexte global + mise en page (nav / contenu / footer).
function App() {
  const { pathname, hash } = useLocation()

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

  // À chaque changement de page (boutique, rénovation, patrimoine…), remonter
  // en haut — sauf si un lien vise une ancre #section.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <BackToTop />
    </LanguageProvider>
  )
}

export default App
