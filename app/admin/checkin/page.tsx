'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured, type RsvpRow } from '@/lib/supabase';
import { Divider } from '@/components/Ornaments';

type ScanState = {
  status: 'idle' | 'looking' | 'found' | 'not_found' | 'error';
  guest?: RsvpRow;
  message?: string;
};

export default function AdminCheckinScanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(
    null,
  );
  const [scanning, setScanning] = useState(false);
  const [scan, setScan] = useState<ScanState>({ status: 'idle' });
  const [marking, setMarking] = useState(false);

  function extractToken(text: string): string | null {
    try {
      const url = new URL(text);
      return url.searchParams.get('token');
    } catch {
      const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
      return match ? match[0] : null;
    }
  }

  async function lookupToken(token: string) {
    setScan({ status: 'looking' });
    if (!isSupabaseConfigured) {
      setScan({ status: 'error', message: 'Supabase non configuré.' });
      return;
    }
    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .eq('token', token)
      .maybeSingle();
    if (error) {
      setScan({ status: 'error', message: error.message });
    } else if (!data) {
      setScan({ status: 'not_found' });
    } else {
      setScan({ status: 'found', guest: data as RsvpRow });
    }
  }

  async function startScanner() {
    setScan({ status: 'idle' });
    setScanning(true);
    const { Html5Qrcode } = await import('html5-qrcode');
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const elementId = 'qr-reader';
    const elem = document.createElement('div');
    elem.id = elementId;
    containerRef.current.appendChild(elem);

    const html5QrCode = new Html5Qrcode(elementId);
    scannerRef.current = {
      stop: () => html5QrCode.stop().catch(() => undefined),
      clear: () => html5QrCode.clear(),
    };

    await html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decoded) => {
          const token = extractToken(decoded);
          await html5QrCode.stop().catch(() => undefined);
          setScanning(false);
          if (token) await lookupToken(token);
          else setScan({ status: 'error', message: 'QR non reconnu.' });
        },
        () => undefined,
      )
      .catch((err) => {
        setScanning(false);
        setScan({ status: 'error', message: `Caméra indisponible: ${err}` });
      });
  }

  async function stopScanner() {
    await scannerRef.current?.stop();
    scannerRef.current?.clear();
    scannerRef.current = null;
    setScanning(false);
  }

  async function markArrived() {
    if (!scan.guest || !isSupabaseConfigured) return;
    setMarking(true);
    const { error } = await supabase
      .from('rsvp')
      .update({ arrived: true })
      .eq('id', scan.guest.id);
    setMarking(false);
    if (!error && scan.guest) {
      setScan({ ...scan, guest: { ...scan.guest, arrived: true } });
    }
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.clear();
    };
  }, []);

  return (
    <main className="min-h-screen bg-cream py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin"
          className="text-xs tracking-widest uppercase text-dark/60 hover:text-gold"
        >
          ← Retour
        </Link>
        <div className="text-center mt-2">
          <p className="text-xs tracking-[0.4em] uppercase text-gold">Check-in</p>
          <h1 className="font-serif text-4xl md:text-5xl text-dark mt-2">Scanner QR</h1>
          <Divider />
        </div>

        <div className="bg-white border border-gold/40 p-6 md:p-8">
          <div ref={containerRef} className="w-full" />
          {!scanning && (
            <button onClick={startScanner} className="btn-gold-filled w-full mt-4">
              Démarrer la caméra
            </button>
          )}
          {scanning && (
            <button onClick={stopScanner} className="btn-gold w-full mt-4">
              Arrêter
            </button>
          )}
        </div>

        <div className="mt-8">
          {scan.status === 'looking' && (
            <p className="italic text-center text-dark/60">Recherche…</p>
          )}
          {scan.status === 'not_found' && (
            <p className="text-center text-red-700 italic">QR code non reconnu.</p>
          )}
          {scan.status === 'error' && (
            <p className="text-center text-red-700 italic">{scan.message}</p>
          )}
          {scan.status === 'found' && scan.guest && (
            <div className="bg-white border border-gold/40 p-8 text-center">
              <p className="text-xs tracking-widest uppercase text-gold">Invité</p>
              <h2 className="font-serif text-3xl text-dark mt-2">{scan.guest.name}</h2>
              <p className="mt-2 text-dark/70">
                {scan.guest.attending ? 'Confirmé' : 'A décliné l\'invitation'}
              </p>
              <p className="mt-1 text-sm text-dark/60">
                {scan.guest.arrived ? '✓ Déjà enregistré' : 'Non encore arrivé'}
              </p>
              {scan.guest.attending && !scan.guest.arrived && (
                <button
                  onClick={markArrived}
                  disabled={marking}
                  className="btn-gold-filled mt-6"
                >
                  {marking ? 'Mise à jour…' : 'Marquer comme arrivé'}
                </button>
              )}
              {scan.guest.arrived && (
                <p className="mt-6 font-serif text-2xl italic text-gold">
                  Bienvenue !
                </p>
              )}
              <button
                onClick={startScanner}
                className="block mx-auto mt-6 text-xs tracking-widest uppercase text-dark/60 hover:text-gold"
              >
                Scanner un autre QR
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
