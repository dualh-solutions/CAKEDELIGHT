"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to Attock Cake Delight!");
      setEmail("");
    }
  };

  return (
    <section className="py-8 md:py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-secondary/30 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-20 relative overflow-hidden text-center max-w-5xl mx-auto border border-border-light"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-fredoka text-[24px] sm:text-[36px] md:text-[50px] font-semibold mb-6 md:mb-4 text-text-primary leading-tight">Join the Attock Cake Delight Family</h2>
            <p className="hidden md:block text-[14px] md:text-[19px] font-normal leading-[1.6] md:leading-[1.8] text-text-secondary mb-6 md:mb-8">
              Sign up for sweet updates, new flavor drops, and special treats sent straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full px-6 py-5 md:py-6 bg-white border-none shadow-sm text-[15px] md:text-[16px] focus-visible:ring-gold flex-grow placeholder:text-text-secondary/50 text-text-primary w-full"
                required
              />
              <Button type="submit" size="lg" className="rounded-full px-8 py-5 md:py-6 bg-text-primary text-primary-foreground hover:bg-text-primary/90 text-[16px] sm:text-[17px] md:text-[18px] font-semibold w-full sm:w-auto">
                Keep Me Updated
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
