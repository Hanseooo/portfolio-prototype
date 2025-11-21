// components/sections/Projects.tsx - COMPLETE FIXED VERSION
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProjectInfo } from "@/types/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ExternalLink, Github } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

// Register plugin at module level with SSR check
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Mock Data */
const mockProjects: ProjectInfo[] = [
  {
    id: "p1",
    name: "Portfolio Website",
    description:
      "Responsive portfolio with blog and projects. Built with Next.js, Tailwind and shadcn.",
    github: "https://github.com/username/portfolio",
    hostedUrl: "https://your-portfolio.example",
    images: ["/projects/portfolio/1.png", "/projects/portfolio/2.png"],
    tech: ["React", "TypeScript", "Tailwind", "shadcn"],
  },
  {
    id: "p2",
    name: "Trivia App",
    description: "Android trivia game with backend, stats and authentication.",
    github: "https://github.com/username/trivia-app",
    hostedUrl: null,
    images: ["/projects/trivia/1.png"],
    tech: ["Android", "Volley", "PHP", "MySQL"],
  },
  {
    id: "p3",
    name: "ML Classifier",
    description: "A small scikit-learn project demonstrating image classification.",
    github: null,
    hostedUrl: null,
    images: ["/projects/ml/1.png", "/projects/ml/2.png", "/projects/ml/3.png"],
    tech: ["Python", "scikit-learn"],
  },
];

/* Image Fallback */
function ImageFallback({ name }: { name?: string }) {
  return (
    <div className="flex items-center justify-center w-full h-56 md:h-64 bg-primary/10 rounded-md text-muted-foreground">
      <span className="font-medium">{name ? "No Image Available" : "No Image"}</span>
    </div>
  );
}

/* Embla Carousel */
function EmblaCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 6 });
  const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

  // AUTO-PLAY ONLY IF MORE THAN 1 IMAGE
  useEffect(() => {
    if (!emblaApi || images.length <= 1) return;

    const play = () => {
      autoPlayInterval.current = setInterval(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
      }, 3000); // 3 seconds
    };

    // start autoplay
    play();

    // pause when user interacts
    emblaApi.on("pointerDown", () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    });

    // restart when user stops interacting
    emblaApi.on("pointerUp", () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
      play();
    });

    return () => {
      if (autoPlayInterval.current) clearInterval(autoPlayInterval.current);
    };
  }, [emblaApi, images.length]);

  // FALLBACKS
  if (!images || images.length === 0) {
    return <ImageFallback name={alt} />;
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        className="w-full h-56 md:h-64 object-cover rounded-md"
      />
    );
  }

  // MULTI-IMAGE CAROUSEL
  return (
    <div className="embla w-full rounded-md overflow-hidden">
      <div ref={emblaRef} className="embla__viewport h-56 md:h-64">
        <div className="embla__container flex h-full">
          {images.map((src, idx) => (
            <div key={idx} className="embla__slide flex-[0_0_100%] h-full">
              <img
                src={src}
                alt={`${alt} ${idx + 1}`}
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-foreground/40" />
        ))}
      </div>

      <style>{`
        .embla__viewport { overflow: hidden; width: 100%; }
        .embla__container { display: flex; height: 100%; user-select: none; }
      `}</style>
    </div>
  );
}


/* ProjectCard Content */
function ProjectCardContent({ project }: { project: ProjectInfo }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="md:w-1/2 p-4">
          {project.images && project.images.length > 0 ? (
            <EmblaCarousel images={project.images} alt={project.name} />
          ) : (
            <ImageFallback name={project.name} />
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <div className="flex items-center gap-2">
              {project.hostedUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 rounded hover:bg-muted"
                      aria-label="Open hosted site"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.hostedUrl as string, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Open hosted site (new tab)</TooltipContent>
                </Tooltip>
              )}
              {project.github && (
                
                  <a href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-muted text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View GitHub"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Badge key={t} className="py-1 px-2">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Not hosted</DialogTitle>
            <DialogDescription>This project is not hosted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* FeaturedProjects Section */
export default function FeaturedProjects({ projects = mockProjects }: { projects?: ProjectInfo[] }) {
  const featured = useMemo(() => projects.slice(0, projects.length), [projects]);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current || !cardsContainerRef.current) return;

    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardsContainer.querySelectorAll<HTMLElement>(".project-card");

    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Create a timeline that triggers when section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom", // Start when section top enters viewport bottom
          end: "bottom top", // End when section bottom exits viewport top
          scrub: 1, // Smooth scrubbing
          // markers: true, // Uncomment for debugging
        },
      });

      // Animate all cards together, moving up faster than scroll
      cards.forEach((card, index) => {
        // Each card moves up at slightly different speed for depth effect
        // Negative values = move up, larger negative = faster upward movement
        const yDistance = -150 - (index * 50); // First: -150, Second: -200, Third: -250

        tl.to(
          card,
          {
            y: yDistance,
            ease: "none",
            duration: 1,
          },
          0 // All cards animate at the same time (position 0 in timeline)
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [featured]);

  return (
    <section ref={sectionRef} id="featured-projects" className="pt-6 md:pt-4 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 1.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Featured Projects</h2>

        </motion.div>
        <div ref={cardsContainerRef} className="flex flex-col gap-8 items-center">
          {featured.map((project) => (
            <article
              key={project.id}
              className="project-card backdrop-blur-xs bg-background/25 border-2 border-primary/10 rounded-2xl shadow-md overflow-hidden w-full max-w-3xl will-change-transform"
            >
              <ProjectCardContent project={project} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}