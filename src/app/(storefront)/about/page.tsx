"use client";

import { motion } from "framer-motion";
import { Star, Heart, Award, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen max-md:pt-0 pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-gold font-semibold uppercase tracking-widest text-sm mb-4 block">
            Our Story
          </span>
          <h1 className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary leading-tight">
            Baking Memories in Attock Since 2018
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Attock Cake Delight began with a simple passion: to bring premium, handcrafted, and visually stunning baked goods to our community. What started in a small home kitchen has now blossomed into a beloved boutique bakery where every creation tells a story.
          </p>
        </motion.div>
      </section>

      {/* Image Banner */}
      <section className="mb-24 px-4 md:px-6">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-[40vh] md:h-[60vh] rounded-[3rem] overflow-hidden bg-secondary/20 relative"
          >
            <img 
              src="/images/super-sweets-storefront.jpg" 
              alt="Attock Cake Delight Storefront in Attock" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/cakoo-hero-placeholder.webp" }}
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 md:px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-light p-10 md:p-14 rounded-3xl border border-border-light relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/30 rounded-bl-full pointer-events-none" />
            <Star className="w-10 h-10 text-gold mb-6" />
            <h2 className="font-fredoka text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To elevate everyday celebrations with exceptional baked goods that combine artistry, premium ingredients, and unparalleled taste. We strive to create moments of joy for our customers through every slice.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/10 p-10 md:p-14 rounded-3xl border border-secondary/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-bl-full pointer-events-none" />
            <Sparkles className="w-10 h-10 text-gold mb-6" />
            <h2 className="font-fredoka text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To be the most trusted and celebrated boutique bakery in Pakistan, recognized for our commitment to quality, innovative designs, and the heartfelt connection we build with our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Ingredients */}
      <section className="bg-text-primary text-primary-foreground py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mint-primary/10 via-text-primary to-text-primary pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Award className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="font-fredoka text-4xl md:text-5xl font-bold mb-6 text-white">
              The Attock Cake Delight Standard
            </h2>
            <p className="text-white/70 text-lg">
              We never compromise. Our recipes rely on the integrity of our ingredients. 
              Real butter, pure vanilla, imported Belgian chocolate, and farm-fresh eggs are the foundation of everything we bake.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}
