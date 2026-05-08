'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FloralCorner } from '@/components/Ornaments';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace(next);
      router.refresh();
    } else {
      setError('Mot de passe incorrect.');
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-cream px-6 overflow-hidden">
      <FloralCorner className="absolute top-0 left-0 w-40 md:w-56 opacity-80 pointer-events-none" />
      <FloralCorner
        flip
        className="absolute bottom-0 right-0 w-40 md:w-56 opacity-80 pointer-events-none"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-md w-full bg-white border border-gold/40 p-10 shadow-sm"
      >
        <p className="text-xs tracking-[0.4em] uppercase text-gold text-center">
          Espace privé
        </p>
        <h1 className="section-title text-3xl mt-3">Connexion</h1>
        <div className="mx-auto my-6 h-px w-16 bg-gold/60" />

        <label className="block text-xs tracking-widest uppercase text-gold mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />

        {error && <p className="text-sm text-red-700 italic mt-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-gold-filled w-full mt-8 disabled:opacity-60"
        >
          {loading ? 'Connexion…' : 'Entrer'}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <p className="font-serif italic text-gold">Chargement…</p>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
