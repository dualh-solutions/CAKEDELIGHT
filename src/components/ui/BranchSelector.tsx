"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, ChevronDown } from "lucide-react";
import { useBranchStore, BRANCHES, BranchId } from "@/lib/store/branchStore";

export function BranchSelector({ isMobile = false }: { isMobile?: boolean }) {
  const { selectedBranchId, setBranch } = useBranchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedBranch = BRANCHES[selectedBranchId] || BRANCHES['attock'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: BranchId) => {
    setBranch(id);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3 mt-8 pt-8 border-t border-border-light">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Branch</span>
        {Object.values(BRANCHES).map((branch) => (
          <button
            key={branch.id}
            onClick={() => handleSelect(branch.id as BranchId)}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              selectedBranchId === branch.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{branch.name}</span>
            </div>
            {selectedBranchId === branch.id && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors text-xs font-medium text-text-primary"
      >
        <MapPin className="w-3.5 h-3.5 text-primary" />
        {selectedBranch.shortName}
        <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 md:left-0 mt-2 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-white p-2 z-50 origin-top"
          >
            <div className="px-3 py-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Select Your Branch</span>
            </div>
            <div className="space-y-1">
              {Object.values(BRANCHES).map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch.id as BranchId)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                    selectedBranchId === branch.id 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-black/5 text-text-primary'
                  }`}
                >
                  <span>{branch.name}</span>
                  {selectedBranchId === branch.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
