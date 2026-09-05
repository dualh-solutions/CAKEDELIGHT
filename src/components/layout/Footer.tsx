"use client";

import Link from "next/link";
import { Camera, Globe, Video, MessageCircle, MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { useBranchStore } from "@/lib/store/branchStore";
import { useEffect, useState } from "react";

export function Footer() {
  const { getCurrentBranch } = useBranchStore();
  const [mounted, setMounted] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const branch = getCurrentBranch();

  if (!mounted) return <footer className="bg-white pt-16 pb-8 border-t border-border-light min-h-[400px]"></footer>;

  return (
    <footer className="bg-white pt-12 md:pt-16 pb-8 border-t border-border-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-8 mb-10 md:mb-12">
          {/* Brand Info & Social - Accordion on mobile */}
          <div className="border-b border-border-light pb-4 md:border-b-0 md:pb-0">
            <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm mb-4 md:mb-6">
              <span className="font-fredoka text-2xl md:text-3xl font-bold tracking-tight text-primary">
                CAKE DELIGHT
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSocialOpen(!socialOpen)}
              className="w-full flex items-center justify-between py-1 md:py-0 md:mb-2 md:pointer-events-none text-left focus:outline-none"
            >
              <h3 className="font-poppins font-semibold text-base md:text-lg text-text-primary md:hidden">Social</h3>
              <ChevronDown
                className={`w-5 h-5 text-text-secondary transition-transform duration-200 md:hidden ${
                  socialOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className={`space-y-4 pt-3 md:pt-0 ${socialOpen ? "block" : "hidden md:block"}`}>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Delicious cakes & desserts made with heart in Attock. Joy in every bite.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <a href="https://www.instagram.com/attockcakedelight4251/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/INSTAGRAM.webp" alt="Instagram" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href="https://www.facebook.com/104000102288059?ref=NONE_xav_ig_profile_page_web" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/FACEBOOK.webp" alt="Facebook" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={branch.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/WHATSAPP.webp" alt="WhatsApp" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="Google Maps" className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/MAPS.webp" alt="Google Maps" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
              <a href={`mailto:${branch.email}`} target="_blank" rel="noopener noreferrer" aria-label="Email" className="w-11 h-11 flex items-center justify-center transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full">
                <img src="/images/MAIL.webp" alt="Email" className="w-9 h-9 object-cover rounded-full shadow-sm" />
              </a>
            </div>
            </div>
          </div>

          {/* Quick Links (Shop) - Accordion on mobile */}
          <div className="border-t border-border-light pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => setShopOpen(!shopOpen)}
              className="w-full flex items-center justify-between py-1 md:py-0 md:mb-5 md:pointer-events-none text-left focus:outline-none"
            >
              <h3 className="font-poppins font-semibold text-base md:text-lg text-text-primary">Shop</h3>
              <ChevronDown
                className={`w-5 h-5 text-text-secondary transition-transform duration-200 md:hidden ${
                  shopOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`space-y-3 pt-3 md:pt-0 ${shopOpen ? "block" : "hidden md:block"}`}>
              <li><Link href="/shop" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">All Cakes</Link></li>
              <li><Link href="/shop?collection=Custom+Cakes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Custom Cakes</Link></li>
              <li><Link href="/shop?collection=Wedding+Cakes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Wedding Cakes</Link></li>
              <li><Link href="/shop?collection=Desserts" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Desserts</Link></li>
              <li><Link href="/shop?collection=Gift+Boxes" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Information - Accordion on mobile */}
          <div className="border-t border-border-light pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => setInfoOpen(!infoOpen)}
              className="w-full flex items-center justify-between py-1 md:py-0 md:mb-5 md:pointer-events-none text-left focus:outline-none"
            >
              <h3 className="font-poppins font-semibold text-base md:text-lg text-text-primary">Information</h3>
              <ChevronDown
                className={`w-5 h-5 text-text-secondary transition-transform duration-200 md:hidden ${
                  infoOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`space-y-3 pt-3 md:pt-0 ${infoOpen ? "block" : "hidden md:block"}`}>
              <li><Link href="/about" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Our Story</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">FAQs</Link></li>
              <li><Link href="/delivery-policy" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Delivery Policy</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-gold transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm inline-block py-0.5">Privacy Policy</Link></li>
              <li><Link href="/admin" className="text-muted-foreground hover:text-gold transition-colors text-sm flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact - Accordion on mobile */}
          <div className="border-t border-border-light pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => setContactOpen(!contactOpen)}
              className="w-full flex items-center justify-between py-1 md:py-0 md:mb-5 md:pointer-events-none text-left focus:outline-none"
            >
              <h3 className="font-poppins font-semibold text-base md:text-lg text-text-primary">Contact</h3>
              <ChevronDown
                className={`w-5 h-5 text-text-secondary transition-transform duration-200 md:hidden ${
                  contactOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className={`pt-3 md:pt-0 ${contactOpen ? "block" : "hidden md:block"}`}>
              <ul className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <li className="flex items-start text-sm text-muted-foreground">
                <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1 text-left">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <a href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <span>{branch.phone}</span>
                </a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <a href={`mailto:${branch.email}`} className="flex items-center space-x-3 hover:text-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-1 -ml-1">
                  <Mail className="w-5 h-5 text-gold shrink-0" />
                  <span>{branch.email}</span>
                </a>
              </li>
            </ul>
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <span className="opacity-70">Currently Viewing</span>
              <MapPin className="w-3 h-3" />
              {branch.name}
            </div>
            </div>
          </div>
        </div>

        {/* Mobile-only bottom pill centered below contact */}
        <div className="flex justify-center mb-6 md:hidden">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <span className="opacity-70">Currently Viewing</span>
            <MapPin className="w-3 h-3" />
            {branch.name}
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-border-light flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Attock Cake Delight. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img src="/images/img1.webp" alt="Payment Methods" className="h-6 object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
