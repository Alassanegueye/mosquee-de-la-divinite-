import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('../pages/Home'))
const RenovationPage = lazy(() => import('../pages/Renovation'))
const BoutiquePage = lazy(() => import('../pages/Boutique'))
const PatrimoinePage = lazy(() => import('../pages/Patrimoine'))
const NotFound = lazy(() => import('../pages/NotFound'))
const PaiementDon = lazy(() => import('../pages/PaiementDon'))

// Déclaration centralisée des routes de l'application.
export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="route-loading" aria-live="polite">Chargement...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/renovation" element={<RenovationPage />} />
        <Route path="/boutique" element={<BoutiquePage />} />
        <Route path="/patrimoine" element={<PatrimoinePage />} />
        <Route path="/dons" element={<PaiementDon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
