'use client';

import { motion } from 'framer-motion';
import { WEDDING } from '@/lib/wedding';

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-beige px-6 py-20 md:py-28 overflow-hidden">
      <svg className="classic-hero-corner tl" aria-hidden="true">
        <use href="#floral-corner" />
      </svg>
      <svg className="classic-hero-corner tr" aria-hidden="true">
        <use href="#floral-corner" />
      </svg>
      <svg className="classic-hero-corner bl" aria-hidden="true">
        <use href="#floral-corner" />
      </svg>
      <svg className="classic-hero-corner br" aria-hidden="true">
        <use href="#floral-corner" />
      </svg>
      <div className="absolute inset-4 md:inset-8 border border-gold pointer-events-none classic-frame" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        <p className="eyebrow mb-8">Save the date</p>

        <div
          className="font-display text-gold-deep leading-none"
          style={{ fontSize: 'clamp(56px, 9vw, 96px)', letterSpacing: '0.04em' }}
        >
          {WEDDING.bride.charAt(0)}
          <span className="serif-italic text-gold mx-3 font-light" style={{ fontSize: '0.85em' }}>
            &amp;
          </span>
          {WEDDING.groom.charAt(0)}
        </div>

        <div className="gold-rule" />

        <p
          className="serif-italic text-ink-soft mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(15px, 1.4vw, 18px)', maxWidth: '480px' }}
        >
          C'est avec une joie immense
          <br />
          que nous vous convions à célébrer
          <br />
          notre union
        </p>

        <div
          className="font-display text-ink mt-8"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 1.1 }}
        >
          {WEDDING.brideFull}
        </div>
        <div
          className="serif-italic text-gold font-light my-1"
          style={{ fontSize: '0.7em' }}
        >
          &amp;
        </div>
        <div
          className="font-display text-ink"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.04em', lineHeight: 1.1 }}
        >
          {WEDDING.groomFull}
        </div>

        <div className="gold-rule-ornament" aria-hidden="true">
          <span />
          <div className="dot" />
          <span />
        </div>

        <div
          className="font-display text-gold-deep"
          style={{ letterSpacing: '0.18em' }}
        >
          <div className="text-[13px] mb-3">Le samedi</div>
          <div className="flex items-center justify-center gap-5 md:gap-7" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}>
            <span className="text-ink">{WEDDING.dateRow.day}</span>
            <span className="text-gold text-[0.7em]">·</span>
            <span className="text-ink">{WEDDING.dateRow.month}</span>
            <span className="text-gold text-[0.7em]">·</span>
            <span className="text-ink">{WEDDING.dateRow.year}</span>
          </div>
        </div>

        <a
          href="#countdown"
          className="mt-12 inline-flex flex-col items-center text-gold"
          aria-label="Faire défiler"
        >
          <span className="font-display text-[10px] tracking-[0.4em] uppercase">Découvrir</span>
          <svg
            className="w-3 h-5 mt-3 animate-bounce-soft"
            viewBox="0 0 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M8 2v18M2 14l6 6 6-6" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
