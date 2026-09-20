import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../../assets/photo/Logo.png'
import { useLanguage } from '../../context/LanguageContext'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'

const GLOBAL_LINKS = [
  ['Histoire', '/#histoire'],
  ['Visiter', '/#visiter'],
  ['Prier', '/#prier'],
  ['Le Message', '/#message'],
  ['Communauté', '/#communaute'],
  ['Boutique', '/boutique'],
]

// Navigation des pages secondaires (boutique, rénovation, patrimoine)
const SUBPAGE_LINKS = [
  ['Accueil', '/'],
  ['Rénovation', '/renovation'],
  ['Boutique', '/boutique'],
  ['Patrimoine', '/patrimoine'],
]

// Pages qui partagent cette navbar « secondaire »
const SUBPAGES = ['/boutique', '/renovation', '/patrimoine', '/dons']

export default function Navbar() {
  const { lang, setLang } = useLanguage()
  const t = useT()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPath, setLastPath] = useState(location.pathname)
  const [visible, setVisible] = useState(true)
  const headerRef = useRef(null)
  const prevScroll = useRef(0)

  // Hauteur réelle de l'en-tête exposée en CSS : --header-h.
  // Elle pilote le décalage du contenu, les ancres et le menu mobile.
  const mesurer = useCallback(() => {
    const h = headerRef.current?.offsetHeight
    if (h) document.documentElement.style.setProperty('--header-h', `${h}px`)
  }, [])

  useEffect(() => {
    mesurer()
    const ro = new ResizeObserver(mesurer)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', mesurer)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', mesurer)
    }
  }, [mesurer])

  // Menu mobile ouvert : on bloque le défilement de la page derrière
  useEffect(() => {
    if (!menuOpen) return
    const precedent = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedent
    }
  }, [menuOpen])

  // Masquage de l'en-tête au défilement vers le bas (gain d'écran sur mobile)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      if (menuOpen) return
      if (y < 0) return
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (y > maxScroll) return

      setVisible(prevScroll.current > y || y < 90)
      prevScroll.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  const isSubPage = SUBPAGES.includes(location.pathname)
  const links = isSubPage ? SUBPAGE_LINKS : GLOBAL_LINKS
  const donHref = '/dons'
  const closeMenu = () => setMenuOpen(false)

  // Ferme le menu mobile quand on change de page (navigation, retour navigateur…)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  const marque = (
    <>
      <img src={logo} alt="Mosquée de la Divinité" className="nav-logo-img" />
      <span className="nav-logo-txt">
        <span className="nav-logo-main">Mosquée de la Divinité</span>
        <span className="nav-logo-sub">Masdjidou Rabbani</span>
      </span>
    </>
  )

  const Logo = isSubPage ? (
    <Link to="/" className="nav-logo" onClick={closeMenu}>{marque}</Link>
  ) : (
    <a href="#hero" className="nav-logo" onClick={closeMenu}>{marque}</a>
  )

  return (
    <header className={cx('site-header', !visible && 'is-hidden')} ref={headerRef}>
      <nav aria-label={t('Navigation principale')}>
        {Logo}

        <ul className={cx('nav-links-ref', menuOpen && 'open')}>
          {links.map(([label, href]) => {
            const isAnchor = href.startsWith('/#') || href.startsWith('#')
            const courant = !isAnchor && location.pathname === href
            return (
              <li key={href}>
                {isAnchor ? (
                  <a href={href} onClick={closeMenu}>{t(label)}</a>
                ) : (
                  <Link to={href} onClick={closeMenu} aria-current={courant ? 'page' : undefined}>
                    {t(label)}
                  </Link>
                )}
              </li>
            )
          })}
          {/* Choix de langue repris dans le menu déroulant mobile : le
              sélecteur de droite est masqué à cette largeur. */}
          <li className="nav-lang-mobile">
            <span className="nav-lang-label">{t('Langue')}</span>
            <div className="lang-switcher">
              {['FR', 'EN'].map((code) => (
                <button
                  key={code}
                  type="button"
                  className={cx('lang-btn', lang === code && 'active')}
                  onClick={() => setLang(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </li>
          {/* Bouton « don » repris dans le menu déroulant mobile */}
          <li className="nav-don-mobile">
            <Link to={donHref} className="nav-don" onClick={closeMenu}>
              {t('Faire un don')}
            </Link>
          </li>
        </ul>

        <div className="nav-right">
          <div className="lang-switcher">
            {['FR', 'EN'].map((code) => (
              <button
                key={code}
                type="button"
                className={cx('lang-btn', lang === code && 'active')}
                onClick={() => setLang(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <Link to={donHref} className="nav-don nav-don-desktop">
            {t('Faire un don')}
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? t('Fermer le menu') : t('Ouvrir le menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  )
}
