"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const delivery = subtotal > 0 ? 300 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + delivery + tax;

  if (items.length === 0) {
    return (
      <div className="bg-bg-light min-h-[70vh] flex flex-col items-center justify-center px-4 max-md:pt-0 pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-fredoka text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/shop">
            <Button size="lg" className="rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="font-fredoka text-4xl font-bold mb-10 text-text-primary">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.cartItemId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-4 md:p-6 rounded-3xl border border-border-light shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted shrink-0">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
                  />
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-fredoka text-xl font-semibold mb-1">{item.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-1">{item.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                    {item.selectedFlavor && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{item.selectedFlavor}</span>
                    )}
                    {item.selectedWeight && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">{item.selectedWeight}</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="font-poppins font-semibold text-lg">
                      Rs. {item.price.toLocaleString()}
                    </span>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border-light rounded-full p-1 bg-bg-light">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
                        onClick={() => removeItem(item.cartItemId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-sm sticky top-32">
              <h2 className="font-fredoka text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-text-primary font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-text-primary font-medium">Rs. {delivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="text-text-primary font-medium">Rs. {tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b border-border-light mb-8">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-poppins font-bold text-2xl text-text-primary">Rs. {total.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full min-h-[48px] rounded-full py-6 text-base bg-secondary text-primary-foreground hover:bg-secondary/90 shadow-[0_4px_15px_rgba(168,195,155,0.4)] transition-all hover:-translate-y-1">
                    Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/shop" className="block w-full">
                  <Button variant="outline" className="w-full rounded-full py-6 text-base border-border-light">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
