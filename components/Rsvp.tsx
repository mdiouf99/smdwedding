'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { WEDDING } from '@/lib/wedding';
import { supabase, isSupabaseConfigured, type RsvpRow } from '@/lib/supabase';

type Phase =
  | { kind: 'loading' }
  | { kind: 'invalid' }
  | { kind: 'pending'; guest: RsvpRow }
  | { kind: 'responded'; guest: RsvpRow; qrDataUrl?: string }
  | { kind: 'error'; message: string };

export default function Rsvp({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  // Fetch the guest by token on mount
  useEffect(() => {
    if (!token) {
      setPhase({ kind: 'invalid' });
      return;
    }
    if (!isSupabaseConfigured) {
      setPhase({ kind: 'error', message: 'Supabase n’est pas configuré.' });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('token', token)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setPhase({ kind: 'error', message: error.message });
        return;
      }
      if (!data) {
        setPhase({ kind: 'invalid' });
        return;
      }
      const guest = data as RsvpRow;
      if (guest.attending === null) {
        setPhase({ kind: 'pending', guest });
      } else {
        const qrDataUrl = guest.attending ? await generateQr(guest.token) : undefined;
        setPhase({ kind: 'responded', guest, qrDataUrl });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function respond(attending: boolean) {
    const current =
      phase.kind === 'pending' ? phase.guest : phase.kind === 'responded' ? phase.guest : null;
    if (!current) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('rsvp')
        .update({ attending, responded_at: new Date().toISOString() })
        .eq('token', current.token)
        .select('*')
        .single();
      if (error) throw error;
      const guest = data as RsvpRow;
      const qrDataUrl = guest.attending ? await generateQr(guest.token) : undefined;
      setPhase({ kind: 'responded', guest, qrDataUrl });
      setEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setPhase({ kind: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function downloadQr() {
    if (phase.kind !== 'responded' || !phase.qrDataUrl) return;
    const a = document.createElement('a');
    a.href = phase.qrDataUrl;
    a.download = `qr-${phase.guest.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <svg
            aria-hidden="true"
            className="mx-auto mb-6 block"
            style={{ color: 'var(--gold)', width: '160px', height: '28px' }}
          >
            <use href="#floral-divider" />
          </svg>
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
          {phase.kind === 'loading' && (
            <p className="text-center serif-italic text-ink-soft">Chargement…</p>
          )}

          {phase.kind === 'invalid' && (
            <div className="text-center">
              <p
                className="font-display text-ink"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '0.04em' }}
              >
                Ce lien n'est pas valide.
              </p>
              <p className="serif-italic text-ink-soft mt-4">
                Veuillez contacter les mariés.
              </p>
            </div>
          )}

          {phase.kind === 'error' && (
            <div className="text-center">
              <p
                className="font-display text-ink"
                style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '0.04em' }}
              >
                Une erreur est survenue.
              </p>
              <p className="serif-italic mt-3" style={{ color: '#9B3D2C' }}>
                {phase.message}
              </p>
            </div>
          )}

          {phase.kind === 'pending' && (
            <PendingForm
              name={phase.guest.name}
              submitting={submitting}
              onYes={() => respond(true)}
              onNo={() => respond(false)}
            />
          )}

          {phase.kind === 'responded' && editing && (
            <PendingForm
              name={phase.guest.name}
              submitting={submitting}
              currentAnswer={phase.guest.attending}
              onYes={() => respond(true)}
              onNo={() => respond(false)}
              onCancel={() => setEditing(false)}
            />
          )}

          {phase.kind === 'responded' && !editing && (
            <RespondedView
              guest={phase.guest}
              qrDataUrl={phase.qrDataUrl}
              onDownload={downloadQr}
              onEdit={() => setEditing(true)}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

async function generateQr(token: string): Promise<string | undefined> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const checkinUrl = `${origin}/checkin?token=${token}`;
  try {
    return await QRCode.toDataURL(checkinUrl, {
      margin: 2,
      width: 480,
      color: { dark: '#1A1714', light: '#F5EFE4' },
    });
  } catch {
    return undefined;
  }
}

function PendingForm({
  name,
  submitting,
  currentAnswer,
  onYes,
  onNo,
  onCancel,
}: {
  name: string;
  submitting: boolean;
  currentAnswer?: boolean | null;
  onYes: () => void;
  onNo: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="text-center">
      <p
        className="font-display text-gold-deep"
        style={{ fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '0.04em' }}
      >
        Bonjour {name}
      </p>
      <p className="serif-italic text-ink-soft mt-3">
        {currentAnswer === undefined ? 'Serez-vous présent(e) ?' : 'Souhaitez-vous modifier votre réponse ?'}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        <ChoiceButton
          variant="yes"
          highlighted={currentAnswer === true}
          disabled={submitting}
          onClick={onYes}
        >
          ✅ Oui, je serai là !
        </ChoiceButton>
        <ChoiceButton
          variant="no"
          highlighted={currentAnswer === false}
          disabled={submitting}
          onClick={onNo}
        >
          ❌ Je ne pourrai pas venir
        </ChoiceButton>
      </div>

      {submitting && (
        <p className="mt-6 serif-italic text-ink-soft text-sm">Enregistrement…</p>
      )}

      {onCancel && (
        <button
          onClick={onCancel}
          className="block mx-auto mt-8 font-display uppercase text-ink-soft hover:text-gold transition"
          style={{ fontSize: '10px', letterSpacing: '0.4em' }}
        >
          Annuler
        </button>
      )}
    </div>
  );
}

function ChoiceButton({
  variant,
  highlighted,
  disabled,
  onClick,
  children,
}: {
  variant: 'yes' | 'no';
  highlighted?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-display uppercase tracking-[0.2em] text-xs md:text-sm py-5 px-6 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
        variant === 'yes'
          ? highlighted
            ? 'bg-gold text-beige border border-gold'
            : 'border border-gold text-gold hover:bg-gold hover:text-beige'
          : highlighted
          ? 'bg-ink text-beige border border-ink'
          : 'border border-gold-line text-ink-soft hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function RespondedView({
  guest,
  qrDataUrl,
  onDownload,
  onEdit,
}: {
  guest: RsvpRow;
  qrDataUrl?: string;
  onDownload: () => void;
  onEdit: () => void;
}) {
  return (
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
        {guest.attending ? `Merci ${guest.name} !` : `Merci ${guest.name}`}
      </p>
      <p className="serif-italic text-ink-soft mt-3">
        {guest.attending
          ? 'Nous avons hâte de vous voir.'
          : 'Nous sommes désolés de votre absence.'}
      </p>

      {guest.attending && qrDataUrl && (
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
              src={qrDataUrl}
              alt="QR code de check-in"
              className="w-56 h-56 md:w-64 md:h-64"
            />
          </div>
          <p className="mt-4 text-sm serif-italic text-ink-soft">
            Présentez ce QR code à l'entrée le jour J.
          </p>
          <button onClick={onDownload} className="btn-gold mt-6">
            Télécharger
          </button>
        </div>
      )}

      <button
        onClick={onEdit}
        className="block mx-auto mt-10 font-display uppercase text-ink-soft hover:text-gold transition"
        style={{ fontSize: '10px', letterSpacing: '0.4em' }}
      >
        Modifier ma réponse
      </button>
    </motion.div>
  );
}
