"use client";

import { motion } from "framer-motion";

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border-light shadow-sm prose prose-sage max-w-none"
        >
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold mb-8 text-text-primary">
            Delivery Policy
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            At Attock Cake Delight, we take the utmost care to ensure your handcrafted creations reach you in perfect condition. Please review our delivery guidelines below.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Delivery Areas & Times</h3>
          <p className="text-muted-foreground mb-6">
            We currently deliver within a 15km radius of our Attock location. Our delivery hours are between 10:00 AM and 10:00 PM, Monday through Sunday. You can select your preferred 2-hour delivery window during checkout.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Delivery Charges</h3>
          <p className="text-muted-foreground mb-6">
            A standard delivery fee of Rs. 300 applies to all orders within our primary delivery zones. We offer complimentary free delivery on all orders exceeding Rs. 3000.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Receiving Your Order</h3>
          <p className="text-muted-foreground mb-6">
            Because our products are perishable and delicate, someone must be present at the delivery address to receive the order during the scheduled time slot. If no one is available, the driver will attempt to contact you. After 15 minutes of waiting, the order will be returned to the branch for pickup, and the delivery fee will not be refunded.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Handling & Care</h3>
          <p className="text-muted-foreground mb-6">
            Once the cake is handed over, the responsibility for its condition passes to the customer. Please ensure it is transported on a flat surface (like a car floorboard, not a slanted car seat) and kept in a cool environment away from direct sunlight.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
