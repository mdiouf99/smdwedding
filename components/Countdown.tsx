'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { WEDDING } from '@/lib/wedding';

function getRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export default function Countdown() {
  const [time, setTime] = useState(() => getRemaining(WEDDING.date));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(getRemaining(WEDDING.date)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Jours', value: time.days },
    { label: 'Heures', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Secondes', value: time.seconds },
  ];

  return (
    <section id="countdown" className="dark-section py-24 px-6 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <svg className="classic-section-floral" aria-hidden="true">
          <use href="#floral-spray" />
        </svg>

        <p className="section-eyebrow-dark">Le compte à rebours</p>
        <h2
          className="section-title-dark mt-6"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          Plus que quelques instants
        </h2>
        <p className="section-sub-dark mt-3 text-lg">avant le grand jour</p>

        <div className="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto mt-14">
          {units.map((u) => (
            <div key={u.label} className="countdown-cell-dark">
              <div
                className="countdown-num-dark"
                style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
              >
                {mounted ? String(u.value).padStart(2, '0') : '--'}
              </div>
              <div className="countdown-label-dark">{u.label}</div>
            </div>
          ))}
        </div>

        {time.done && (
          <p className="mt-12 serif-italic text-2xl text-gold-light">
            Le grand jour est arrivé !
          </p>
        )}
      </motion.div>
    </section>
  );
}
