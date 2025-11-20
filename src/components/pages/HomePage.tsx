// HomePage.tsx - CORRECT GSAP PIN IMPLEMENTATION
import { useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/sections/HeroSection";
import { useScrollStore } from "@/store/scrollStore";
import TechStackMarquee from "../sections/TechStackMarquee";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const setScrollY = useScrollStore((state) => state.setScrollY);
  const sectionRef = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    // Animate scroll to top on page load
    const scrollAnim = animate(window.scrollY, 0, {
      duration: 1,
      onUpdate: (v) => window.scrollTo(0, v),
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollAnim.stop();
    };
  }, [setScrollY]);

  // GSAP ScrollTrigger PIN effect
  useEffect(() => {
    if (!sectionRef.current || !marqueeWrapperRef.current) return;

    const section = sectionRef.current;
    const marqueeWrapper = marqueeWrapperRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top", // Pin when section center reaches viewport center
        end: "+=200%", // Stay pinned for 2 viewport heights of scrolling
        pin: marqueeWrapper, // Pin this element
        pinSpacing: true, // Add spacing to prevent layout jump
        scrub: true, // Smooth scrubbing
        // markers: true, // Uncomment for debugging
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="w-full overflow-x-hidden relative bg-linear-to-r from-background via-primary/10 to-background">
      <HeroSection />

      {/* Tech Stack Marquee Section - WITH GSAP PIN */}
      <section 
        ref={sectionRef}
        className="relative w-full mt-64 h-[340vh]"
      >
        <div 
          ref={marqueeWrapperRef}
          className="w-full h-screen flex flex-col justify-center items-center"
        >
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 1.25 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold">Tech Stack</h2>
          </motion.div>
          <TechStackMarquee />
        </div>
      </section>

      {/* Companies Visited */}
      <section className="py-20 bg-muted text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10">Companies I've Visited</h2>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-background text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-10">Gallery</h2>
      </section>
    </main>
  );
}