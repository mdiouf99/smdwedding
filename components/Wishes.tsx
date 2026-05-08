'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, type WishRow } from '@/lib/supabase';

const STORAGE_KEY = 'wedding_wishes_local';
const HEARTS_STORAGE = 'wedding_wish_hearts';

function loadLocal(): WishRow[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishRow[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(wishes: WishRow[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
}

function loadHearted(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(HEARTS_STORAGE);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveHearted(set: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HEARTS_STORAGE, JSON.stringify([...set]));
}

export default function Wishes() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hearted, setHearted] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    setHearted(loadHearted());
    if (!isSupabaseConfigured) {
      setWishes(loadLocal());
      return;
    }
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(60);
      if (mounted && data) setWishes(data as WishRow[]);
    })();
    const channel = supabase
      .channel('wishes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes' },
        (payload) => setWishes((prev) => [payload.new as WishRow, ...prev]),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wishes' },
        (payload) => {
          const updated = payload.new as WishRow;
          setWishes((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
        },
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');

    const newWish: WishRow = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      hearts: 0,
      created_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured) {
        const { error: insertError } = await supabase
          .from('wishes')
          .insert({ name: newWish.name, message: newWish.message });
        if (insertError) throw insertError;
      } else {
        const updated = [newWish, ...wishes];
        setWishes(updated);
        saveLocal(updated);
      }
      setName('');
      setMessage('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : "L'envoi a échoué.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHeart(wish: WishRow) {
    if (hearted.has(wish.id)) return;
    const next = new Set(hearted);
    next.add(wish.id);
    setHearted(next);
    saveHearted(next);

    setWishes((prev) =>
      prev.map((w) => (w.id === wish.id ? { ...w, hearts: w.hearts + 1 } : w)),
    );

    if (isSupabaseConfigured) {
      await supabase.from('wishes').update({ hearts: wish.hearts + 1 }).eq('id', wish.id);
    } else {
      const updated = wishes.map((w) =>
        w.id === wish.id ? { ...w, hearts: w.hearts + 1 } : w,
      );
      saveLocal(updated);
    }
  }

  return (
    <section id="wishes" className="bg-beige-deep py-24 px-6 md:py-28">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
          className="text-center"
        >
          <p className="section-eyebrow">Livre d'or</p>
          <h2 className="section-title mt-6">Laissez-nous un message</h2>
          <p className="section-sub mt-4">vos mots resteront gravés</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2 }}
          onSubmit={handleSubmit}
          className="mt-12 bg-beige border border-gold-line p-6 md:p-10 space-y-6"
        >
          <div>
            <label
              className="block font-display text-gold uppercase mb-2"
              style={{ fontSize: '11px', letterSpacing: '0.4em' }}
            >
              Votre nom
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label
              className="block font-display text-gold uppercase mb-2"
              style={{ fontSize: '11px', letterSpacing: '0.4em' }}
            >
              Votre message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Quelques mots pour les mariés…"
              className="resize-none"
            />
          </div>
          {error && (
            <p className="text-sm serif-italic" style={{ color: '#9B3D2C' }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={submitting} className="btn-gold-filled disabled:opacity-60">
            {submitting ? 'Envoi…' : 'Envoyer mon message'}
          </button>
        </motion.form>

        <div className="mt-12 space-y-4">
          <AnimatePresence initial={false}>
            {wishes.map((w) => (
              <motion.article
                key={w.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="bg-beige border border-gold-line p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="font-display text-ink"
                      style={{ fontSize: '20px', letterSpacing: '0.04em' }}
                    >
                      {w.name}
                    </p>
                    <p className="text-xs serif-italic text-ink-soft mt-1">
                      {new Date(w.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleHeart(w)}
                    disabled={hearted.has(w.id)}
                    className="flex items-center gap-1.5 text-gold disabled:opacity-70"
                    aria-label="J'aime ce message"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill={hearted.has(w.id) ? '#B8935A' : 'none'}
                      stroke="#B8935A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
                    </svg>
                    <span className="text-sm font-light">{w.hearts}</span>
                  </button>
                </div>
                <p className="mt-4 text-ink/85 leading-relaxed serif-italic">{w.message}</p>
              </motion.article>
            ))}
          </AnimatePresence>

          {wishes.length === 0 && (
            <p className="text-center serif-italic text-ink-soft">
              Soyez le premier à laisser un mot doux.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
