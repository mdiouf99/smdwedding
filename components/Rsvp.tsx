'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import QRCode from 'qrcode';
import { WEDDING } from '@/lib/wedding';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';
type SuccessData = {
  name: string;
  attending: boolean;
  token: string;
  qrDataUrl?: string;
};

export default function Rsvp() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState<SuccessData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || attending === null) {
      setErrorMsg('Merci d’indiquer votre nom et votre choix.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      let token =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('rsvp')
          .insert({ name: name.trim(), attending })
          .select('token')
          .single();
        if (error) throw error;
        if (data?.token) token = data.token as string;
      }

      let qrDataUrl: string | undefined;
      if (attending) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const checkinUrl = `${origin}/checkin?token=${token}`;
        try {
          qrDataUrl = await QRCode.toDataURL(checkinUrl, {
            margin: 2,
            width: 480,
            color: { dark: '#1A1714', light: '#F5EFE4' },
          });
        } catch {
          // QR non-critical
        }
      }

      setSuccess({ name: name.trim(), attending, token, qrDataUrl });
      setStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setErrorMsg(`Désolés, l'envoi a échoué. ${msg}`);
      setStatus('error');
    }
  }

  function downloadQr() {
    if (!success?.qrDataUrl) return;
    const a = document.createElement('a');
    a.href = success.qrDataUrl;
    a.download = `qr-${success.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function reset() {
    setName('');
    setAttending(null);
    setSuccess(null);
    setStatus('idle');
    setErrorMsg('');
  }

  return (
    <section id="rsvp" className="bg-beige py-24 px-6 md:py-28">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4 }}
          className="text-center"
        >
          <p className="section-eyebrow">RSVP</p>
          <h2 className="section-title mt-6">Serez-vous des nôtres ?</h2>
          <p className="section-sub mt-4">
            Merci de confirmer votre présence avant le {WEDDING.rsvpDeadline}.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2 }}
          className="mt-12 bg-beige-deep border border-gold-line p-8 md:p-12"
        >
          {status === 'success' && success ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p
                className="font-display text-gold-deep"
                style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.04em' }}
              >
                {success.attending
                  ? `Merci ${success.name} !`
                  : `Merci ${success.name}`}
              </p>
              <p className="serif-italic text-ink-soft mt-3">
                {success.attending
                  ? 'Nous avons hâte de vous voir.'
                  : 'Nous sommes désolés de votre absence.'}
              </p>

              {success.attending && success.qrDataUrl && (
                <div className="mt-10">
                  <p
                    className="font-display text-gold uppercase mb-4"
                    style={{ fontSize: '10px', letterSpacing: '0.4em' }}
                  >
                    Votre QR code
                  </p>
                  <div className="inline-block p-4 border border-gold-line bg-beige-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={success.qrDataUrl}
                      alt="QR code de check-in"
                      className="w-56 h-56 md:w-64 md:h-64"
                    />
                  </div>
                  <p className="mt-4 text-sm serif-italic text-ink-soft">
                    Présentez ce QR code à l'entrée le jour J.
                  </p>
                  <button onClick={downloadQr} className="btn-gold mt-6">
                    Télécharger
                  </button>
                </div>
              )}

              <button
                onClick={reset}
                className="block mx-auto mt-10 font-display uppercase text-ink-soft hover:text-gold transition"
                style={{ fontSize: '10px', letterSpacing: '0.4em' }}
              >
                Modifier ma réponse
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="rsvp-name"
                  className="block font-display text-gold uppercase mb-2"
                  style={{ fontSize: '11px', letterSpacing: '0.4em' }}
                >
                  Votre nom complet
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Camille Dubois"
                />
              </div>

              <div>
                <p
                  className="font-display text-gold uppercase mb-3"
                  style={{ fontSize: '11px', letterSpacing: '0.4em' }}
                >
                  Votre réponse
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <RadioOption
                    label="Oui, je serai là"
                    checked={attending === true}
                    onChange={() => setAttending(true)}
                  />
                  <RadioOption
                    label="Je ne pourrai pas venir"
                    checked={attending === false}
                    onChange={() => setAttending(false)}
                  />
                </div>
              </div>

              {status === 'error' && errorMsg && (
                <p className="text-sm serif-italic" style={{ color: '#9B3D2C' }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-gold-filled w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Envoi…' : 'Confirmer ma présence'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`text-left text-sm tracking-wide px-5 py-4 border transition-all duration-300 ${
        checked
          ? 'border-gold bg-gold/10 text-ink'
          : 'border-gold-line text-ink-soft hover:border-gold hover:text-ink'
      }`}
    >
      <span
        className={`inline-block w-2.5 h-2.5 mr-3 rounded-full border align-middle ${
          checked ? 'bg-gold border-gold' : 'border-gold/60'
        }`}
      />
      {label}
    </button>
  );
}
