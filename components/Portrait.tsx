'use client';

import { motion } from 'framer-motion';

export default function Portrait() {
  return (
    <section className="relative bg-beige py-24 px-6 md:py-28 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/flowers/gold-line-bouquet.png"
        alt=""
        className="flower-corner tr"
        aria-hidden="true"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/flowers/gold-line-bouquet.png"
        alt=""
        className="flower-corner bl"
        aria-hidden="true"
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
        >

          <div className="relative inline-block">
            {/* gold double-frame */}
            <div
              className="absolute -inset-3 md:-inset-4 border border-gold pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -inset-1.5 md:-inset-2 border border-gold-line pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait.jpg"
                alt="Portrait de la mariée"
                className="block w-[260px] sm:w-[320px] md:w-[380px] h-auto"
              />
            </div>
          </div>

          <p
            className="serif-italic text-ink-soft mt-12 md:mt-16 text-base md:text-lg"
            style={{ letterSpacing: '0.02em' }}
          >
            « L'amour est patient, l'amour est bon. »
          </p>
        </motion.div>
      </div>
    </section>
  );
}
