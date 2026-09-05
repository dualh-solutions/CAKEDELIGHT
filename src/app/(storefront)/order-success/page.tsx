"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="bg-bg-light min-h-screen max-md:pt-0 pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-16 text-center border border-border-light shadow-lg relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10"
          >
            <CheckCircle2 className="w-12 h-12 text-success" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <h1 className="font-fredoka text-4xl md:text-5xl font-bold mb-4 text-text-primary">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Thank you for choosing Attock Cake Delight. Your order has been received and is being processed.
            </p>

            <div className="bg-bg-light rounded-2xl p-6 mb-10 border border-border-light text-left max-w-sm mx-auto">
              <div className="flex items-center gap-3 mb-4 text-text-primary font-medium">
                <Package className="w-5 h-5 text-gold" /> Order Details
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-semibold">#BLN-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-success font-semibold">Processing</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="block sm:inline-block">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 px-8">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="block sm:inline-block">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-border-light hover:bg-secondary/20 px-8">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
