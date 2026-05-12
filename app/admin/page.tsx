'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { supabase, isSupabaseConfigured, type RsvpRow, type WishRow } from '@/lib/supabase';
import { Divider } from '@/components/Ornaments';

type AddTab = 'manual' | 'csv';

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Add-guest panel state ──
  const [addTab, setAddTab] = useState<AddTab>('manual');
  const [manualName, setManualName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [csvPreview, setCsvPreview] = useState<string[] | null>(null);
  const [csvError, setCsvError] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

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
    // Use explicit checks so pending (null) isn't counted as declined.
    const confirmed = rsvps.filter((r) => r.attending === true).length;
    const declined = rsvps.filter((r) => r.attending === false).length;
    const arrived = rsvps.filter((r) => r.arrived).length;
    return { total, confirmed, declined, arrived };
  }, [rsvps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter((r) => r.name.toLowerCase().includes(q));
  }, [rsvps, search]);

  function inviteUrl(token: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?token=${token}`;
  }

  async function copyLink(token: string) {
    const url = inviteUrl(token);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback: create a temp textarea
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedToken(token);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedToken(null), 2000);
  }

  function exportCsv() {
    const header = ['name', 'attending', 'arrived', 'token', 'responded_at', 'created_at'];
    const rows = rsvps.map((r) =>
      [
        r.name,
        r.attending === null ? 'en attente' : r.attending ? 'oui' : 'non',
        r.arrived ? 'oui' : 'non',
        r.token,
        r.responded_at || '',
        r.created_at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invites-smd-cac.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadCsvTemplate() {
    const csv = 'name\nMarie Dupont\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modele-invites.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function addManualGuest(e: React.FormEvent) {
    e.preventDefault();
    const name = manualName.trim();
    if (!name) return;
    setAdding(true);
    setAddError('');
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase n’est pas configuré.');
      const { data, error } = await supabase
        .from('rsvp')
        .insert({ name })
        .select('*')
        .single();
      if (error) throw error;
      setRsvps((prev) => [data as RsvpRow, ...prev]);
      setManualName('');
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setAdding(false);
    }
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvError('');
    Papa.parse<{ name?: string }>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const names = (results.data || [])
          .map((row) => (row?.name || '').toString().trim())
          .filter((n) => n.length > 0);
        if (names.length === 0) {
          setCsvError("Aucun invité détecté. La première colonne doit s'appeler « name ».");
          setCsvPreview(null);
          return;
        }
        setCsvPreview(names);
      },
      error: (err) => {
        setCsvError(`Erreur de lecture du fichier : ${err.message}`);
        setCsvPreview(null);
      },
    });
  }

  async function confirmCsvImport() {
    if (!csvPreview || !isSupabaseConfigured) return;
    setCsvImporting(true);
    setCsvError('');
    try {
      const payload = csvPreview.map((name) => ({ name }));
      const { data, error } = await supabase.from('rsvp').insert(payload).select('*');
      if (error) throw error;
      setRsvps((prev) => [...((data || []) as RsvpRow[]), ...prev]);
      cancelCsvImport();
    } catch (err: unknown) {
      setCsvError(err instanceof Error ? err.message : "L'import a échoué.");
    } finally {
      setCsvImporting(false);
    }
  }

  function cancelCsvImport() {
    setCsvPreview(null);
    setCsvError('');
    if (csvInputRef.current) csvInputRef.current.value = '';
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

  function presence(attending: boolean | null) {
    if (attending === null)
      return (
        <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase bg-dark/5 text-dark/60 border border-dark/15">
          En attente
        </span>
      );
    if (attending)
      return (
        <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase bg-gold/10 text-gold border border-gold/40">
          Oui
        </span>
      );
    return (
      <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase bg-dark/5 text-dark/60 border border-dark/15">
        Non
      </span>
    );
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
            <code className="text-gold">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> dans{' '}
            <code className="text-gold">.env.local</code>.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Invités', value: stats.total },
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

        {/* ───────── ADD GUESTS ───────── */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-dark mb-4">Ajouter des invités</h2>
          <div className="bg-white border border-gold/40">
            <div className="flex border-b border-gold/20">
              <button
                onClick={() => setAddTab('manual')}
                className={`flex-1 px-5 py-3 text-xs tracking-widest uppercase transition ${
                  addTab === 'manual'
                    ? 'bg-gold/10 text-gold border-b-2 border-gold'
                    : 'text-dark/60 hover:text-gold'
                }`}
              >
                Ajouter manuellement
              </button>
              <button
                onClick={() => setAddTab('csv')}
                className={`flex-1 px-5 py-3 text-xs tracking-widest uppercase transition ${
                  addTab === 'csv'
                    ? 'bg-gold/10 text-gold border-b-2 border-gold'
                    : 'text-dark/60 hover:text-gold'
                }`}
              >
                Importer CSV
              </button>
            </div>

            <div className="p-6">
              {addTab === 'manual' && (
                <form onSubmit={addManualGuest} className="space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-dark/60">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Entrer le nom complet"
                    className="w-full"
                  />
                  {addError && (
                    <p className="text-sm italic text-red-700">{addError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={adding}
                    className="btn-gold-filled disabled:opacity-60"
                  >
                    {adding ? 'Ajout…' : "➕ Ajouter l'invité"}
                  </button>
                </form>
              )}

              {addTab === 'csv' && (
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={downloadCsvTemplate}
                    className="btn-gold"
                  >
                    ⬇ Télécharger le modèle CSV
                  </button>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-dark/60 mb-2">
                      Choisir un fichier CSV
                    </label>
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFile}
                      className="block text-sm text-dark/70"
                    />
                    <p className="text-xs text-dark/50 italic mt-2">
                      Format attendu : une seule colonne <code>name</code>, un invité par ligne.
                    </p>
                  </div>

                  {csvError && (
                    <p className="text-sm italic text-red-700">{csvError}</p>
                  )}

                  {csvPreview && csvPreview.length > 0 && (
                    <div className="border border-gold/40 bg-cream/40 p-5">
                      <p className="font-serif text-lg text-dark">
                        {csvPreview.length} invité{csvPreview.length > 1 ? 's' : ''} détecté
                        {csvPreview.length > 1 ? 's' : ''}
                      </p>
                      <div className="max-h-48 overflow-y-auto mt-3 text-sm text-dark/80 space-y-1">
                        {csvPreview.map((n, i) => (
                          <div key={i} className="border-b border-gold/10 py-1.5">
                            {n}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={confirmCsvImport}
                          disabled={csvImporting}
                          className="btn-gold-filled disabled:opacity-60"
                        >
                          {csvImporting ? 'Import…' : '✓ Confirmer'}
                        </button>
                        <button onClick={cancelCsvImport} className="btn-gold">
                          ✕ Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───────── GUEST LIST ───────── */}
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
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Date réponse</th>
                    <th className="text-left p-4 font-light tracking-widest uppercase text-xs">Lien</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center italic text-dark/60">
                        Chargement…
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center italic text-dark/60">
                        Aucun invité.
                      </td>
                    </tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-gold/20">
                      <td className="p-4 font-serif text-base">{r.name}</td>
                      <td className="p-4">{presence(r.attending)}</td>
                      <td className="p-4">
                        {r.arrived ? (
                          <span className="text-gold font-serif">✓ Arrivé</span>
                        ) : (
                          <span className="text-dark/40">—</span>
                        )}
                      </td>
                      <td className="p-4 text-dark/70 text-xs">
                        {r.responded_at
                          ? new Date(r.responded_at).toLocaleString('fr-FR')
                          : <span className="text-dark/40">—</span>}
                      </td>
                      <td className="p-4 relative">
                        <button
                          onClick={() => copyLink(r.token)}
                          className="inline-flex items-center gap-2 text-gold hover:text-dark text-xs tracking-widest uppercase border border-gold/40 px-3 py-1.5 transition"
                          title={inviteUrl(r.token)}
                        >
                          🔗 Copier
                        </button>
                        {copiedToken === r.token && (
                          <span className="absolute left-4 -bottom-1 translate-y-full bg-dark text-cream text-[10px] tracking-widest uppercase px-2 py-1 z-10">
                            Copié !
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ───────── WISHES ───────── */}
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
