import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const INFO_URL =
  "https://static.prod-images.emergentagent.com/jobs/76086d28-fd1d-4395-8afc-d23c04585e99/images/20e128dfdd3df9dce30523c5a56df9cca72b6e4841892ebf4313bd224b8f8b74.png";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
};

const pillars = [
  {
    n: "I.",
    title: "Konzept",
    body: "Ein klassischer Wiener Ball – neu interpretiert. Walzer, Eröffnung, Galaabend – kombiniert mit einer zeitgemäßen Bildsprache und Dramaturgie.",
  },
  {
    n: "II.",
    title: "Zielgruppe",
    body: "Lehrlinge, junge Talente und ihre Mentor*innen. Ein Abend, der Anerkennung sichtbar macht – und gleichzeitig Begegnung ermöglicht.",
  },
  {
    n: "III.",
    title: "Vision",
    body: "Lehre wird selbstverständlicher Teil der Wiener Ballkultur. Ein Fixpunkt, der Jahr für Jahr junge Menschen, Betriebe und Stadt zusammenbringt.",
  },
];

const Infos = () => {
  return (
    <div data-testid="infos-page">
      {/* INTRO */}
      <section className="relative pt-10 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <motion.p {...fade} className="overline">Infos · Vision · Konzept</motion.p>
          <motion.h1
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
            className="mt-6 font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-white max-w-4xl"
          >
            Ein Ball für
            <br />
            <span className="italic gold-text">die nächste Generation</span>.
          </motion.h1>
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.25 }} className="gold-divider w-32 mt-12" />
          <motion.p
            {...fade}
            transition={{ ...fade.transition, delay: 0.35 }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-jewel-silver leading-relaxed"
          >
            Wien hat die Bälle erfunden. Mit dem Wiener Lehrlingsball 2027 bekommt
            diese Tradition ein neues Kapitel – geschrieben von jenen, die das
            Handwerk der Stadt heute lernen und morgen prägen.
          </motion.p>
        </div>
      </section>

      {/* IMAGE BAND */}
      <section className="relative">
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
          <img src={INFO_URL} alt="Walzer Silhouette" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-jewel-base/40 via-jewel-base/20 to-jewel-base" />
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-24 md:py-32" data-testid="infos-pillars">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 * i }}
              className="border-t border-white/10 pt-8"
            >
              <p className="font-serif text-5xl text-jewel-gold">{p.n}</p>
              <h3 className="mt-6 font-serif text-2xl md:text-3xl text-white">{p.title}</h3>
              <p className="mt-5 text-sm md:text-base text-jewel-silver leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.p {...fade} className="overline">Unser Versprechen</motion.p>
          <motion.h2
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
            className="mt-6 font-serif text-3xl md:text-5xl text-white leading-tight"
          >
            Kein Schein. Kein Kitsch.
            <br />
            <span className="italic gold-text">Nur Haltung.</span>
          </motion.h2>
          <motion.p
            {...fade}
            transition={{ ...fade.transition, delay: 0.2 }}
            className="mt-10 text-base md:text-lg text-jewel-silver leading-relaxed"
          >
            Der Wiener Lehrlingsball ist Ausdruck einer Stadt, die ihre Jugend
            feiert – mit Musik, Walzer, Stil und Respekt. Ein Abend, an dem die
            Lehre das trägt, was sie verdient: das beste Licht.
          </motion.p>
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/kontakt" className="btn-gold" data-testid="infos-cta-contact">
              Mitwirken
              <ArrowRight size={14} />
            </Link>
            <Link to="/tickets" className="btn-ghost" data-testid="infos-cta-tickets">
              Tickets
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Infos;
