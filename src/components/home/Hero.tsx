"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const OvenIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 7h2" />
    <path d="M15 7h2" />
    <path d="M9 16c.5-.5 1-1 1.5-1s1 .5 1.5 1 .5 1 1 1 1-.5 1.5-1" />
    <path d="M9 13c.5-.5 1-1 1.5-1s1 .5 1.5 1 .5 1 1 1 1-.5 1.5-1" />
  </svg>
);

const BowlIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11h16a8 8 0 0 1-16 0z" />
    <path d="M12 4v7" />
    <path d="M9 4l3 7" />
    <path d="M15 4l-3 7" />
    <path d="M6 19h12" />
  </svg>
);

const CakeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21H4v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4Z" />
    <path d="M18 15V9a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" />
    <path d="M12 4v3" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
  </svg>
);

const gpuAcceleration = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const,
  willChange: "transform",
};

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 2.0 // Wait for preloader to finish
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE HERO SECTION (< 1024px, block lg:hidden)                          */}
      {/* Pixel-perfect match to user screenshot, removes old desktop hero image   */}
      {/* ========================================================================= */}
      <section className="block lg:hidden relative w-full h-[75vh] min-h-[550px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/mobile-view-bg.png")' }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[320px]"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/80 mb-3">
              BAKING HAPPINESS IN ATTOCK
            </p>
            <h1 className="font-fredoka text-[42px] font-semibold leading-[1.05] tracking-tight text-white mb-2">
              Made for
            </h1>
            <div className="font-fredoka text-[42px] font-medium italic text-gold leading-[1.05] mb-6">
              Sweet Moments.
            </div>

            <p className="font-poppins text-[15px] text-white/90 mb-6 font-normal leading-[1.5]">
              Fresh cakes, pastries & treats,<br />crafted with care in Kamra, Attock.
            </p>

            <div className="flex flex-col gap-4 w-full items-center">
              <Link 
                href="/shop"
                className="inline-flex items-center justify-center rounded-full text-[16px] font-semibold text-white bg-primary hover:bg-primary/90 shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-transform active:scale-95 w-full max-w-[240px] h-[54px]"
              >
                Order Now
              </Link>
              <Link 
                href="/custom-cake"
                className="inline-flex items-center justify-center rounded-full text-[15px] font-semibold text-primary bg-[#FDFBF7] border border-primary/20 hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform active:scale-95 w-full max-w-[240px] h-[50px]"
              >
                🎂 Design Your Cake
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
        >
          <button 
            onClick={() => {
              const categoriesEl = document.getElementById('mobile-categories');
              if (categoriesEl) categoriesEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <span className="text-[11px] font-medium tracking-widest uppercase font-poppins">Explore Our Collection</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* DESKTOP HERO SECTION (hidden lg:flex)                                    */}
      {/* Unchanged & pixel-identical for Desktop Site                              */}
      {/* ========================================================================= */}
      <section ref={containerRef} className="hidden lg:flex relative min-h-[100dvh] items-center pt-36 lg:pt-32 pb-16 lg:pb-4 overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10 w-full mt-4 lg:mt-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">
          
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ y: yText, ...gpuAcceleration }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            <motion.p variants={itemVariants} className="text-[13px] font-semibold uppercase tracking-[0.15em] text-primary/80 mb-4">
              BAKING HAPPINESS IN ATTOCK
            </motion.p>
            <motion.h1 variants={itemVariants} className="font-fredoka text-[38px] sm:text-[50px] md:text-[72px] lg:text-[80px] font-semibold leading-[1.05] tracking-tight mb-5 text-text-primary">
              Made for<br />
              <span className="text-[#C1A266] italic font-medium text-[34px] sm:text-[42px] md:text-[60px] lg:text-[72px]">Sweet Moments.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="font-poppins text-[16px] md:text-[19px] text-text-secondary mb-8 max-w-md mx-auto lg:mx-0 font-normal leading-[1.8]">
              Fresh cakes, pastries & treats, crafted with care in Kamra, Attock.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <MagneticWrapper strength={30}>
                <Link 
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[17px] md:text-[18px] font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto sm:min-w-[200px]"
                >
                  Fresh Bakes <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </MagneticWrapper>
              
              <MagneticWrapper strength={30}>
                <Link 
                  href="/custom-cake"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[17px] md:text-[18px] font-semibold text-text-primary bg-transparent border border-primary/40 hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto sm:min-w-[200px]"
                >
                  Custom Orders
                </Link>
              </MagneticWrapper>
            </motion.div>

            {/* Bottom Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-8 border-t border-primary/20">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-[15px] md:text-[16px] text-text-primary">Freshly Baked Daily</div>
                <div className="text-[12px] md:text-[13px] text-text-secondary">Made with love</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-[15px] md:text-[16px] text-text-primary">Premium Ingredients</div>
                <div className="text-[12px] md:text-[13px] text-text-secondary">Only the best</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-[15px] md:text-[16px] text-text-primary">Custom Cakes</div>
                <div className="text-[12px] md:text-[13px] text-text-secondary">For any celebration</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-[15px] md:text-[16px] text-text-primary">Made with Love</div>
                <div className="text-[12px] md:text-[13px] text-text-secondary">Every single day</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Editorial Visual Composition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: yImage, ...gpuAcceleration }}
            className="lg:col-span-5 relative mx-auto lg:ml-auto w-full h-[320px] sm:h-[450px] lg:h-[65vh] lg:max-h-[600px] mt-4 lg:mt-0 flex flex-col justify-center"
          >
            {/* Primary Main Arch Image */}
            <div className="absolute top-0 right-0 w-full lg:w-[90%] h-full overflow-hidden rounded-t-[250px] shadow-2xl z-10 border-[4px] border-white/30 bg-white/20 backdrop-blur-sm">
              {/* PENDING REAL PHOTO: Update with actual Attock Cake Delight interior or best-looking cake */}
              <motion.img 
                style={{ scale: scaleImage, ...gpuAcceleration }}
                src="/images/cakoo-hero-placeholder.webp" 
                alt="Attock Cake Delight Interior" 
                className="w-full h-full object-cover origin-center transition-transform duration-[3000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
            </div>
            
            {/* Foreground Croissant & Coffee (Floating Elements - hidden on <1024px for clean mobile view) */}
            <motion.div
              animate={isScrolling ? { y: 0 } : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={gpuAcceleration}
              className="hidden lg:block absolute bottom-4 left-0 w-56 h-36 overflow-hidden rounded-2xl shadow-xl z-20 border-4 border-background bg-secondary/10"
            >
              {/* PENDING REAL PHOTO: Update with actual Attock Cake Delight product photo */}
              <img 
                src="/images/cakoo-floating-placeholder.webp" 
                alt="Fresh Bakes" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Floating Menu Card - Glass UI (hidden on <1024px to prevent horizontal overflow) */}
            <motion.div
              animate={isScrolling ? { y: 0 } : { y: [0, 15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={gpuAcceleration}
              className="hidden lg:block absolute top-[15%] -right-[5%] bg-white/40 backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-30 w-64"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-fredoka font-semibold text-text-primary text-sm flex items-center gap-2">Fresh Today</p>
                <span className="text-text-secondary opacity-50 text-xs">→</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 overflow-hidden flex-shrink-0 relative">
                    {/* PENDING REAL PHOTO */}
                    <img src="/images/placeholder-custom-cakes.webp" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Custom Cakes</p>
                    <p className="text-[9px] text-text-secondary">Made to order</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 overflow-hidden flex-shrink-0 relative">
                    {/* PENDING REAL PHOTO */}
                    <img src="/images/placeholder-molten-lava.webp" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Molten Lava Cake</p>
                    <p className="text-[9px] text-text-secondary">Warm & gooey</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 overflow-hidden flex-shrink-0 relative">
                    {/* PENDING REAL PHOTO */}
                    <img src="/images/placeholder-caramel-pastry.webp" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Caramel Pastry</p>
                    <p className="text-[9px] text-text-secondary">Fan favorite</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 overflow-hidden flex-shrink-0 relative">
                    {/* PENDING REAL PHOTO */}
                    <img src="/images/placeholder-seasonal-treats.webp" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Seasonal Treats</p>
                    <p className="text-[9px] text-text-secondary">Ask in-store</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-3 border-t border-border-light text-center">
                <Link href="/shop" className="text-[10px] uppercase tracking-widest font-semibold text-primary hover:text-primary/80">See All Today's Menu →</Link>
              </div>
            </motion.div>

          </motion.div>
          
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={gpuAcceleration}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 hidden md:flex"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-text-primary to-transparent overflow-hidden relative">
          <motion.div 
            animate={{ y: [-20, 64] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={gpuAcceleration}
            className="w-full h-1/3 bg-gold absolute top-0"
          />
        </div>
      </motion.div>
    </section>
    </>
  );
}
