import { WEDDING } from '@/lib/wedding';

export default function Footer() {
  return (
    <footer className="py-20 px-6 text-center" style={{ background: 'var(--ink-deep)' }}>
      <div className="max-w-3xl mx-auto">
        <svg className="classic-footer-floral" aria-hidden="true">
          <use href="#floral-divider" />
        </svg>
        <p className="serif-italic text-base md:text-lg" style={{ color: 'var(--gold-faint)' }}>
          Avec tout notre amour,
        </p>
        <p
          className="font-display mt-3"
          style={{ fontSize: '24px', letterSpacing: '0.18em', color: 'var(--gold)' }}
        >
          {WEDDING.bride} &nbsp;&amp;&nbsp; {WEDDING.groom}
        </p>
        <div className="gold-rule" />
        <p
          className="font-display"
          style={{ fontSize: '18px', letterSpacing: '0.04em', color: 'var(--beige)' }}
        >
          {WEDDING.brideFull}
          <span className="text-gold mx-3 serif-italic">&amp;</span>
          {WEDDING.groomFull}
        </p>
        <p
          className="font-display uppercase mt-3"
          style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--gold)' }}
        >
          {WEDDING.dateRoman}
        </p>
        <p
          className="font-display mt-6"
          style={{ fontSize: '11px', letterSpacing: '0.4em', color: 'var(--gold-faint)' }}
        >
          {WEDDING.hashtag}
        </p>
      </div>
    </footer>
  );
}
