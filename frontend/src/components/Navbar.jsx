import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useGate } from "@/context/GateContext";

const links = [
  { to: "/infos", label: "Infos" },
  { to: "/tickets", label: "Tickets" },
  { to: "/kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const { lock } = useGate();
  const navigate = useNavigate();

  const handleLogout = () => {
    lock();
    navigate("/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-jewel-base/70 border-b border-white/10"
      data-testid="site-navbar"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 h-20 flex items-center justify-between gap-4">
        <Link
          to="/home"
          className="group flex flex-col leading-none shrink-0"
          data-testid="nav-logo"
        >
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-jewel-silver">
            Wiener
          </span>
          <span className="font-serif text-lg sm:text-xl md:text-2xl text-white group-hover:text-jewel-gold transition-colors duration-500">
            Lehrlingsball <span className="text-jewel-gold">2027</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8 md:gap-12">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.to.replace("/", "")}`}
              className={({ isActive }) =>
                `text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.28em] transition-colors duration-500 ${
                  isActive ? "text-jewel-gold" : "text-white/70 hover:text-jewel-gold"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            data-testid="nav-logout"
            title="Abmelden und zur Startseite"
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.28em] text-white/40 hover:text-jewel-gold transition-colors duration-500"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
