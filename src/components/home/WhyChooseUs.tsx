"use client";

import { motion } from "framer-motion";
import { Leaf, Clock, Star, HeartHandshake, Truck, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Only the Best Ingredients",
    description: "We use only the finest, naturally sourced ingredients for our bakes.",
  },
  {
    icon: Clock,
    title: "Handcrafted with Care",
    description: "Every item is baked fresh daily in our local kitchen.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Uncompromising standards in taste, texture, and presentation.",
  },
  {
    icon: HeartHandshake,
    title: "Custom Designs",
    description: "Personalized creations tailored specifically to your celebrations.",
  },
  {
    icon: Truck,
    title: "Fresh to Your Door",
    description: "Reliable and careful delivery right to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted locally",
    description: "Loved by hundreds of customers across Attock.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-14 md:py-24 bg-white relative overflow-hidden">
      {/* Background Arch */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-fredoka text-[28px] sm:text-[40px] md:text-[50px] font-semibold mb-3 md:mb-6 text-text-primary leading-tight"
          >
            Why Choose Attock Cake Delight
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[14px] md:text-[19px] font-normal leading-[1.6] md:leading-[1.8] text-text-secondary"
          >
            Every bite is handcrafted with premium ingredients, baked fresh daily, and made to turn your celebrations into unforgettable moments.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-bg-light rounded-3xl p-5 md:p-8 border border-border-light hover:border-gold/30 hover:shadow-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300 group flex flex-col ${
                  index >= 4 ? "hidden md:block" : "block"
                }`}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:bg-secondary transition-colors duration-300 shrink-0">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-fredoka text-[14px] sm:text-[17px] md:text-[22px] font-semibold mb-2 md:mb-3 leading-tight">{reason.title}</h3>
                <p className="text-[12px] sm:text-[13px] md:text-[16px] leading-[1.4] md:leading-[1.8] text-text-secondary">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
