"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

export function Slider({ min = 0, max = 50000, step = 500, value, onValueChange, className }: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = React.useState<"min" | "max" | null>(null);

  const getValFromPointer = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const rawVal = percent * (max - min) + min;
    const steppedVal = Math.round(rawVal / step) * step;
    return Math.min(Math.max(steppedVal, min), max);
  };

  const handlePointerDown = (e: React.PointerEvent, thumb: "min" | "max") => {
    e.stopPropagation();
    setActiveThumb(thumb);
  };

  const handleTrackPointerDown = (e: React.PointerEvent) => {
    const val = getValFromPointer(e.clientX);
    const distMin = Math.abs(val - value[0]);
    const distMax = Math.abs(val - value[1]);
    
    if (distMin < distMax) {
      onValueChange([val, value[1]]);
      setActiveThumb("min");
    } else {
      onValueChange([value[0], val]);
      setActiveThumb("max");
    }
  };

  React.useEffect(() => {
    if (!activeThumb) return;

    const handlePointerMove = (e: PointerEvent) => {
      const val = getValFromPointer(e.clientX);
      if (activeThumb === "min") {
        onValueChange([Math.min(val, value[1] - step), value[1]]);
      } else {
        onValueChange([value[0], Math.max(val, value[0] + step)]);
      }
    };

    const handlePointerUp = () => {
      setActiveThumb(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeThumb, value, min, max, step, onValueChange]);

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div 
      className={cn("relative w-full h-8 flex items-center group touch-none select-none", className)}
      onPointerDown={handleTrackPointerDown}
      ref={trackRef}
    >
      {/* Background Track */}
      <div className="absolute w-full h-2 bg-primary/20 rounded-full overflow-hidden cursor-pointer">
        {/* Active Track */}
        <div 
          className="absolute h-full bg-gradient-to-r from-[#D8B15A]/80 to-[#D8B15A] rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
      </div>

      {/* Min Thumb */}
      <div
        className={cn(
          "absolute w-6 h-6 -ml-3 bg-primary border-[3px] border-white rounded-full shadow-md z-20 cursor-grab hover:scale-110 transition-transform flex items-center justify-center",
          activeThumb === "min" && "scale-110 shadow-[0_0_15px_rgba(216,177,90,0.5)] cursor-grabbing"
        )}
        style={{ left: `${minPercent}%` }}
        onPointerDown={(e) => handlePointerDown(e, "min")}
      />

      {/* Max Thumb */}
      <div
        className={cn(
          "absolute w-6 h-6 -ml-3 bg-primary border-[3px] border-white rounded-full shadow-md z-30 cursor-grab hover:scale-110 transition-transform flex items-center justify-center",
          activeThumb === "max" && "scale-110 shadow-[0_0_15px_rgba(216,177,90,0.5)] cursor-grabbing"
        )}
        style={{ left: `${maxPercent}%` }}
        onPointerDown={(e) => handlePointerDown(e, "max")}
      />

      {/* Floating Value Bubbles */}
      <AnimatePresence>
        {activeThumb === "min" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-10 -ml-6 px-3 py-1.5 bg-[#2F2A26] text-white text-[10px] font-semibold rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-40"
            style={{ left: `${minPercent}%` }}
          >
            Rs. {value[0].toLocaleString()}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#2F2A26]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeThumb === "max" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-10 -ml-6 px-3 py-1.5 bg-[#2F2A26] text-white text-[10px] font-semibold rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-40"
            style={{ left: `${maxPercent}%` }}
          >
            Rs. {value[1].toLocaleString()}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[5px] border-t-[#2F2A26]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
