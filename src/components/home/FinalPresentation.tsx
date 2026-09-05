"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Increase Online Orders",
  "Premium Brand Image",
  "Mobile Shopping Experience",
  "Cake Customization",
  "Direct Online Ordering",
  "Faster Customer Service",
  "Customer Loyalty",
  "Better Conversion Rate",
  "Future Admin Dashboard",
  "Business Analytics"
];

export function FinalPresentation() {
  return (
    <section className="py-32 bg-text-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mint-primary/10 via-text-primary to-text-primary pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-semibold uppercase tracking-widest text-sm mb-4 block"
          >
            Business Proposal
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
          >
            Why This Website Will Grow Attock Cake Delight
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-gold mx-auto rounded-full"
          />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 hover:bg-white/10 hover:border-gold/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-gold" />
              </div>
              <p className="font-poppins font-medium text-lg text-white/90">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
