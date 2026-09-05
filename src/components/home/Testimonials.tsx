"use client";

import { motion } from "framer-motion";
import { Star, Quote, Sparkles, Award, CheckCircle2, Users } from "lucide-react";
import CircularGallery from "@/components/ui/CircularGallery";

const reviewsData = [
  {
    name: "Ayesha K.",
    role: "Regular Customer",
    location: "Attock",
    content: "The Lotus Biscoff cake from Attock Cake Delight is literally the best cake I've had in Attock. It looks so premium, moist, and tastes even better. Their packaging is gorgeous too!",
    rating: 5,
    cakeName: "Lotus Biscoff Cake",
    cakeImage: "/images/prod_lotus_biscoff_1783112213131.png",
    text: "Ayesha K. • ★★★★★"
  },
  {
    name: "Usman A.",
    role: "Event Planner",
    location: "Islamabad & Wah",
    content: "I always recommend Attock Cake Delight to my clients for weddings and engagements. The custom multi-tier cakes are a work of art, and incredibly reliable!",
    rating: 5,
    cakeName: "Gold Leaf Signature",
    cakeImage: "/images/prod_gold_leaf_1783112275495.png",
    text: "Usman A. • ★★★★★"
  },
  {
    name: "Fatima M.",
    role: "Birthday Celebration",
    location: "Attock",
    content: "Ordered the Ferrero Rocher cake for my husband's birthday. Not only did it look absolutely stunning with golden hazelnuts, but the Belgian chocolate taste was out of this world!",
    rating: 5,
    cakeName: "Ferrero Rocher Cake",
    cakeImage: "/images/prod_ferrero_rocher_1783112221919.png",
    text: "Fatima M. • ★★★★★"
  },
  {
    name: "Zainab R.",
    role: "Dessert Lover",
    location: "Taxila",
    content: "Their red velvet cake and premium dessert boxes are my absolute go-to gift for any family occasion. Always freshly baked, perfectly sweet, and visually so pleasing.",
    rating: 5,
    cakeName: "Red Velvet Dream",
    cakeImage: "/images/prod_red_velvet_1783112239348.png",
    text: "Zainab R. • ★★★★★"
  },
  {
    name: "Hamza T.",
    role: "Wedding Client",
    location: "Attock",
    content: "Attock Cake Delight designed our wedding cake exactly from our moodboard. Every guest asked where the cake was from! Truly outstanding quality.",
    rating: 5,
    cakeName: "Pistachio Dream",
    cakeImage: "/images/prod_pistachio_dream_1783112230661.png",
    text: "Hamza T. • ★★★★★"
  },
  {
    name: "Sara R.",
    role: "Foodie & Blogger",
    location: "Rawalpindi",
    content: "The strawberry cheesecake is perfection—creamy, rich, and topped with fresh organic strawberries. Hands down the finest bakery in the Twin Cities region!",
    rating: 5,
    cakeName: "Strawberry Cheesecake",
    cakeImage: "/images/prod_strawberry_cheesecake_1783112291552.png",
    text: "Sara R. • ★★★★★"
  },
  {
    name: "Bilal A.",
    role: "Loyal Patron",
    location: "Attock",
    content: "I've been buying birthday cakes from here for 4 years now. The Bento cakes are super cute, and the chocolate truffle never disappoints. 10/10 quality every single time!",
    rating: 5,
    cakeName: "Bento Cake Box",
    cakeImage: "/images/prod_bento_cake_1783112265061.png",
    text: "Bilal A. • ★★★★★"
  },
  {
    name: "Mahnoor A.",
    role: "Corporate Client",
    location: "POF Attock",
    content: "We ordered 50 customized dessert boxes for our annual corporate meetup. Beautiful presentation, seamless delivery, and incredible feedback from our executive team.",
    rating: 5,
    cakeName: "Chocolate Truffle",
    cakeImage: "/images/prod_choc_truffle_1783112196918.png",
    text: "Mahnoor A. • ★★★★★"
  },
];

export function Testimonials() {
  return (
    <section className="py-14 md:py-24 bg-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          <Quote className="w-10 h-10 md:w-12 md:h-12 text-gold/60 mb-3 md:mb-4" />
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-fredoka text-[28px] sm:text-[38px] md:text-[50px] font-semibold mb-2 md:mb-3 text-text-primary leading-tight"
          >
            Sweet Words from Sweet People
          </motion.h2>
          <p className="text-[13px] md:text-[19px] font-normal leading-[1.6] md:leading-[1.8] text-text-secondary max-w-2xl mx-auto flex items-center justify-center gap-1.5 md:gap-2">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold inline" />
            <span className="hidden md:inline">Interactive 3D Customer Reviews Circle — Drag or Scroll to Read Every Review!</span>
            <span className="md:hidden">Swipe across our customer stories and reviews!</span>
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold inline" />
          </p>
        </div>

        {/* MOBILE VIEW (< 768px): Single-card swipeable carousel with peek & pagination dots */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto flex gap-4 pb-3 mb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {reviewsData.map((review, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[320px] flex-shrink-0 snap-center bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col justify-between transform rotate-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                
                <p className="font-poppins text-[13.5px] leading-[1.6] text-text-secondary mb-4 italic">
                  "{review.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-border-light flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={review.cakeImage}
                    alt={review.cakeName}
                    className="w-10 h-10 rounded-full object-cover border border-gold/30"
                  />
                  <div>
                    <h4 className="font-fredoka text-[14px] font-semibold text-text-primary leading-tight">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">{review.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-gold-dark block">{review.cakeName}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="w-2 flex-shrink-0" />
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mb-10 md:hidden">
          {reviewsData.slice(0, 5).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-4 bg-primary" : "w-1.5 bg-primary/30"
              }`}
            />
          ))}
        </div>

        {/* DESKTOP VIEW (>= 768px): 3D WebGL CircularGallery of Review Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:block w-full h-[620px] relative mb-16 rounded-3xl overflow-hidden"
        >
          <CircularGallery
            items={reviewsData}
            bend={3}
            textColor="#48341B"
            borderRadius={0.06}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </motion.div>

        {/* Trust & Quality Statistics Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-border-light text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-2 md:mb-4 text-gold-dark">
              <Star className="w-5 h-5 md:w-6 md:h-6 fill-gold text-gold" />
            </div>
            <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-text-primary mb-0.5 md:mb-1">4.9 / 5.0</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Average Customer Rating</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-border-light text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-2 md:mb-4 text-gold-dark">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-text-primary mb-0.5 md:mb-1">600+</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Happy Customers in Attock</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-border-light text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-2 md:mb-4 text-gold-dark">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-text-primary mb-0.5 md:mb-1">100%</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Fresh Baked Guaranteed</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-border-light text-center shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-2 md:mb-4 text-gold-dark">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="font-fredoka text-2xl md:text-3xl font-bold text-text-primary mb-0.5 md:mb-1">Verified</h3>
            <p className="text-xs md:text-sm text-text-secondary font-medium">Authentic Client Reviews</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
