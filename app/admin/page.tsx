'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured, type RsvpRow, type WishRow } from '@/lib/supabase';
import { Divider } from '@/components/Ornaments';

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    (async () => {
      const [{ data: r }, { data: w }] = await Promise.all([
        supabase.from('rsvp').select('*').order('created_at', { ascending: false }),
        supabase.from('wishes').select('*').order('created_at', { ascending: false }),
      ]);
      setRsvps((r || []) as RsvpRow[]);
      setWishes((w || []) as WishRow[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const total = rsvps.length;
    const confirmed = rsvps.filter((r) => r.attending).length;
    const declined = rsvps.filter((r) => !r.attending).length;
    const arrived = rsvps.filter((r) => r.arrived).length;
    return { total, confirmed, declined, arrived };
  }, [rsvps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter((r) => r.name.toLowerCase().includes(q));
  }, [rsvps, search]);

  function exportCsv() {
    const header = ['name', 'attending', 'arrived', 'token', 'created_at'];
    const rows = rsvps.map((r) =>
      [r.name, r.attending ? 'oui' : 'non', r.arrived ? 'oui' : 'non', r.token, r.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvp-sophie-thomas.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function deleteWish(id: string) {
    if (!confirm('Supprimer ce message ?')) return;
    if (isSupabaseConfigured) {
      await supabase.from('wishes').delete().eq('id', id);
    }
    setWishes((prev) => prev.filter((w) => w.id !== id));
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    window.location.href = '/admin/login';
  }

  return (
    <main className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-gold">Espace privé</p>
            <h1 className="font-serif text-4xl md:text-5xl text-dark mt-2">
              Tableau de bord
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/checkin" className="btn-gold">
              Scanner QR
            </Link>
            <button onClick={exportCsv} className="btn-gold">
              Exporter CSV
            </button>
            <button onClick={logout} className="btn-gold">
              Déconnexion
            </button>
          </div>
        </div>

        <Divider />

        {!isSupabaseConfigured && (
          <div className="bg-white border border-gold/40 p-6 mb-8 text-sm text-dark/80">
            Supabase n'est pas configuré. Renseignez{' '}
            <code className="text-gold">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
            <code className="text-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans{' '}
            <code className="text-gold">.env.local</code> pour activer les statistiques.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Réponses', value: stats.total },
            { label: 'Confirmés', value: stats.confirmed },
            { label: 'Excusés', value: stats.declined },
            { label: 'Arrivés', value: stats.arrived },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gold/40 p-6 text-center"
            >
              <p className="font-serif text-4xl md:text-5xl text-gold">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-dark/60 mt-2">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="mt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="font-serif text-2xl text-dark">Liste des invités</h2>
            <input
              type="text"
              placeholder="Rechercher par nom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-72"
            />
          </div>

          <div className="bg-white border border-gold/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream/80 text-dark/70">
                  <tr>
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Nom</th>
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Présence</th>
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Arrivée</th>
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center italic text-dark/60">
                        Chargement…
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center italic text-dark/60">
                        Aucun invité.
                      </td>
                    </tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-gold/20">
                      <td className="p-4 font-serif text-base">{r.name}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs tracking-widest uppercase ${
                            r.attending
                              ? 'bg-gold/10 text-gold border border-gold/40'
                              : 'bg-dark/5 text-dark/60 border border-dark/15'
                          }`}
                        >
                          {r.attending ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="p-4">
                        {r.arrived ? (
                          <span className="text-gold font-serif">✓ Arrivé</span>
                        ) : (
                          <span className="text-dark/40">—</span>
                        )}
                      </td>
                      <td className="p-4 text-dark/60 text-xs">
                        {new Date(r.created_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-2xl text-dark mb-4">Messages reçus</h2>
          <div className="space-y-3">
            {wishes.length === 0 && (
              <p className="italic text-dark/50">Aucun message pour le moment.</p>
            )}
            {wishes.map((w) => (
              <div
                key={w.id}
                className="bg-white border border-gold/40 p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-lg text-gold">{w.name}</p>
                  <p className="text-xs text-dark/50 italic">
                    {new Date(w.created_at).toLocaleString('fr-FR')} · {w.hearts} ♥
                  </p>
                  <p className="mt-2 text-dark/85 font-light leading-relaxed">{w.message}</p>
                </div>
                <button
                  onClick={() => deleteWish(w.id)}
                  className="text-xs tracking-widest uppercase text-dark/50 hover:text-red-700 transition shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
