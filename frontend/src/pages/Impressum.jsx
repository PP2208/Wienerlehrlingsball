import React from "react";
import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
};

const Block = ({ title, children }) => (
  <motion.section {...fade} className="border-t border-white/10 pt-10">
    <h2 className="font-serif text-2xl md:text-3xl text-white">{title}</h2>
    <div className="mt-6 space-y-3 text-sm md:text-base text-jewel-silver leading-relaxed">
      {children}
    </div>
  </motion.section>
);

const PH = ({ children }) => (
  <span className="inline-block border border-dashed border-jewel-gold/40 text-jewel-gold/90 px-2 py-0.5 rounded-sm bg-jewel-gold/5 text-[13px]">
    {children}
  </span>
);

const Impressum = () => {
  return (
    <div data-testid="impressum-page" className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16">
        <motion.p {...fade} className="overline">Rechtliches</motion.p>
        <motion.h1
          {...fade}
          transition={{ ...fade.transition, delay: 0.1 }}
          className="mt-6 font-serif text-4xl md:text-6xl leading-tight text-white"
        >
          Impressum
        </motion.h1>
        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.2 }}
          className="gold-divider w-32 mt-10"
        />

        <motion.p
          {...fade}
          transition={{ ...fade.transition, delay: 0.3 }}
          className="mt-10 text-sm text-white/50 leading-relaxed"
        >
          Dies ist eine Vorlage. Alle mit <PH>Platzhalter</PH> markierten Angaben
          bitte ergänzen. Die Gliederung orientiert sich an § 5 ECG, § 14 UGB und
          § 25 MedienG (Österreich).
        </motion.p>

        <div className="mt-16 space-y-14">
          <Block title="Medieninhaber &amp; Herausgeber">
            <p>
              <span className="text-white">Name / Firmenbezeichnung:</span>{" "}
              <PH>z. B. Wiener Lehrlingsball GmbH / Verein „Wiener Lehrlingsball"</PH>
            </p>
            <p>
              <span className="text-white">Rechtsform:</span>{" "}
              <PH>GmbH · Verein · Einzelunternehmen …</PH>
            </p>
            <p>
              <span className="text-white">Anschrift:</span>{" "}
              <PH>Straße Nr., PLZ Wien, Österreich</PH>
            </p>
            <p>
              <span className="text-white">E-Mail:</span>{" "}
              <a
                href="mailto:Kontakt@wienerlehrlingsball.at"
                className="text-jewel-gold hover:underline"
              >
                Kontakt@wienerlehrlingsball.at
              </a>
            </p>
            <p>
              <span className="text-white">Telefon:</span>{" "}
              <PH>+43 …</PH>
            </p>
            <p>
              <span className="text-white">Website:</span>{" "}
              <PH>www.wienerlehrlingsball.at</PH>
            </p>
          </Block>

          <Block title="Vertretungsberechtigte">
            <p>
              <span className="text-white">Geschäftsführung / Vorstand:</span>{" "}
              <PH>Vor- und Nachname</PH>
            </p>
            <p>
              <span className="text-white">Kontakt für Presse:</span>{" "}
              <PH>Vor- und Nachname, E-Mail</PH>
            </p>
          </Block>

          <Block title="Unternehmensdaten">
            <p>
              <span className="text-white">Firmenbuchnummer:</span>{" "}
              <PH>FN …</PH>
            </p>
            <p>
              <span className="text-white">Firmenbuchgericht:</span>{" "}
              <PH>Handelsgericht Wien</PH>
            </p>
            <p>
              <span className="text-white">ZVR-Zahl (bei Vereinen):</span>{" "}
              <PH>…</PH>
            </p>
            <p>
              <span className="text-white">UID-Nummer:</span>{" "}
              <PH>ATU …</PH>
            </p>
            <p>
              <span className="text-white">Gewerbe / Unternehmensgegenstand:</span>{" "}
              <PH>z. B. Veranstaltung von Bällen und Events</PH>
            </p>
            <p>
              <span className="text-white">Aufsichtsbehörde / Gewerbebehörde:</span>{" "}
              <PH>Magistratisches Bezirksamt …</PH>
            </p>
            <p>
              <span className="text-white">Kammer­zugehörigkeit:</span>{" "}
              <PH>z. B. Wirtschaftskammer Wien</PH>
            </p>
            <p>
              <span className="text-white">Anwendbare Rechtsvorschriften:</span>{" "}
              Gewerbeordnung (GewO),{" "}
              <a
                href="https://www.ris.bka.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-jewel-gold hover:underline"
              >
                www.ris.bka.gv.at
              </a>
            </p>
          </Block>

          <Block title="Blattlinie / Grundlegende Richtung (§ 25 MedienG)">
            <p>
              <PH>
                Kurze Beschreibung der grundlegenden Richtung der Website – z. B.
                „Information über den Wiener Lehrlingsball, seine Zielsetzung,
                Programm und Tickets. Parteipolitisch unabhängig."
              </PH>
            </p>
          </Block>

          <Block title="Urheberrecht &amp; Bildnachweis">
            <p>
              Alle Inhalte dieser Website (Texte, Grafiken, Bilder, Layout) sind
              urheberrechtlich geschützt. Eine Verwendung ohne ausdrückliche
              Zustimmung des Medieninhabers ist nicht gestattet.
            </p>
            <p>
              <span className="text-white">Bildnachweis:</span>{" "}
              <PH>Quelle(n) und Urheber der verwendeten Bilder eintragen</PH>
            </p>
          </Block>

          <Block title="Haftungsausschluss">
            <p>
              Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für
              die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann
              jedoch keine Gewähr übernommen werden. Für Inhalte externer Links
              sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </Block>

          <Block title="Online-Streitbeilegung (OS-Plattform)">
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-jewel-gold hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse findest du oben in diesem Impressum.
            </p>
          </Block>

          <Block title="Datenschutz (Kurzhinweis)">
            <p>
              Personenbezogene Daten (z. B. E-Mail-Adressen aus dem Newsletter-
              oder Kontaktformular) werden ausschließlich zum Zweck der
              Kommunikation mit den Interessentinnen und Interessenten des
              Wiener Lehrlingsballs verarbeitet und nicht an Dritte
              weitergegeben.
            </p>
            <p>
              <span className="text-white">Verantwortliche Stelle:</span>{" "}
              <PH>Name &amp; Anschrift wie oben</PH>
            </p>
            <p>
              <span className="text-white">Kontakt Datenschutz:</span>{" "}
              <a
                href="mailto:Kontakt@wienerlehrlingsball.at"
                className="text-jewel-gold hover:underline"
              >
                Kontakt@wienerlehrlingsball.at
              </a>
            </p>
          </Block>
        </div>

        <motion.p
          {...fade}
          transition={{ ...fade.transition, delay: 0.3 }}
          className="mt-20 text-[11px] uppercase tracking-[0.32em] text-white/30"
        >
          Stand: <PH>Monat Jahr</PH>
        </motion.p>
      </div>
    </div>
  );
};

export default Impressum;
