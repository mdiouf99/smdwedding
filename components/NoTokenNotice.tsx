'use client';

import { motion } from 'framer-motion';

export default function NoTokenNotice() {
  return (
    <section id="invite" className="bg-beige py-24 px-6 md:py-28">
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
        >
          <svg
            aria-hidden="true"
            className="mx-auto mb-6 block"
            style={{ color: 'var(--gold)', width: '160px', height: '28px' }}
          >
            <use href="#floral-divider" />
          </svg>
          <p className="section-eyebrow">Invitation personnelle</p>
          <h2 className="section-title mt-6">Un lien vous a été envoyé</h2>
          <div className="mt-10 bg-beige-deep border border-gold-line p-8 md:p-12">
            <p className="serif-italic text-ink-soft text-base md:text-lg leading-relaxed">
              Vous avez reçu un lien personnel pour confirmer votre présence.
            </p>
            <p className="serif-italic text-ink-soft text-sm md:text-base mt-4">
              Vérifiez votre message ou contactez les mariés si vous ne le trouvez pas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
