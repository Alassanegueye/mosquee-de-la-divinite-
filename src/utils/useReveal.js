import { useEffect } from 'react'

/**
 * Apparition progressive des blocs marqués [data-reveal] au défilement.
 *
 * Un seul observateur pour toute la page ; relancé à chaque changement de route.
 *
 * Deux filets, chacun pour un piège rencontré :
 *
 * 1. MutationObserver — les blocs alimentés par l'API (catalogue de la
 *    boutique, aperçu de l'accueil) sont montés APRÈS la réponse réseau.
 *    Sans lui ils n'étaient jamais observés et restaient bloqués à
 *    `opacity: 0` : la grille du catalogue était dans le DOM, mais
 *    totalement invisible.
 *
 * 2. Balayage au défilement — l'IntersectionObserver échantillonne ; sur
 *    un saut brutal (touche Fin, molette rapide) il peut ne rien émettre
 *    pour les sections traversées, qui restent alors blanches.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const restants = () => document.querySelectorAll('[data-reveal]:not(.is-in)')

    if (reduce || !('IntersectionObserver' in window)) {
      restants().forEach((t) => t.classList.add('is-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    const observerNouveaux = () => {
      restants().forEach((t) => observer.observe(t))
    }
    observerNouveaux()

    // Filet 1 : contenu ajouté après coup (chargements asynchrones).
    const mutations = new MutationObserver(observerNouveaux)
    mutations.observe(document.body, { childList: true, subtree: true })

    // Filet 2 : rattrapage des blocs déjà franchis lors d'un saut de défilement.
    let planifie = false
    const rattraper = () => {
      if (planifie) return
      planifie = true
      requestAnimationFrame(() => {
        planifie = false
        const hauteur = window.innerHeight
        restants().forEach((el) => {
          const { top } = el.getBoundingClientRect()
          if (top < hauteur * 0.92) {
            el.classList.add('is-in')
            observer.unobserve(el)
          }
        })
      })
    }
    window.addEventListener('scroll', rattraper, { passive: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
      window.removeEventListener('scroll', rattraper)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
