"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎂 Custom Cake Icon
const CakeIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21H4v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4Z" />
    <path d="M18 15V9a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" />
    <path d="M12 4v3" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
  </svg>
);

// 🍰 Menu Icon
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

export function MobileBottomNav() {
  const pathname = usePathname();
  
  // Hide global bottom navigation inside dedicated builder/checkout flows
  if (pathname === '/custom-cake' || pathname === '/checkout') {
    return null;
  }

  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show immediately if near top
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down -> hide slightly
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/shop", icon: MenuIcon },
    { name: "Custom", href: "/custom-cake", icon: CakeIcon },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: cartItemCount },
  ];

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white/90 backdrop-blur-2xl border-t border-black/5 shadow-[0_-4px_30px_rgba(0,0,0,0.06)] rounded-t-[24px] pb-safe transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="relative flex flex-col items-center justify-center w-14 h-12"
            >
              <div className={`relative flex items-center justify-center transition-all duration-300 ease-out ${isActive ? "text-primary -translate-y-1 scale-[1.15]" : "text-text-secondary hover:text-text-primary"}`}>
                <Icon className="w-[22px] h-[22px]" />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? "text-primary opacity-100 mt-1.5" : "text-text-secondary opacity-80 mt-1"}`}>
                {item.name}
              </span>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(202,143,66,0.5)]"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
