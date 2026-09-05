"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function InstagramGallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const urls: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.url && data.section === "community") urls.push(data.url);
      });
      setImages(urls.slice(0, 6));
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className={`${images.length === 0 ? "py-6 md:py-24" : "py-8 md:py-24"} bg-white`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-4 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center"
          >
            <Camera className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground mb-2 md:mb-4" />
            <h2 className="font-fredoka text-2xl sm:text-3xl md:text-4xl font-bold mb-1.5 md:mb-3">Join Our Community</h2>
            <p className="text-muted-foreground text-xs md:text-base">Follow <a href="#" className="text-text-primary font-semibold hover:text-gold transition-colors">@attockcakedelight</a> on Instagram</p>
          </motion.div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-4 md:py-12 bg-slate-50 rounded-xl md:rounded-2xl border border-dashed border-slate-200">
            <p className="text-muted-foreground text-xs md:text-sm">No community pictures added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-1 md:gap-4">
            {images.map((img, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted block"
              >
                <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary-foreground" />
                </div>
                <img
                  src={img}
                  alt="Instagram post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
                />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
