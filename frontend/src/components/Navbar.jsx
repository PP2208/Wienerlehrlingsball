import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useGate } from "@/context/GateContext";

const links = [
  { to: "/home", label: "Startseite" },
  { to: "/infos", label: "Infos" },
  { to: "/tickets", label: "Tickets" },
  { to: "/kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lock } = useGate();
  const navigate = useNavigate();

  const handleLock = () => {
    lock();
    navigate("/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-jewel-base/70 border-b border-white/10"
      data-testid="site-navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link
          to="/home"
          className="group flex flex-col leading-none"
          data-testid="nav-logo"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-jewel-silver">
            Wiener
          </span>
          <span className="font-serif text-xl md:text-2xl text-white group-hover:text-jewel-gold transition-colors duration-500">
            Lehrlingsball <span className="text-jewel-gold">2027</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.to.replace("/", "")}`}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.28em] transition-colors duration-500 ${
                  isActive ? "text-jewel-gold" : "text-white/70 hover:text-jewel-gold"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLock}
            data-testid="nav-lock-btn"
            className="text-[10px] uppercase tracking-[0.28em] text-white/40 hover:text-white/80 transition-colors"
            title="Zurück zur Coming-Soon-Seite"
          >
            Sperren
          </button>
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-jewel-base/95 backdrop-blur-xl">
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-${l.to.replace("/", "")}`}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-[0.28em] ${
                    isActive ? "text-jewel-gold" : "text-white/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                handleLock();
              }}
              className="text-left text-xs uppercase tracking-[0.28em] text-white/50"
            >
              Sperren
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
