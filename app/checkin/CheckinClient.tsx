'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FloralCorner } from '@/components/Ornaments';
import { supabase, isSupabaseConfigured, type RsvpRow } from '@/lib/supabase';
import { WEDDING } from '@/lib/wedding';

export default function CheckinClient() {
  const params = useSearchParams();
  const token = params.get('token');
  const [guest, setGuest] = useState<RsvpRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      if (!token) {
        setError('Aucun jeton fourni.');
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured) {
        setError(
          'Supabase n’est pas configuré. Renseignez .env.local pour activer le check-in.',
        );
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await supabase
        .from('rsvp')
        .select('*')
        .eq('token', token)
        .maybeSingle();
      if (queryError) {
        setError(queryError.message);
      } else if (!data) {
        setError('Invité introuvable. Vérifiez votre QR code.');
      } else {
        setGuest(data as RsvpRow);
      }
      setLoading(false);
    })();
  }, [token]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-cream px-6 py-16 overflow-hidden">
      <FloralCorner className="absolute top-0 left-0 w-40 md:w-56 opacity-80 pointer-events-none" />
      <FloralCorner
        flip
        className="absolute bottom-0 right-0 w-40 md:w-56 opacity-80 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-lg w-full bg-white border border-gold/40 p-10 text-center shadow-sm"
      >
        <p className="text-xs tracking-[0.4em] uppercase text-gold">
          {WEDDING.hashtag}
        </p>
        <div className="mx-auto my-5 h-px w-16 bg-gold/60" />

        {loading && <p className="font-serif italic text-dark/60">Vérification…</p>}

        {!loading && error && (
          <>
            <p className="font-serif text-3xl text-dark">Oups…</p>
            <p className="mt-4 text-dark/70">{error}</p>
          </>
        )}

        {!loading && guest && (
          <>
            <p className="font-serif text-2xl md:text-3xl italic text-gold mb-3">
              ✦ Bienvenue ✦
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-dark">{guest.name} !</h1>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="border border-gold/40 p-4">
                <p className="text-xs uppercase tracking-widest text-dark/60">Statut</p>
                <p className="mt-2 font-serif text-lg text-gold">
                  {guest.attending ? 'Confirmé' : 'Non disponible'}
                </p>
              </div>
              <div className="border border-gold/40 p-4">
                <p className="text-xs uppercase tracking-widest text-dark/60">Arrivée</p>
                <p className="mt-2 font-serif text-lg text-gold">
                  {guest.arrived ? 'Enregistré' : 'En attente'}
                </p>
              </div>
            </div>

            <p className="mt-8 italic text-dark/70 font-serif">
              {guest.attending
                ? 'Présentez cet écran à l\'accueil.'
                : 'Vous nous manquerez !'}
            </p>
          </>
        )}
      </motion.div>
    </main>
  );
}
