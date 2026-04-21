import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="border-t border-white/10 bg-jewel-base text-jewel-ink"
      data-testid="site-footer"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <img
            src="/logo.png"
            alt="Wiener Lehrlingsball 2027"
            className="h-20 w-auto mb-6"
          />
          <p className="overline mb-4">Wiener</p>
          <h3 className="font-serif text-3xl md:text-4xl text-white">
            Lehrlingsball <span className="text-jewel-gold">2027</span>
          </h3>
          <p className="mt-6 text-sm text-jewel-muted max-w-md leading-relaxed">
            Der erste Ball Wiens, der die Lehre ins Rampenlicht stellt. Eine Bühne
            für junge Talente, geprägt von Tradition und modernem Anspruch.
          </p>
        </div>

        <div>
          <p className="overline mb-5">Navigation</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/home" className="text-white/70 hover:text-jewel-gold transition-colors">Startseite</Link></li>
            <li><Link to="/infos" className="text-white/70 hover:text-jewel-gold transition-colors">Infos</Link></li>
            <li><Link to="/tickets" className="text-white/70 hover:text-jewel-gold transition-colors">Tickets</Link></li>
            <li><Link to="/kontakt" className="text-white/70 hover:text-jewel-gold transition-colors">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <p className="overline mb-5">Kontakt</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-white/70">
              <Mail size={14} className="text-jewel-gold" />
              <a
                href="mailto:Kontakt@wienerlehrlingsball.at"
                className="hover:text-jewel-gold transition-colors"
                data-testid="footer-email"
              >
                Kontakt@wienerlehrlingsball.at
              </a>
            </li>
            <li className="flex items-center gap-3 text-white/70">
              <Instagram size={14} className="text-jewel-gold" />
              <a
                href="https://www.instagram.com/wienerlehrlingsball.at"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-jewel-gold transition-colors"
                data-testid="footer-instagram"
              >
                @wienerlehrlingsball.at
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/40">
          <p>© 2027 Wiener Lehrlingsball</p>
          <div className="flex items-center gap-6">
            <Link
              to="/impressum"
              className="hover:text-jewel-gold transition-colors"
              data-testid="footer-impressum"
            >
              Impressum
            </Link>
            <p>Wien · Österreich</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
