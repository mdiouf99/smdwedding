'use client';

import { motion } from 'framer-motion';
import { SCHEDULE } from '@/lib/wedding';

export default function Schedule() {
  return (
    <section id="programme" className="bg-beige-deep py-24 px-6 md:py-28">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
          className="text-center"
        >
          <svg
            aria-hidden="true"
            className="mx-auto mb-6 block"
            style={{ color: 'var(--gold)', width: '160px', height: '28px' }}
          >
            <use href="#floral-divider" />
          </svg>
          <p className="section-eyebrow">Programme</p>
          <h2 className="section-title mt-6">Le grand jour</h2>
          <p className="section-sub mt-4">heure par heure</p>
        </motion.div>

        <div className="mt-16 space-y-6 md:space-y-8">
          {SCHEDULE.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={`bg-beige border border-gold-line p-6 md:p-10 max-w-xl ${
                  isLeft ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'
                } mx-auto text-center md:text-left`}
              >
                <div className="font-display text-gold-deep" style={{ letterSpacing: '0.18em', fontSize: '11px' }}>
                  {event.time}
                </div>
                <h3
                  className="font-display text-ink mt-3"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', letterSpacing: '0.04em' }}
                >
                  {event.title}
                </h3>
                <p className="serif-italic text-ink-soft text-sm md:text-base mt-1">{event.place}</p>
                <p className="mt-4 text-ink/80 leading-relaxed text-sm md:text-base">
                  {event.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
