"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CELEBRATIONS = [
  {
    title: "Wedding Cakes",
    description: "The breathtaking centerpiece for your most important day. Multi-tiered elegance tailored to your aesthetic.",
    image: "/images/cat_wedding_1783112161369.png",
  },
  {
    title: "Birthday Cakes",
    description: "From intimate gatherings to grand milestones, make every birthday unforgettable with handcrafted joy.",
    image: "/images/cat_birthday_1783112152320.png",
  },
  {
    title: "Anniversary Cakes",
    description: "Celebrate enduring love with sophisticated, timeless designs that honor your journey.",
    image: "/images/prod_gold_leaf_1783112275495.png",
  },
  {
    title: "Engagement & Bridal",
    description: "Elegant, delicate creations to mark the beginning of your beautiful forever.",
    image: "/images/cat_wedding_1783112161369.png",
  },
  {
    title: "Baby Showers",
    description: "Welcome new life with whimsical, joyful designs that capture the magic of the moment.",
    image: "/images/prod_bento_cake_1783112265061.png",
  },
  {
    title: "Corporate & Seasonal",
    description: "Premium branded confections for corporate events, plus exclusive Ramadan and Eid collections.",
    image: "/images/cat_gift_boxes_1783112178444.png",
  }
];

export default function CelebrationsPage() {
  return (
    <div className="min-h-screen bg-background max-md:pt-0 pt-32 pb-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Header Story */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-[10px] tracking-widest uppercase text-primary font-semibold mb-6">
            Attock Cake Delight Experiences
          </span>
          <h1 className="font-fredoka text-[44px] md:text-[60px] leading-[1] text-text-primary mb-8">
            Every Moment <br/> <span className="text-gold italic font-light">Worth Celebrating</span>
          </h1>
          <p className="font-poppins text-text-secondary text-base md:text-lg font-medium tracking-wide leading-relaxed">
            At Attock Cake Delight, we believe a cake is more than dessert—it is the focal point of your memories. 
            From grand weddings to intimate milestones, our creations are meticulously designed to tell your unique story.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 mb-24">
          {CELEBRATIONS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index % 2 === 0 ? 0 : 0.2 }}
              className={`group flex flex-col ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <h3 className="font-fredoka text-3xl font-semibold text-text-primary mb-3">
                {item.title}
              </h3>
              <p className="font-poppins text-text-secondary leading-relaxed mb-6">
                {item.description}
              </p>
              <Link href={`/shop?category=${encodeURIComponent(item.title)}`} className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors w-fit">
                Explore Collection <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Custom Cake Studio CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden bg-card border border-cream p-12 md:p-24 text-center"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-fredoka text-4xl md:text-5xl font-semibold text-text-primary mb-6">
              Bring Your Vision to Life
            </h2>
            <p className="font-poppins text-text-secondary text-base mb-10 leading-relaxed">
              Looking for something completely bespoke? Our Custom Cake Studio works intimately with you to design a show-stopping masterpiece that perfectly captures the essence of your event.
            </p>
            <Link 
              href="/custom-cake"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 text-sm font-medium text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              Enter the Studio <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,195,155,0.1)_0%,transparent_70%)] pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
