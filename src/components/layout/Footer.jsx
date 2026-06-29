import logo from '../../assets/photo/Logo.png'
import { FaYoutube, FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaSnapchat } from 'react-icons/fa6'
import { FOOTER_NAV } from '../../data/content'

// Réseaux sociaux : icône monochrome + lien (à remplacer par les vraies URL).
const SOCIAL_LINKS = [
  { Icon: FaYoutube, label: 'YouTube', url: 'https://www.youtube.com/user/divinitetv' },
  { Icon: FaFacebookF, label: 'Facebook', url: 'https://www.facebook.com/mosqueedeladivinite' },
  { Icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/mosqueedeladivinite/' },
  { Icon: FaXTwitter, label: 'X (Twitter)', url: 'https://twitter.com/mosqueedivinite' },
  { Icon: FaTiktok, label: 'TikTok', url: 'http://www.tiktok.com/@mosqueedeladivinite' },
  { Icon: FaSnapchat, label: 'Snapchat', url: 'https://www.snapchat.com/@mosqueedivinite' },
]

export default function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <img src={logo} alt="Mosquée de la Divinité" style={{ height: 44 }} />
        <div>
          <span className="footer-brand-name">Mosquée de la Divinité</span>
          <span className="footer-brand-sub">
            Masdjidou Rabbani · Ouakam · Corniche-Ouest · Dakar · Sénégal
          </span>
        </div>

        <div className="footer-follow">
          <span className="footer-follow-label">Suivez-nous sur</span>
          <div className="footer-socials">
            {SOCIAL_LINKS.map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="footer-soc-ico"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <ul className="footer-nav">
          {FOOTER_NAV.map(([label, href]) => (
            <li key={href + label}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">
          mosqueedeladivinite.org · Site officiel · Mouvement Naby Allah
        </span>
        <span className="footer-copy">© 2026 Mouvement Naby Allah</span>
      </div>
    </footer>
  )
}
