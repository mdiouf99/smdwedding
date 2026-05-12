'use client';

import { motion } from 'framer-motion';
import { WEDDING } from '@/lib/wedding';

export default function Venue() {
  return (
    <section id="venue" className="venue-dark py-24 px-6 md:py-32">
      <svg className="venue-floral-bg l" aria-hidden="true">
        <use href="#floral-spray" />
      </svg>
      <svg className="venue-floral-bg r" aria-hidden="true">
        <use href="#floral-spray" />
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
          className="text-center mb-14"
        >
          <p className="section-eyebrow-dark">La cérémonie</p>
          <h2
            className="section-title-dark mt-6"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            Le lieu
          </h2>
          <p className="section-sub-dark mt-3 text-lg">où tout commencera</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, delay: 0.15 }}
            className="venue-card p-10 md:p-14 text-center max-w-md mx-auto md:max-w-none w-full"
          >
            <svg className="venue-card-floral" aria-hidden="true">
              <use href="#floral-spray" />
            </svg>
            <div
              className="font-display text-ink"
              style={{ fontSize: '32px', letterSpacing: '0.04em' }}
            >
              {WEDDING.venue}
            </div>
            <p className="serif-italic text-ink-soft leading-relaxed mt-2 text-base md:text-lg">
              {WEDDING.venueAddressLines[1]}
              <br />
              {WEDDING.venueAddressLines[2]}
            </p>

            <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-gold-line">
              <div>
                <div
                  className="font-display text-gold uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.4em' }}
                >
                  Cérémonie
                </div>
                <div
                  className="font-display text-ink mt-2"
                  style={{ fontSize: '18px', letterSpacing: '0.05em' }}
                >
                  {WEDDING.timeLabel}
                </div>
              </div>
              <div>
                <div
                  className="font-display text-gold uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.4em' }}
                >
                  Réception
                </div>
                <div
                  className="font-display text-ink mt-2"
                  style={{ fontSize: '18px', letterSpacing: '0.05em' }}
                >
                  {WEDDING.receptionLabel}
                </div>
              </div>
            </div>

            <a
              href={WEDDING.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn-gold mt-10"
            >
              Obtenir l'itinéraire
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="border border-gold-deep overflow-hidden h-[360px] md:h-[480px] relative z-[1]"
          >
            <iframe
              title={`Carte de ${WEDDING.venue}`}
              src={WEDDING.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[0.3]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
