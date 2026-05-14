import EnvelopeIntro from '@/components/EnvelopeIntro';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Venue from '@/components/Venue';
import Rsvp from '@/components/Rsvp';
import Wishes from '@/components/Wishes';
import Footer from '@/components/Footer';
import NoTokenNotice from '@/components/NoTokenNotice';

export default function Home({
  searchParams,
}: {
  searchParams: { token?: string | string[] };
}) {
  const raw = searchParams?.token;
  const token = typeof raw === 'string' ? raw.trim() : '';

  return (
    <EnvelopeIntro>
      <main>
        <Hero />
        <Countdown />
        <Venue />
        {token ? <Rsvp token={token} /> : <NoTokenNotice />}
        {token ? <Wishes /> : null}
        <Footer />
      </main>
    </EnvelopeIntro>
  );
}
