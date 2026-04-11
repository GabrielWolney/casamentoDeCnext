"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Foto {
  id: string;
  image_url: string;
  ordem: number;
}

function CarouselImage({
  url,
  index,
  isPriority,
}: {
  url: string;
  index: number;
  isPriority: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 overflow-hidden z-10 rounded-2xl">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      )}
      <Image
        src={url}
        alt={`Foto ${index + 1} do casal`}
        fill
        className={`object-cover rounded-2xl transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 65vw, 260px"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}

export default function PhotoCarousel() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadFotos() {
      const { data } = await supabase
        .from("galeria")
        .select("*")
        .order("ordem", { ascending: true });

      if (data) setFotos(data);
      setLoading(false);
    }
    loadFotos();
  }, []);

  const skeletonArray = Array.from({ length: 5 }).map((_, i) => ({
    id: `skeleton-${i}`,
    image_url: "",
    ordem: i,
  }));

  const items = loading ? skeletonArray : fotos;
  const n = items.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % n);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + n) % n);

  const handleSwipe = (e: Event, { offset }: PanInfo) => {
    if (offset.x < -40) nextSlide();
    if (offset.x > 40) prevSlide();
  };
  
  
  const variants = {
    center:      { x: "0%",    scale: 1,    zIndex: 50, opacity: 1,   rotateY: 0  },
    right1:      { x: "70%",   scale: 0.85, zIndex: 40, opacity: 1,   rotateY: -15 },
    left1:       { x: "-70%",  scale: 0.85, zIndex: 40, opacity: 1,   rotateY: 15  },
    right2:      { x: "130%",  scale: 0.7,  zIndex: 30, opacity: 0.6, rotateY: -25 },
    left2:       { x: "-130%", scale: 0.7,  zIndex: 30, opacity: 0.6, rotateY: 25  },
    hiddenRight: { x: "160%",  scale: 0.5,  zIndex: 10, opacity: 0,   rotateY: -30 },
    hiddenLeft:  { x: "-160%", scale: 0.5,  zIndex: 10, opacity: 0,   rotateY: 30  },
  };

  if (!loading && fotos.length === 0) return null;

  return (
    <div className="relative w-full max-w-[100vw] overflow-hidden group">
      <div
        className="relative w-full h-[360px] md:h-[400px] flex items-center justify-center"
        style={{
          perspective: "1000px"
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer { 100% { transform: translateX(100%); } }
        `}} />

        {items.map((item, index) => {
          let diff = index - currentIndex;
          if (diff > Math.floor(n / 2)) diff -= n;
          else if (diff < -Math.floor(n / 2)) diff += n;

          let variant = "center";
          if (diff === 1)       variant = "right1";
          else if (diff === -1) variant = "left1";
          else if (diff === 2)  variant = "right2";
          else if (diff === -2) variant = "left2";
          else if (diff > 2)    variant = "hiddenRight";
          else if (diff < -2)   variant = "hiddenLeft";

          if (n === 2 && diff === -1) variant = "right1";

          const isCenter = diff === 0;

          return (
            <motion.div
              key={item.id}
              variants={variants}
              animate={variant}
              initial={false}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={isCenter ? handleSwipe : undefined}
              onPanEnd={!isCenter ? handleSwipe : undefined}
              onClick={() => {
                if (!isCenter && !loading) setCurrentIndex(index);
              }}
              className={`absolute shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-4 border-white/90 bg-gray-200 rounded-2xl ${
                isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              }`}
              style={{
                width: "min(65vw, 260px)",
                aspectRatio: "3/4",
                /*
                  transformStyle: "preserve-3d" was here before.
                  It was REMOVED because:
                  - The cards have no back face, so preserve-3d adds nothing visual.
                  - preserve-3d is designed to cross stacking-context boundaries,
                    which means Chrome promotes these cards to compositor layers
                    that ignore z-index ordering and appear above position:fixed
                    elements (the Navbar) during scroll tile compositing.
                  - Removing it lets the rotateY effect work normally while keeping
                    these layers properly contained below the Navbar.
                */
              }}
            >
              {loading ? (
                <div className="w-full h-full rounded-2xl" />
              ) : (
                <CarouselImage
                  url={item.image_url}
                  index={index}
                  isPriority={Math.abs(diff) <= 1}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm text-[#1278BC] rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm text-[#1278BC] rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}