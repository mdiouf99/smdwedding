'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { WEDDING } from '@/lib/wedding';

export default function EnvelopeIntro({ children }: { children: ReactNode }) {
  // 0 = idle (envelope visible) · 1 = cracking · 2 = flap opening · 3 = page emerging · 4 = done
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t1 = setTimeout(() => setStage(1), 1600);
    const t2 = setTimeout(() => setStage(2), 2400);
    const t3 = setTimeout(() => setStage(3), 3400);
    const t4 = setTimeout(() => setStage(4), 5100);
    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, []);

  const idle = stage === 0;
  const cracking = stage >= 1;
  const flapOpen = stage >= 2;
  const emerging = stage >= 3;
  const gone = stage >= 3;
  const done = stage === 4;

  return (
    <div className="env-root">
      <div className="env-page">{children}</div>

      {!done && (
        <div className={'env-veil' + (emerging ? ' opening' : '')} aria-hidden="true" />
      )}

      {!done && (
        <div className="env-overlay">
          <div
            className={
              'env-chrome' +
              (idle ? ' idle' : '') +
              (cracking ? ' cracking' : '') +
              (gone ? ' gone' : '')
            }
          >
            <div className="env-body" />
            <div className={'env-flap' + (flapOpen ? ' open' : '')} />
            <div className="env-seal-wrap">
              <div className="env-seal-l" />
              <div className="env-seal-r" />
              <div className="env-seal-letter">{WEDDING.bride}&amp;{WEDDING.groom}</div>
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                const style: CSSProperties = {
                  ['--dx' as string]: `${Math.cos(a) * 8}px`,
                  ['--dy' as string]: `${Math.sin(a) * 8}px`,
                  animationDelay: `${i * 0.02}s`,
                };
                return <div key={i} className="env-spark" style={style} />;
              })}
            </div>
          </div>
          <div className={'env-burst' + (emerging ? ' flash' : '')} />
        </div>
      )}
    </div>
  );
}
