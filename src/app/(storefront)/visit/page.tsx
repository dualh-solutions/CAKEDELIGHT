"use client";

import { motion } from "framer-motion";
import { BRANCHES } from "@/lib/store/branchStore";
import { MapPin, Clock, Navigation, Car, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl md:text-5xl font-bold mb-4 text-text-primary"
          >
            Visit Our Bakery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Experience the aroma of freshly baked goods and pick up your handcrafted creations at our premium location in Attock.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
          {Object.values(BRANCHES).map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-border-light shadow-sm flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-fredoka text-2xl font-bold">{branch.name}</h2>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{branch.shortName} Flagship</p>
                </div>
              </div>

              <div className="space-y-6 flex-grow mb-8">
                <div className="flex gap-4">
                  <Navigation className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground text-sm">{branch.address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Opening Hours</h3>
                    <p className="text-muted-foreground text-sm">Mon - Sun: 9:00 AM - 11:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Car className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Parking</h3>
                    <p className="text-muted-foreground text-sm">Ample free parking available directly in front of the bakery.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Delivery Radius</h3>
                    <p className="text-muted-foreground text-sm">Serving up to 15km radius from this location.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border-light mt-auto">
                <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 py-6">
                    Get Directions
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
