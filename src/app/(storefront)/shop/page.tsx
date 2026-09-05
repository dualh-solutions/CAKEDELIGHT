"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "@/store/productStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products, fetchProducts, isLoading: isProductsLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 1. Centralized State (Initialize from URL if present)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [collection, setCollection] = useState(searchParams.get("collection") || "All Collection");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") || "All Occasions");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "Featured");
  
  const initialMin = searchParams.get("min");
  const initialMax = searchParams.get("max");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialMin ? parseInt(initialMin) : 0, 
    initialMax ? parseInt(initialMax) : 50000
  ]);

  const initialFlavors = searchParams.get("flavors");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(initialFlavors ? initialFlavors.split(',') : []);

  const initialDietary = searchParams.get("dietary");
  const [selectedDietary, setSelectedDietary] = useState<string[]>(initialDietary ? initialDietary.split(',') : []);

  const [isLoading, setIsLoading] = useState(false);
  const [isFilterToolbarVisible, setIsFilterToolbarVisible] = useState(true);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 2. URL Synchronization
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (collection !== "All Collection") params.set("collection", collection);
    if (occasion !== "All Occasions") params.set("occasion", occasion);
    if (sortBy !== "Featured") params.set("sort", sortBy);
    if (priceRange[0] > 0) params.set("min", priceRange[0].toString());
    if (priceRange[1] < 50000) params.set("max", priceRange[1].toString());
    if (selectedFlavors.length > 0) params.set("flavors", selectedFlavors.join(','));
    if (selectedDietary.length > 0) params.set("dietary", selectedDietary.join(','));

    // Fake loading delay to show skeletons (simulating network request)
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 400);
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    return () => clearTimeout(timeout);
  }, [searchQuery, collection, occasion, sortBy, priceRange, selectedFlavors, selectedDietary, pathname, router]);

  // Observer for floating button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterToolbarVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (toolbarRef.current) observer.observe(toolbarRef.current);
    return () => {
      if (toolbarRef.current) observer.unobserve(toolbarRef.current);
    };
  }, []);

  // 3. Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Collection (Assuming category maps to collection roughly)
    if (collection !== "All Collection") {
      result = result.filter(p => p.category.toLowerCase() === collection.toLowerCase() || p.name.toLowerCase().includes(collection.toLowerCase().replace(' cakes', '')));
    }

    // Occasion (Mock matching by checking description for keywords)
    if (occasion !== "All Occasions") {
      result = result.filter(p => p.description.toLowerCase().includes(occasion.toLowerCase()) || p.name.toLowerCase().includes(occasion.toLowerCase()));
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Flavors (mock matching description)
    if (selectedFlavors.length > 0) {
      result = result.filter(p => selectedFlavors.some(f => p.description.toLowerCase().includes(f.toLowerCase()) || p.name.toLowerCase().includes(f.toLowerCase())));
    }

    // Dietary (mock matching)
    if (selectedDietary.length > 0) {
      result = result.filter(p => selectedDietary.some(d => p.description.toLowerCase().includes(d.toLowerCase())));
    }

    // Sort
    switch (sortBy) {
      case "Price: Low → High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High → Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Highest Rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "Best Selling":
      case "Most Popular":
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case "New Arrivals":
      case "Newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [products, searchQuery, collection, occasion, priceRange, selectedFlavors, selectedDietary, sortBy]);

  // Remove individual filters
  const removeFilter = (type: string, value?: string) => {
    if (type === 'collection') setCollection("All Collection");
    if (type === 'occasion') setOccasion("All Occasions");
    if (type === 'price') setPriceRange([0, 50000]);
    if (type === 'flavor' && value) setSelectedFlavors(prev => prev.filter(f => f !== value));
    if (type === 'dietary' && value) setSelectedDietary(prev => prev.filter(d => d !== value));
  };

  const clearAllFilters = () => {
    setCollection("All Collection");
    setOccasion("All Occasions");
    setSortBy("Featured");
    setPriceRange([0, 50000]);
    setSelectedFlavors([]);
    setSelectedDietary([]);
    setSearchQuery("");
  };

  // Active Filter Chips Generation
  const activeFilters = [];
  if (collection !== "All Collection") activeFilters.push({ type: 'collection', label: collection });
  if (occasion !== "All Occasions") activeFilters.push({ type: 'occasion', label: occasion });
  if (priceRange[0] > 0 || priceRange[1] < 50000) activeFilters.push({ type: 'price', label: `Rs.${priceRange[0]} - Rs.${priceRange[1]}` });
  selectedFlavors.forEach(f => activeFilters.push({ type: 'flavor', label: f, value: f }));
  selectedDietary.forEach(d => activeFilters.push({ type: 'dietary', label: d, value: d }));

  const activeFilterCount = (collection !== "All Collection" ? 1 : 0) + (occasion !== "All Occasions" ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0) + selectedFlavors.length + selectedDietary.length;

  const FilterDrawerContent = () => {
    const [localMin, setLocalMin] = useState(priceRange[0].toString());
    const [localMax, setLocalMax] = useState(priceRange[1].toString());
    const [isFlavorsOpen, setIsFlavorsOpen] = useState(false);
    const [isDietaryOpen, setIsDietaryOpen] = useState(false);

    useEffect(() => {
      setLocalMin(priceRange[0].toString());
      setLocalMax(priceRange[1].toString());
    }, [priceRange]);

    const handleMinBlur = () => {
      let val = parseInt(localMin) || 0;
      val = Math.max(0, Math.min(val, priceRange[1] - 500));
      setLocalMin(val.toString());
      setPriceRange([val, priceRange[1]]);
    };

    const handleMaxBlur = () => {
      let val = parseInt(localMax) || 50000;
      val = Math.min(50000, Math.max(val, priceRange[0] + 500));
      setLocalMax(val.toString());
      setPriceRange([priceRange[0], val]);
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'min' | 'max') => {
      if (e.key === 'Enter') {
        type === 'min' ? handleMinBlur() : handleMaxBlur();
      }
    };

    const handleReset = () => {
      setPriceRange([0, 50000]);
      setSelectedFlavors([]);
      setSelectedDietary([]);
    };

    const toggleFlavor = (f: string) => {
      setSelectedFlavors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    };

    const toggleDietary = (d: string) => {
      setSelectedDietary(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    };

    return (
      <div className="space-y-6 py-2">
        {/* PRICE FILTER SECTION */}
        <div className="bg-[#F8F6F1] p-6 rounded-[20px] border border-[#2F2A26]/5 shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-fredoka text-[22px] text-[#2F2A26] font-semibold">Filter by Price</h3>
            <button 
              onClick={handleReset}
              className="text-[#D8B15A] text-xs font-semibold uppercase tracking-wider hover:underline transition-all"
            >
              Reset
            </button>
          </div>
          <p className="text-sm text-[#2F2A26]/60 mb-6 font-poppins">Choose the budget that fits your celebration.</p>
          
          <div className="text-center mb-6">
            <motion.p 
              key={`${priceRange[0]}-${priceRange[1]}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-poppins font-medium text-lg text-[#2F2A26]"
            >
              Rs. {priceRange[0].toLocaleString()} — Rs. {priceRange[1].toLocaleString()}
            </motion.p>
          </div>

          <div className="flex items-center gap-4 mb-8 flex-col sm:flex-row">
            <div className="relative w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2F2A26]/50 transition-colors group-focus-within:text-[#D8B15A]">Rs.</span>
              <input 
                type="number" 
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={handleMinBlur}
                onKeyDown={(e) => handleKeyDown(e, 'min')}
                className="w-full h-12 pl-10 pr-4 bg-[#F8F6F1] border border-[#A8C39B]/50 rounded-[14px] text-sm font-medium text-[#2F2A26] focus:outline-none focus:ring-2 focus:ring-[#D8B15A]/50 focus:border-[#D8B15A] transition-all"
              />
              <span className="absolute right-4 -top-2.5 bg-[#F8F6F1] px-1 text-[10px] uppercase font-bold tracking-widest text-[#2F2A26]/40">Min</span>
            </div>
            <div className="relative w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#2F2A26]/50 transition-colors group-focus-within:text-[#D8B15A]">Rs.</span>
              <input 
                type="number" 
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={handleMaxBlur}
                onKeyDown={(e) => handleKeyDown(e, 'max')}
                className="w-full h-12 pl-10 pr-4 bg-[#F8F6F1] border border-[#A8C39B]/50 rounded-[14px] text-sm font-medium text-[#2F2A26] focus:outline-none focus:ring-2 focus:ring-[#D8B15A]/50 focus:border-[#D8B15A] transition-all"
              />
              <span className="absolute right-4 -top-2.5 bg-[#F8F6F1] px-1 text-[10px] uppercase font-bold tracking-widest text-[#2F2A26]/40">Max</span>
            </div>
          </div>

          <div className="px-2">
            <Slider
              min={0}
              max={50000}
              step={500}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(val: [number, number]) => setPriceRange(val)}
            />
          </div>
        </div>

        {/* FLAVOUR ACCORDION */}
        <div className={`overflow-hidden rounded-[14px] border transition-colors duration-300 ${isFlavorsOpen ? 'bg-[#A8C39B]/10 border-[#A8C39B]/30' : 'bg-[#F8F6F1] border-[#2F2A26]/5 hover:bg-[#A8C39B]/5'}`}>
          <button 
            onClick={() => setIsFlavorsOpen(!isFlavorsOpen)}
            className="w-full flex items-center justify-between p-4 focus:outline-none"
          >
            <span className="font-fredoka text-lg text-[#2F2A26] font-semibold flex items-center gap-2">
              Flavours {selectedFlavors.length > 0 && <span className="text-[#A8C39B] text-sm font-poppins">({selectedFlavors.length} selected)</span>}
            </span>
            <ChevronRight className={`w-5 h-5 text-[#2F2A26]/50 transition-transform duration-300 ${isFlavorsOpen ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isFlavorsOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-4 pt-0 space-y-3 font-poppins text-sm text-[#2F2A26]/80 pb-6">
                  {["Chocolate", "Vanilla", "Red Velvet", "Coffee", "Fruit", "Blueberry", "Caramel", "Strawberry"].map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                      <input 
                        type="checkbox" 
                        checked={selectedFlavors.includes(f)}
                        onChange={() => toggleFlavor(f)}
                        className="accent-[#D8B15A] w-4 h-4 rounded-sm transition-transform group-hover:scale-110 cursor-pointer" 
                      /> 
                      {f}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DIETARY ACCORDION */}
        <div className={`overflow-hidden rounded-[14px] border transition-colors duration-300 ${isDietaryOpen ? 'bg-[#A8C39B]/10 border-[#A8C39B]/30' : 'bg-[#F8F6F1] border-[#2F2A26]/5 hover:bg-[#A8C39B]/5'}`}>
          <button 
            onClick={() => setIsDietaryOpen(!isDietaryOpen)}
            className="w-full flex items-center justify-between p-4 focus:outline-none"
          >
            <span className="font-fredoka text-lg text-[#2F2A26] font-semibold flex items-center gap-2">
              Dietary {selectedDietary.length > 0 && <span className="text-[#A8C39B] text-sm font-poppins">({selectedDietary.length} selected)</span>}
            </span>
            <ChevronRight className={`w-5 h-5 text-[#2F2A26]/50 transition-transform duration-300 ${isDietaryOpen ? 'rotate-90' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDietaryOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-4 pt-0 space-y-3 font-poppins text-sm text-[#2F2A26]/80 pb-6">
                  {["Eggless", "Sugar Free", "Gluten Friendly", "Vegan", "Nut Free", "Low Sugar"].map(d => (
                    <label key={d} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                      <input 
                        type="checkbox" 
                        checked={selectedDietary.includes(d)}
                        onChange={() => toggleDietary(d)}
                        className="accent-[#D8B15A] w-4 h-4 rounded-sm transition-transform group-hover:scale-110 cursor-pointer" 
                      /> 
                      {d}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="pt-4 pb-12">
          <SheetClose className="w-full bg-[#A8C39B] hover:bg-[#A8C39B]/90 text-white font-semibold rounded-full py-3 shadow-[0_4px_15px_rgba(168,195,155,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(168,195,155,0.5)]">
            Apply Filters
          </SheetClose>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen max-md:pt-0 pt-32 pb-32">
      <div className="container mx-auto px-6 max-w-[1600px]">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-[50px] md:text-[72px] lg:text-[80px] font-semibold tracking-tight mb-4 text-text-primary"
          >
            Our Bakery Menu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[16px] md:text-[19px] font-normal leading-[1.8] text-text-secondary max-w-xl mx-auto"
          >
            Browse our selection of freshly baked cakes, artisan pastries, and handcrafted desserts.
          </motion.p>
        </div>

        {/* Premium Horizontal Filter Toolbar (Static) */}
        <div ref={toolbarRef} className="relative z-30 mb-12">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-[#F7F4EE]/90 backdrop-blur-2xl p-4 rounded-3xl xl:rounded-full border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mx-auto w-full transition-all duration-300">
            
            {/* Search */}
            <div className="relative w-full xl:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input 
                placeholder="Search handcrafted cakes, pastries..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-primary/10 hover:bg-primary/15 transition-colors border-none rounded-full h-12 text-sm focus-visible:ring-1 focus-visible:ring-sage/30 placeholder:text-primary/60 text-text-primary w-full"
              />
            </div>

            {/* Dropdowns & Filters Container */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto flex-wrap xl:flex-nowrap justify-center xl:justify-end">
              
              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 w-full md:w-auto">
                <Select value={collection} onValueChange={(val) => val && setCollection(val)}>
                  <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] shrink-0 h-12 bg-transparent border-none shadow-none hover:bg-black/5 rounded-full transition-colors text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Collection" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl bg-card">
                    {["All Collection", "Signature Cakes", "Celebration Cakes", "Pastries", "Desserts", "Brownies", "Gift Boxes", "Seasonal Specials"].map(c => (
                      <SelectItem key={c} value={c} className="rounded-xl cursor-pointer hover:bg-primary/10 transition-colors my-1">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={occasion} onValueChange={(val) => val && setOccasion(val)}>
                  <SelectTrigger className="w-full sm:w-[160px] lg:w-[170px] shrink-0 h-12 bg-transparent border-none shadow-none hover:bg-black/5 rounded-full transition-colors text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Occasion" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl bg-card max-h-[300px]">
                    {["All Occasions", "Birthday", "Wedding", "Anniversary", "Baby Shower", "Bridal Shower", "Graduation", "Corporate", "Eid", "Ramadan", "Mother's Day", "Father's Day", "Valentine's Day", "New Year", "Christmas", "Congratulations", "Thank You", "Get Well Soon", "Custom Celebration"].map(o => (
                      <SelectItem key={o} value={o} className="rounded-xl cursor-pointer hover:bg-primary/10 transition-colors my-1">{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-px h-6 bg-black/10 hidden xl:block mx-1 shrink-0 self-center" />

              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 w-full md:w-auto">
                <Select value={sortBy} onValueChange={(val) => val && setSortBy(val)}>
                  <SelectTrigger className="w-full sm:w-[160px] lg:w-[170px] shrink-0 h-12 bg-transparent border-none shadow-none hover:bg-black/5 rounded-full transition-colors text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl bg-card">
                    {["Featured", "Newest", "Best Selling", "Most Popular", "Highest Rated", "Price: Low → High", "Price: High → Low", "New Arrivals"].map(s => (
                      <SelectItem key={s} value={s} className="rounded-xl cursor-pointer hover:bg-primary/10 transition-colors my-1">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger className="h-12 w-full sm:w-auto px-6 rounded-full bg-white hover:bg-white/90 text-text-primary shadow-sm border border-black/5 font-medium flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105 relative">
                    <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full shadow-md">
                        {activeFilterCount}
                      </span>
                    )}
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[450px] bg-white/80 backdrop-blur-3xl border-l border-white/40 p-8">
                    <div className="flex flex-col h-full">
                      <div className="mb-6">
                        <h2 className="font-fredoka text-3xl text-text-primary mb-2">Refine</h2>
                        <p className="text-text-secondary text-sm">Narrow down to find your perfect confection.</p>
                      </div>
                      <div className="flex-1 overflow-y-auto hide-scrollbar pr-2">
                        <FilterDrawerContent />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 mt-4">
            {activeFilters.map((filter, idx) => (
              <motion.div
                key={`${filter.type}-${filter.label}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm text-sm font-medium text-text-primary"
              >
                {filter.label}
                <button 
                  onClick={() => removeFilter(filter.type, filter.label)}
                  className="hover:text-red-500 transition-colors bg-black/5 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <button 
              onClick={clearAllFilters}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary uppercase tracking-widest ml-2 underline underline-offset-4 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid / Loading / Empty State */}
        {isProductsLoading || isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-x-8 gap-y-8 sm:gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="w-full aspect-[4/5] bg-black/5 rounded-[2rem]" />
                <div className="h-5 w-2/3 bg-black/5 rounded-full" />
                <div className="h-4 w-1/3 bg-black/5 rounded-full" />
                <div className="h-6 w-1/4 bg-black/5 rounded-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-x-8 gap-y-8 sm:gap-y-16"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-fredoka text-[32px] font-semibold text-text-primary mb-4">We're baking something new!</h3>
            <p className="text-[16px] leading-[1.8] text-text-secondary mb-8">
              We couldn't find exactly what you were looking for. Try adjusting your filters or browse our daily fresh menu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={clearAllFilters}
                className="w-full sm:w-auto px-8 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors h-12 font-semibold"
              >
                Clear Filters
              </Button>
              <Button 
                onClick={() => { clearAllFilters(); setCollection("Signature Cakes"); }}
                variant="outline"
                className="w-full sm:w-auto px-8 rounded-full border-primary/30 text-primary hover:bg-primary/10 h-12 font-semibold"
              >
                Browse Signature
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Filter Button */}
      <AnimatePresence>
        {!isFilterToolbarVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
          >
            <Sheet>
              <SheetTrigger 
                className="h-14 px-6 rounded-full bg-[#F7F4EE]/80 backdrop-blur-2xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-text-primary font-medium flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(0,0,0,0.15)] transition-all duration-300 relative focus:outline-none"
              >
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-primary text-white text-[11px] font-bold rounded-full shadow-md border-2 border-[#F7F4EE]">
                    {activeFilterCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[450px] bg-white/80 backdrop-blur-3xl border-l border-white/40 p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <h2 className="font-fredoka text-3xl text-text-primary mb-2">Refine</h2>
                    <p className="text-text-secondary text-sm">Narrow down to find your perfect confection.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto hide-scrollbar pr-2">
                    <FilterDrawerContent />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background max-md:pt-0 pt-32 pb-32 flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-sage animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
