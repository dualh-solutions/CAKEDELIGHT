"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const ANNOUNCEMENTS = [
  "Freshly Baked Daily • Open 9AM–11PM",
  "Custom Celebration Cakes • Order 48 Hours in Advance",
  "Free Delivery on Orders Above Rs.3000",
  "Seasonal Collection Available Now"
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  const pathname = usePathname() || "/";
  const router = useRouter();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Announcement Rotation
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const isHomePage = pathname === "/";

  const getMobileTitle = () => {
    if (pathname === "/") return "CAKE DELIGHT";
    if (pathname === "/cart") return "CAKE DELIGHT";
    if (pathname === "/checkout") return "CAKE DELIGHT";
    if (pathname === "/search") return "Search Results";
    if (pathname === "/custom-cake") return "Custom Cake Builder";
    if (pathname.startsWith("/shop/")) {
      const category = pathname.split("/").pop();
      return category ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ") : "Shop";
    }
    if (pathname === "/shop") return "Shop";
    if (pathname === "/celebrations") return "Celebrations";
    if (pathname === "/gallery") return "Gallery";
    if (pathname === "/about") return "About";
    if (pathname === "/visit") return "Visit Us";
    if (pathname === "/contact") return "Contact";
    if (pathname === "/account") return "Account";
    if (pathname === "/wishlist") return "Wishlist";
    if (pathname.startsWith("/product/")) return "CAKE DELIGHT";
    return "CAKE DELIGHT";
  };

  const mobileTitle = getMobileTitle();

  const handleBack = () => {
    if (pathname === "/custom-cake") {
      try {
        const saved = localStorage.getItem('cakoo-custom-cake');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.flavor || parsed.occasion) {
            setShowLeaveDialog(true);
            return;
          }
        }
      } catch (e) {}
    }
    navigateBack();
  };

  const navigateBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const confirmLeave = () => {
    setShowLeaveDialog(false);
    localStorage.removeItem('cakoo-custom-cake');
    navigateBack();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white/90 text-[10px] sm:text-xs py-2 px-4 md:px-8 flex justify-center items-center w-full font-poppins font-medium tracking-wide overflow-hidden relative h-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={announcementIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute text-center w-full px-2 truncate whitespace-nowrap"
          >
            {ANNOUNCEMENTS[announcementIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-500 w-full relative ${isScrolled ? 'px-4 pt-4 pb-0' : 'px-4 pt-6 pb-8'}`}>
        {/* Subtle Dark Gradient to differentiate from bg */}
        <div className={`hidden md:block absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-transparent pointer-events-none transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100 -z-10'}`} />
        
        <div className={`mx-auto flex items-center justify-between rounded-full px-6 md:px-8 py-3 transition-all duration-500 relative ${
          isScrolled ? 'bg-white/40 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.05)] max-w-7xl' : 'bg-white/50 backdrop-blur-md border border-white/60 shadow-md max-w-[1400px]'
        }`}>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Left Navigation (<1024px lg:hidden) */}
        <div className="flex lg:hidden items-center">
          <AnimatePresence mode="wait">
            {isHomePage ? (
              <motion.div
                key="hamburger"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Sheet>
                  <SheetTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground w-11 h-11" aria-label="Menu">
                      <Menu className="w-6 h-6" />
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-white w-[280px] sm:w-[320px] p-6 flex flex-col justify-between z-[100]">
                    <div>
                      <Link href="/" className="inline-block mb-6">
                        <span className="font-fredoka text-2xl font-bold tracking-tight text-yellow-400">
                          CAKE DELIGHT
                        </span>
                      </Link>
                      <nav className="flex flex-col space-y-4">
                        <Link href="/shop" className="text-lg font-medium text-text-primary hover:text-primary py-1">Shop</Link>
                        <Link href="/custom-cake" className="text-lg font-medium text-text-primary hover:text-primary py-1">Custom Cakes</Link>
                        <Link href="/about" className="text-lg font-medium text-text-primary hover:text-primary py-1">About Us</Link>
                        <Link href="/gallery" className="text-lg font-medium text-text-primary hover:text-primary py-1">Gallery</Link>
                        <Link href="/visit" className="text-lg font-medium text-text-primary hover:text-primary py-1">Visit Us</Link>
                        <Link href="/contact" className="text-lg font-medium text-text-primary hover:text-primary py-1">Contact</Link>
                      </nav>
                    </div>
                    <div className="pt-6 border-t border-border-light">
                      <Link href="https://wa.me/923327659882?text=Hi!%20I'd%20like%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3.5 rounded-full text-[15px] font-medium transition-all shadow-md w-full min-h-[44px]">
                        Order on WhatsApp <span className="text-white/80">→</span>
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={handleBack}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground w-11 h-11 transition-colors"
                  aria-label="Go Back"
                >
                  <ArrowLeft className="w-6 h-6 text-text-primary" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Navigation (lg:flex, pixel-identical to desktop) */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/shop" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Shop <span className="inline-block ml-0.5 opacity-50 text-[10px]">v</span>
          </Link>
          <Link href="/celebrations" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Celebrations
          </Link>
          <Link href="/gallery" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Gallery
          </Link>
          <Link href="/about" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            About <span className="inline-block ml-0.5 opacity-50 text-[10px]">v</span>
          </Link>
          <Link href="/visit" className="text-[16px] md:text-[17px] font-medium text-text-primary/90 hover:text-primary transition-colors relative group">
            Visit
          </Link>
        </nav>

        {/* Mobile Header Title (<1024px) */}
        <div className="lg:hidden flex-1 text-center group flex flex-col items-center p-2 pointer-events-none overflow-hidden max-w-[50vw]">
          <AnimatePresence mode="wait">
             <motion.div
               key={mobileTitle}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className="pointer-events-auto w-full"
             >
                {mobileTitle === "CAKE DELIGHT" ? (
                  <Link href="/">
                    <span className="font-fredoka text-2xl font-bold tracking-tight text-yellow-400">CAKE DELIGHT</span>
                  </Link>
                ) : (
                  <span className="font-fredoka text-[18px] font-bold tracking-tight text-text-primary line-clamp-1 w-full text-center truncate">{mobileTitle}</span>
                )}
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Logo (>=1024px) */}
        <Link href="/" className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center group flex-col items-center p-3">
          <span className="font-fredoka text-3xl font-bold tracking-tight text-yellow-400 group-hover:opacity-90 transition-opacity">
            CAKE DELIGHT
          </span>
        </Link>

        {/* Actions - all icons visible on mobile and desktop with >=44px touch targets */}
        <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-3">
          <Link href="/shop" className="hidden lg:inline-flex shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-11 h-11" aria-label="Search">
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <Link href="/wishlist" className="hidden lg:inline-flex relative shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-11 h-11" aria-label="Wishlist">
            <Heart className="w-[18px] h-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-destructive text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="hidden lg:inline-flex relative shrink-0 items-center justify-center rounded-full hover:bg-cream/20 hover:text-primary transition-colors text-text-primary w-11 h-11" aria-label="Cart">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
          </Link>
          <Link href="https://wa.me/923327659882?text=Hi!%20I'd%20like%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-300 shadow-md">
            Order Now <span className="text-white/80">→</span>
          </Link>
        </div>
        </div>
      </div>
      </div>
      
      {/* Leave Custom Cake Builder Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="max-w-xs rounded-3xl mx-auto p-6 top-1/2 -translate-y-1/2">
          <DialogHeader className="text-center sm:text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Leave this page?</DialogTitle>
            <DialogDescription className="text-sm text-slate-500 font-medium">
              Your custom cake details have not been ordered and will not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3 mt-6 sm:space-x-0">
            <Button 
              variant="outline" 
              className="w-full rounded-xl min-h-[44px] text-sm font-semibold border-slate-200"
              onClick={() => setShowLeaveDialog(false)}
            >
              Stay
            </Button>
            <Button 
              variant="destructive" 
              className="w-full rounded-xl min-h-[44px] text-sm font-semibold shadow-sm"
              onClick={confirmLeave}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
