import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureShowcase from "@/components/FeatureShowcase";
import Explore from "@/components/Explore";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="pointer-events-none flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <FeatureShowcase />
      <Explore />
      <ClosingCTA />
      <Footer />
    </main>
  );
}