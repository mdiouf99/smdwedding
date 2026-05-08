import EnvelopeIntro from '@/components/EnvelopeIntro';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Schedule from '@/components/Schedule';
import Venue from '@/components/Venue';
import Rsvp from '@/components/Rsvp';
import Wishes from '@/components/Wishes';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <EnvelopeIntro>
      <main>
        <Hero />
        <Countdown />
        <Schedule />
        <Venue />
        <Rsvp />
        <Wishes />
        <Footer />
      </main>
    </EnvelopeIntro>
  );
}
