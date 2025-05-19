import Footer from '@/components/footer';
import HeroSection from '@/components/hero/hero-section';
import { Particles } from '@/components/magicui/particles';
import NavBar from '@/components/navbar';

export default function Home() {
  return (
    <main className="relative flex max-h-screen flex-1 flex-col">
      <Particles className="absolute h-screen w-full" quantity={300} />
      <NavBar />
      <div>
        <HeroSection />
      </div>
      <Footer />
    </main>
  );
}
