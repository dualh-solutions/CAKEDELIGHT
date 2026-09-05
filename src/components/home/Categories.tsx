"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

// Map categories to some representative images we have or placeholders
const categoryImages: Record<string, string> = {
  "Birthday Cakes": "/images/cat_birthday_1783112152320.png",
  "Wedding Cakes": "/images/cat_wedding_1783112161369.png",
  "Anniversary Cakes": "/images/prod_gold_leaf_1783112275495.png",
  "Cupcakes": "/images/cat_birthday_1783112152320.png",
  "Brownies": "/images/cat_brownies_1783112170945.png",
  "Desserts": "/images/prod_macarons_1783112256364.png",
  "Gift Boxes": "/images/cat_gift_boxes_1783112178444.png",
  "Seasonal Specials": "/images/prod_strawberry_cheesecake_1783112291552.png",
  "Cakes World": "/images/cat_birthday_1783112152320.png",
  "Special Cakes": "/images/cat_wedding_1783112161369.png",
  "Dream Cakes": "/images/cat_brownies_1783112170945.png",
  "Donuts": "/images/prod_macarons_1783112256364.png",
  "Bakery Items & Desserts": "/images/prod_macarons_1783112256364.png",
};

export function Categories() {
  const { categories: storeCategories, fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section id="mobile-categories" className="py-14 md:py-24 bg-card relative rounded-t-[2.5rem] md:rounded-t-[3rem] -mt-8 md:-mt-12 z-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-end max-md:items-start mb-8 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="font-fredoka text-[26px] sm:text-[34px] md:text-[50px] font-semibold mb-2 md:mb-3 text-text-primary flex items-center gap-3">
              Cravings by Category
            </h2>
            <p className="text-text-secondary text-[14px] md:text-[19px] font-normal leading-[1.6] md:leading-[1.8] tracking-wide">Find your perfect sweet treat from our daily handcrafted menu.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 md:mt-0 hidden md:block"
          >
            <Link href="/shop" className="group flex items-center text-primary font-semibold text-[16px] md:text-[17px] tracking-wide hover:text-primary/80 transition-colors">
              Browse Our Full Menu <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden mb-8">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Search Cakes..." 
              className="w-full h-14 pl-12 pr-4 rounded-[20px] bg-white border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/shop?search=${encodeURIComponent(e.currentTarget.value)}`;
                }
              }}
            />
          </div>
        </div>

        {/* MOBILE VIEW (< 768px): Horizontally scrollable swipeable compact cards */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto flex gap-3.5 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {storeCategories.slice(0, 4).map((category, index) => (
            <Link
              key={category}
              href={`/shop?category=${encodeURIComponent(category)}`}
              className="w-[135px] sm:w-[150px] flex-shrink-0 bg-white rounded-2xl p-2.5 shadow-sm border border-black/5 flex flex-col group hover:shadow-md transition-all"
            >
              <div className="w-full h-[100px] rounded-xl overflow-hidden mb-2 bg-[#FAF6EB]">
                <img
                  src={categoryImages[category] || "/images/hero_bakery_1783112143212.png"}
                  alt={category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-[13px] sm:text-[14px] font-medium text-text-primary leading-tight line-clamp-1 mb-1">
                {category}
              </div>
              <div className="text-[11px] font-semibold text-primary flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>Explore →</span>
              </div>
            </Link>
          ))}
          {/* Padding element so last card peeks off right edge cleanly */}
          <div className="w-2 flex-shrink-0" />
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-2 md:hidden">
          {storeCategories.slice(0, 4).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-4 bg-primary" : "w-1.5 bg-primary/30"
              }`}
            />
          ))}
        </div>

        {/* DESKTOP VIEW (>= 768px): Original 4-card grid unchanged */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeCategories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/shop?category=${encodeURIComponent(category)}`} className="block group">
                <div className="relative h-[220px] overflow-hidden rounded-3xl bg-[#EBE7DF] hover:bg-[#E2DDD3] transition-colors duration-500 border border-black/5">
                  {/* Top Left Text */}
                  <div className="absolute top-6 left-6 z-20">
                    <h3 className="font-fredoka font-semibold text-[20px] md:text-[22px] text-text-primary mb-1">{category}</h3>
                    <p className="text-[14px] md:text-[15px] text-text-secondary font-medium tracking-wide">Explore</p>
                  </div>
                  
                  {/* Bottom Left Button */}
                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:bg-text-primary transition-colors duration-300">
                      <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom Right Image */}
                  <div className="absolute -bottom-4 -right-4 w-44 h-44 rounded-full overflow-hidden mix-blend-multiply opacity-90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                    <img
                      src={categoryImages[category] || "/images/hero_bakery_1783112143212.png"}
                      alt={category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
