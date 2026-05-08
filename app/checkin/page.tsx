import { Suspense } from 'react';
import CheckinClient from './CheckinClient';

export const dynamic = 'force-dynamic';

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <p className="font-serif italic text-gold">Chargement…</p>
        </div>
      }
    >
      <CheckinClient />
    </Suspense>
  );
}
