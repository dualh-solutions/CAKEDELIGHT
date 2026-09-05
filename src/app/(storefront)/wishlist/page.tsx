"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-bg-light max-md:pt-0 pt-32 pb-24 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-fredoka text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Save your favorite handcrafted cakes and desserts here. They'll be waiting for you when you're ready to order.
            </p>
            <Link href="/shop" className="block">
              <Button size="lg" className="w-full rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 py-6">
                Discover Our Creations
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6"
        >
          <div>
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-2 block text-center sm:text-left">
              Favorites
            </span>
            <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-text-primary">
              Your Wishlist
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-border-light text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={clearWishlist}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear Wishlist
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
