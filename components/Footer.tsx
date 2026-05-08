import { WEDDING } from '@/lib/wedding';

export default function Footer() {
  return (
    <footer className="bg-beige py-20 px-6 text-center border-t border-gold-line">
      <div className="max-w-3xl mx-auto">
        <p className="serif-italic text-gold text-base md:text-lg">
          Avec tout notre amour,
        </p>
        <p
          className="font-display text-gold-deep mt-3"
          style={{ fontSize: '24px', letterSpacing: '0.18em' }}
        >
          {WEDDING.bride} &nbsp;&amp;&nbsp; {WEDDING.groom}
        </p>
        <div className="gold-rule" />
        <p
          className="font-display text-ink"
          style={{ fontSize: '18px', letterSpacing: '0.04em' }}
        >
          {WEDDING.brideFull}
          <span className="text-gold mx-3 serif-italic">&amp;</span>
          {WEDDING.groomFull}
        </p>
        <p
          className="font-display text-gold uppercase mt-3"
          style={{ fontSize: '10px', letterSpacing: '0.4em' }}
        >
          {WEDDING.dateRoman}
        </p>
        <p
          className="font-display text-ink-soft mt-6"
          style={{ fontSize: '11px', letterSpacing: '0.4em' }}
        >
          {WEDDING.hashtag}
        </p>
      </div>
    </footer>
  );
}
