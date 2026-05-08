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
    <section id="countdown" className="bg-beige py-24 px-6 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="section-eyebrow">Le compte à rebours</p>
        <h2 className="section-title mt-6">Plus que quelques instants</h2>
        <p className="section-sub mt-4">avant le grand jour</p>

        <div className="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto mt-14">
          {units.map((u) => (
            <div
              key={u.label}
              className="py-6 md:py-8 px-1 md:px-3 border-t border-b border-gold"
            >
              <div
                className="font-display text-ink leading-none tabular-nums"
                style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
              >
                {mounted ? String(u.value).padStart(2, '0') : '--'}
              </div>
              <div
                className="font-display text-gold uppercase mt-3"
                style={{ fontSize: '10px', letterSpacing: '0.4em' }}
              >
                {u.label}
              </div>
            </div>
          ))}
        </div>

        {time.done && (
          <p className="mt-12 serif-italic text-2xl text-gold">Le grand jour est arrivé !</p>
        )}
      </motion.div>
    </section>
  );
}
