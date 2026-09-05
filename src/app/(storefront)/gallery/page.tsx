"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Camera, Loader2 } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const CATEGORIES = ["All", "Cake", "Desserts", "Interior", "Events", "Wedding", "Custom Cakes"];

interface GalleryItem {
  id: string;
  url: string;
  category: string;
  type: string;
  title: string;
  section?: string;
  createdAt: number;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const fetchedItems: GalleryItem[] = [];
      snapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() } as GalleryItem);
      });
      // Sort by newest first
      fetchedItems.sort((a, b) => b.createdAt - a.createdAt);
      setItems(fetchedItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const galleryItems = items.filter(item => !item.section || item.section === "gallery");
  const filteredItems = galleryItems.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  const getSpan = (index: number) => {
    // Dynamic masonry pattern
    const pattern = [
      "md:col-span-2 md:row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "md:col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "md:col-span-2 md:row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-[10px] tracking-widest uppercase text-primary font-semibold mb-6">
            Visual Diary
          </span>
          <h1 className="font-fredoka text-[50px] md:text-[70px] leading-[1] text-text-primary mb-6">
            The Gallery
          </h1>
          <p className="font-poppins text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            A curated collection of our finest creations, elegant interiors, and memorable events. Handcrafted art you can taste.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-text-primary text-white shadow-md transform scale-105" 
                  : "bg-white text-muted-foreground hover:bg-black/5 hover:text-text-primary border border-border-light"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry / Instagram Style Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                  className={`relative group rounded-2xl overflow-hidden bg-card ${getSpan(index)}`}
                >
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col items-center justify-center gap-4">
                    {item.type === 'video' ? (
                      <Play className="w-12 h-12 text-white fill-white/20 transform scale-50 group-hover:scale-100 transition-transform duration-500" />
                    ) : (
                      <Camera className="w-10 h-10 text-white transform scale-50 group-hover:scale-100 transition-transform duration-500" />
                    )}
                    <span className="text-white font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {item.category}
                    </span>
                  </div>
                  
                  <img
                    src={item.url}
                    alt={item.title || item.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/cakoo-hero-placeholder.webp" }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No media found for this category yet.</p>
          </div>
        )}

      </div>
    </div>
  );
}
