"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/mockData";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isWishlisted } = useWishlistStore();
  const isFavorite = isWishlisted(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  // Get the actual product image
  const imageSrc = product.images?.[0] || "/images/hero_bakery_1783112143212.png";

  // If mock data doesn't have availability yet, default to true for both to prevent breaking
  const availability = product.availability || { 'attock': true, 'kamra': true };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="bg-[#FCFBF8] rounded-[24px] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col group/card">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-black/5">
            {/* Desktop Badges (hidden on mobile) */}
            <div className="hidden md:flex absolute top-4 left-4 z-20 flex-col gap-2">
              {product.isNew && (
                <span className="bg-text-primary text-white text-[9px] font-semibold px-3 py-1 uppercase tracking-widest rounded-full shadow-md backdrop-blur-md">
                  Fresh Arrival
                </span>
              )}
              {product.isPopular && (
                <span className="bg-white/90 text-text-primary text-[9px] font-semibold px-3 py-1 uppercase tracking-widest rounded-full shadow-md backdrop-blur-md">
                  Customer Favourite
                </span>
              )}
            </div>

            {/* Desktop Wishlist (hidden on mobile) */}
            <div className="hidden md:flex absolute top-4 right-4 z-20 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <Button 
                size="icon" 
                variant="ghost" 
                className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm border transition-colors ${isFavorite ? 'border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive' : 'border-black/5 text-text-primary hover:bg-white hover:text-primary'}`} 
                onClick={toggleWishlist}
              >
                <Heart className={`w-[18px] h-[18px] ${isFavorite ? 'fill-destructive' : ''}`} />
              </Button>
            </div>

            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
            />
            
            {/* Desktop Quick Add Button (hidden on mobile) */}
            <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent items-end">
              <Button 
                className="w-full rounded-full bg-white text-text-primary hover:bg-primary hover:text-white transition-colors shadow-xl h-11 min-h-[44px] text-[14px] font-semibold tracking-wide"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Box
              </Button>
            </div>
          </div>

          {/* Desktop Details (hidden on mobile) */}
          <div className="hidden md:flex p-5 flex-col flex-grow bg-[#FCFBF8]">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-[14px] h-[14px] fill-gold text-gold" />
              <span className="text-xs font-medium text-text-primary">{product.rating}</span>
            </div>
            
            <h3 className="font-fredoka text-[20px] font-semibold text-text-primary line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-300 leading-snug">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[11px] text-text-secondary font-medium flex items-center">
                📍 {availability['attock'] ? 'Attock' : ''}{availability['attock'] && availability['kamra'] ? ' • ' : ''}{availability['kamra'] ? 'Kamra' : ''}
              </span>
            </div>

            <p className="font-poppins text-[13px] leading-[1.6] text-text-secondary mb-4 line-clamp-2 flex-grow">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light">
              <span className="font-poppins font-semibold text-[17px] text-text-primary tracking-wide">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Mobile Details (hidden on desktop) */}
          <div className="flex md:hidden p-3.5 flex-col flex-grow bg-[#FCFBF8] gap-3">
            {/* Rating & Wishlist */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span className="text-xs font-medium text-text-primary">{product.rating}</span>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className={`w-8 h-8 rounded-full transition-colors ${isFavorite ? 'text-destructive bg-destructive/10' : 'text-text-secondary bg-black/5 hover:bg-black/10'}`} 
                onClick={toggleWishlist}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive' : ''}`} />
              </Button>
            </div>

            {/* Product Name */}
            <h3 className="font-fredoka text-[15px] font-semibold text-text-primary line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Mobile Badges */}
            {(product.isNew || product.isPopular) && (
              <div className="flex flex-wrap gap-1.5">
                {product.isNew && (
                  <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                    🆕 New Arrival
                  </span>
                )}
                {product.isPopular && (
                  <span className="bg-amber-100/50 text-amber-700 border border-amber-200/50 text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                    🔥 Best Seller
                  </span>
                )}
              </div>
            )}

            {/* Price (Larger, more prominent) */}
            <div className="font-poppins font-bold text-[17px] text-primary tracking-wide mt-auto">
              Rs. {product.price.toLocaleString()}
            </div>

            {/* Add to Box Button */}
            <Button 
              className="w-full rounded-full bg-text-primary text-white hover:bg-primary transition-colors shadow-md h-10 min-h-[40px] text-[13px] font-semibold tracking-wide mt-1"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Box
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
