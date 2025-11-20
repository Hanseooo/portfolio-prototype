import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import { useScrollStore } from "@/store/scrollStore";
import TechStackMarquee from "../sections/TechStackMarquee";
import { motion } from "framer-motion";

// HomePage.tsx
export default function HomePage() {
  const setScrollY = useScrollStore((state) => state.setScrollY);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollY]);
  

  return (
    <main className="w-full h-full overflow-x-hidden relative bg-linear-to-r from-background  via-primary/10 to-background">
      <HeroSection />

      {/* Tech Stack Marquee Section */}
      <section className="relative w-full mt-48 py-12 h-[150vh] ">
        <div className="h-screen flex flex-col justify-center items-center">
            <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 1.25 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }} // triggers once when 50% visible
            >
            <h2 className="text-3xl md:text-5xl font-bold">Tech Stack</h2>
            </motion.div>
          <TechStackMarquee />
        </div>
      </section>

      {/* Companies Visited */}
      <section className="py-20 bg-muted text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10">Companies I've Visited</h2>
        {/* logos grid placeholder */}
      </section>

      {/* Gallery */}
      <section className="py-20 bg-background text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10">Gallery</h2>
        {/* gallery grid placeholder */}
      </section>
    </main>
  );
}