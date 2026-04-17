import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

const HERO_URL =
  "https://static.prod-images.emergentagent.com/jobs/76086d28-fd1d-4395-8afc-d23c04585e99/images/d347a654fc727643ec48a29bdf6bc75532484fea400a4b0d6da7c2f421b0882d.png";

const INFO_URL =
  "https://static.prod-images.emergentagent.com/jobs/76086d28-fd1d-4395-8afc-d23c04585e99/images/20e128dfdd3df9dce30523c5a56df9cca72b6e4841892ebf4313bd224b8f8b74.png";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
};

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const Home = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      toast.error("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    try {
      await subscribeNewsletter(value, "home");
      toast.success("Wir informieren dich, sobald es Neuigkeiten gibt.");
      setEmail("");
    } catch (err) {
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden" data-testid="home-hero">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_URL})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-jewel-base/70 via-jewel-base/55 to-jewel-base" />
        <div className="noise" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-32 w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="overline"
          >
            Wien · 2027 · Premiere
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="mt-8 font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.02] text-white max-w-4xl"
          >
            Wiener <span className="italic gold-text">Lehrlingsball</span>
            <br />
            <span className="text-white/95">2027</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 text-lg md:text-xl text-jewel-silver max-w-2xl font-light"
          >
            Der erste Ball Wiens, der die Lehre ins Rampenlicht stellt.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-6 text-sm md:text-base text-white/60 max-w-xl leading-relaxed"
          >
            Eine klassische Ballnacht, neu gedacht. Wo Handwerk, Ausbildung und
            Eleganz einander begegnen – auf einer Bühne, die den jungen Talenten
            dieser Stadt gehört.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <Link to="/infos" className="btn-gold" data-testid="hero-cta-infos">
              Mehr erfahren
              <ArrowRight size={14} />
            </Link>
            <Link to="/tickets" className="btn-ghost" data-testid="hero-cta-tickets">
              Tickets
            </Link>
          </motion.div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Scrollen</span>
          <span className="w-px h-8 bg-white/30" />
        </div>
      </section>

      {/* INTRO / STATS */}
      <section className="relative py-24 md:py-32 border-b border-white/5" data-testid="home-intro">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <motion.div {...fade} className="lg:col-span-5">
            <p className="overline">Ein Abend. Eine Vision.</p>
            <h2 className="mt-6 font-serif text-3xl md:text-5xl leading-tight text-white">
              Wenn <span className="italic gold-text">Handwerk</span>
              <br />
              auf Eleganz trifft.
            </h2>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-7 space-y-8 text-jewel-silver">
            <p className="text-base md:text-lg leading-relaxed">
              Wien wird zum Symbol für das, was Lehre heute bedeutet: Können,
              Charakter und Haltung. Der Wiener Lehrlingsball 2027 vereint die
              Tradition der großen Wiener Bälle mit einer neuen, jungen Sprache –
              ohne Kitsch, ohne Kompromisse.
            </p>

            <div className="gold-divider" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-4">
              {[
                { k: "1.", label: "Der erste Ball seiner Art in Wien" },
                { k: "∞", label: "Lehrberufe, eine gemeinsame Bühne" },
                { k: "2027", label: "Premiere im Herzen der Stadt" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-5xl text-jewel-gold">{s.k}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEASER IMAGE + PARAGRAPH */}
      <section className="relative py-24 md:py-32" data-testid="home-teaser">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div {...fade} className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={INFO_URL}
                alt="Elegantes Paar beim Walzer"
                className="w-full h-full object-cover grayscale-[10%]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-jewel-base/50 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-jewel-base border border-jewel-gold/40 px-8 py-6 hidden md:block">
              <p className="overline">Walzer · Tradition</p>
              <p className="mt-2 font-serif text-2xl text-white">Neu interpretiert</p>
            </div>
          </motion.div>

          <motion.div {...fade} className="lg:col-span-6">
            <p className="overline">Die Bühne der Lehrlinge</p>
            <h2 className="mt-6 font-serif text-3xl md:text-5xl leading-tight text-white">
              Ein Ball für jene, die Wien <span className="italic gold-text">tragen</span>.
            </h2>
            <p className="mt-8 text-base md:text-lg text-jewel-silver leading-relaxed">
              Von Konditoren über Mechatronikerinnen, Gastronominnen, Bautechnikern
              bis zu Friseurinnen: Der Wiener Lehrlingsball macht sichtbar, was
              sonst oft im Hintergrund bleibt. Eine Nacht voller Musik, Walzer und
              Begegnungen – in einem der großen Wiener Säle.
            </p>
            <div className="mt-10">
              <Link to="/infos" className="btn-gold" data-testid="teaser-cta">
                Zur Vision
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="relative py-24 md:py-32 border-t border-white/5" data-testid="home-newsletter">
        <div className="absolute inset-0 radial-gold opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Sparkles size={18} className="mx-auto text-jewel-gold" />
          <h2 className="mt-6 font-serif text-3xl md:text-5xl text-white">
            Sei als <span className="italic gold-text">Erste*r</span> dabei.
          </h2>
          <p className="mt-6 text-base md:text-lg text-jewel-silver">
            Lass uns deine E-Mail da – wir melden uns, sobald Tickets, Programm
            und Termin bekannt sind.
          </p>

          <form
            onSubmit={onSubscribe}
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-0 max-w-xl mx-auto"
            data-testid="home-newsletter-form"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.at"
              data-testid="home-newsletter-email"
              className="flex-1 bg-transparent border border-white/15 sm:border-r-0 px-5 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-jewel-gold/60 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              data-testid="home-newsletter-submit"
              className="bg-jewel-gold text-jewel-base hover:bg-white transition-colors duration-500 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-medium disabled:opacity-60"
            >
              {loading ? "Senden…" : "Informiert mich"}
            </button>
          </form>
          <p className="mt-5 text-[11px] text-white/40 tracking-wide">
            Keine Werbung. Nur relevante Updates zum Ball 2027.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
