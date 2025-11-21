import  { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useScrollStore } from "@/store/scrollStore";
import { Button } from "@/components/ui/button";
import meBg from "@/assets/images/me-bg.png";
import me from "@/assets/images/me.png";
import waves from "@/assets/svg/topography.svg";

const NAME = "Hans Amoguis";
const TAGLINE = "Full-Stack Developer";

export default function HeroSection() {
  const scrollY = useScrollStore((s) => s.scrollY);

  const bgTranslate = useMotionValue(0);
  const heroTranslate = useMotionValue(0);
  const nameTranslate = useMotionValue(0);
  const taglineTranslate = useMotionValue(0);
  const buttonTranslate = useMotionValue(0);
  const heroPortraitTranslate = useMotionValue(0);


  useEffect(() => {
    const bgTarget = scrollY * 0.1;
    const heroTarget = scrollY * 0.24;
    const nameTarget = scrollY * 0.65; // Name scrolls fastest
    const taglineTarget = scrollY * 0.75; // Tagline scrolls slower
    const buttonTarget = scrollY * 0.8;
    const heroPortraitTarget = scrollY * 0.7;

    const bgAnim = animate(bgTranslate, bgTarget, { type: "spring", stiffness: 50, damping: 20 });
    const heroAnim = animate(heroTranslate, heroTarget, { type: "spring", stiffness: 50, damping: 20 });
    const nameAnim = animate(nameTranslate, nameTarget, { type: "spring", stiffness: 50, damping: 20 });
    const taglineAnim = animate(taglineTranslate, taglineTarget, { type: "spring", stiffness: 50, damping: 20 });
    const buttonAnim = animate(buttonTranslate, buttonTarget, { type: "spring", stiffness: 50, damping: 20 });
    const heroPortraitAnim = animate(heroPortraitTranslate, heroPortraitTarget, { type: "spring", stiffness: 50, damping: 20 });


    return () => {
      bgAnim.stop();
      heroAnim.stop();
      nameAnim.stop();
      taglineAnim.stop();
      buttonAnim.stop();
      heroPortraitAnim.stop();
    };
  }, [scrollY, bgTranslate, heroTranslate, nameTranslate, taglineTranslate, buttonTranslate, heroPortraitTranslate]);

  return (
    <section className="relative w-full border-b-2 border-primary/15 min-h-screen h-[2vh] pb-4 overflow-hidden flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-16 lg:px-24 min-w-60"
      style={{
        backgroundImage: `url(${waves})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "cover",
    }}
    >
      {/* Left Text & CTA */}
      <div className="z-20 w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-foreground"
            style={{ y: nameTranslate }}
          >
            {NAME}
          </motion.h1>

          <motion.p
            className="mt-4 text-xl md:text-3xl font-medium text-muted-foreground"
            style={{ y: taglineTranslate }}
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
            style={{ y: buttonTranslate }}
          >
            <Button asChild>
              <a href="#projects-section" className="w-full md:w-auto text-center">See Projects</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact" className="w-full md:w-auto text-center">Github</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Hero Portrait */}
      <div className="relative w-full md:w-1/2 flex justify-center md:justify-end items-center mt-12 md:mt-0"
      >
        <motion.div
          className="relative overflow-hidden rounded-full"
          style={{
            width: "clamp(200px, 42vw, 420px)",
            height: "clamp(200px, 42vw, 420px)",
            clipPath: "circle(50% at 50% 50%)",
            y: heroPortraitTranslate
          }}
        >
          {/* Zoomed background */}
          <motion.img
            src={meBg}
            alt="Background"
            className="absolute bottom-18 left-0 w-full h-full object-cover select-none"
            style={{ y: bgTranslate, scale: 1.75 }}
            draggable={false}
          />
          {/* Zoomed hero */}
          <motion.img
            src={me}
            alt="Hans Amoguis"
            className="absolute bottom-15 left-0 w-full h-full object-contain select-none"
            style={{ y: heroTranslate, scale: 1.75 }}
            draggable={false}
          />
        </motion.div>
        </div>
    </section>
  );
}
