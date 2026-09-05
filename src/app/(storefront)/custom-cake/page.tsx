"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, ChevronLeft, Check, UploadCloud, CheckCircle2, 
  MapPin, Clock, Heart, Sparkles, Cake as CakeIcon, Image as ImageIcon,
  Info, X, Loader2, Plus
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBranchStore } from "@/lib/store/branchStore";

// --- MOCK DATA ---
const OCCASIONS = [
  { id: "birthday", name: "Birthday", icon: CakeIcon },
  { id: "wedding", name: "Wedding", icon: Heart },
  { id: "anniversary", name: "Anniversary", icon: Sparkles },
  { id: "corporate", name: "Corporate", icon: MapPin },
  { id: "other", name: "Other (Custom)", icon: Plus },
];

const SPONGES = [
  { id: "vanilla", name: "Vanilla Bean", price: 0 },
  { id: "chocolate", name: "Belgian Chocolate", price: 500 },
  { id: "redvelvet", name: "Red Velvet", price: 300 },
  { id: "custom", name: "Custom Sponge", price: 0 },
];

const FILLINGS = [
  { id: "creamcheese", name: "Cream Cheese", price: 0 },
  { id: "ganache", name: "Chocolate Ganache", price: 300 },
  { id: "lotus", name: "Lotus Biscoff", price: 600 },
  { id: "nutella", name: "Nutella", price: 500 },
  { id: "custom", name: "Custom Filling", price: 0 },
];

const WEIGHTS = [
  { id: "2lb", name: "2 lbs", desc: "8-10 servings", price: 3000 },
  { id: "3lb", name: "3 lbs", desc: "12-15 servings", price: 4500 },
  { id: "4lb", name: "4 lbs", desc: "18-22 servings", price: 6000 },
  { id: "5lb", name: "5 lbs", desc: "25-30 servings", price: 7500 },
  { id: "6lb", name: "6 lbs", desc: "35-40 servings", price: 9000 },
  { id: "8lb", name: "8 lbs", desc: "45-55 servings", price: 12000 },
  { id: "10lb", name: "10 lbs", desc: "60-75 servings", price: 15000 },
  { id: "custom", name: "Custom Weight", desc: "Specify weight", price: 0 },
];

const SHAPES = [
  { id: "round", name: "Classic Round", price: 0 },
  { id: "square", name: "Modern Square", price: 200 },
  { id: "heart", name: "Heart Shape", price: 400 },
  { id: "tiered", name: "Tiered (2+)", price: 1500 },
  { id: "custom", name: "Custom Shape", price: 0 },
];

const DECORATIONS = [
  { id: "minimal", name: "Minimalist Elegance", price: 0, recommendFor: ["wedding", "corporate"] },
  { id: "floral", name: "Fresh Floral Array", price: 1200, recommendFor: ["wedding", "anniversary"] },
  { id: "gold", name: "24k Gold Accents", price: 800, recommendFor: ["wedding", "anniversary"] },
  { id: "sprinkles", name: "Joyful Sprinkles", price: 200, recommendFor: ["birthday"] },
  { id: "custom_fondant", name: "Custom Fondant", price: 2000, recommendFor: ["kids", "birthday"] },
  { id: "custom", name: "Custom Design", price: 0, recommendFor: [] },
];

const ADDONS = [
  { id: "sparklers", name: "Sparkler Candles", price: 150 },
  { id: "topper", name: "Acrylic Topper", price: 300 },
  { id: "banner", name: "Fondant Banner", price: 500 },
];

const STEPS = [
  { id: 'occasion', title: 'Occasion' },
  { id: 'flavor', title: 'Flavor Profile' },
  { id: 'size_shape', title: 'Size & Shape' },
  { id: 'design', title: 'Design & Aesthetics' },
  { id: 'details', title: 'Final Details' }
];

export default function CustomCakeBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    occasion: "",
    customOccasion: "",
    sponge: "",
    customSponge: "",
    filling: "",
    customFilling: "",
    weight: "2lb",
    customWeight: "",
    shape: "round",
    customShape: "",
    decoration: "minimal",
    customDecoration: "",
    message: "",
    instructions: "",
    reqDate: "",
    reqTime: "",
    addons: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Auto-save & Restore
  useEffect(() => {
    const saved = localStorage.getItem('cakoo-custom-cake');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.occasion) setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cakoo-custom-cake', JSON.stringify(formData));
  }, [formData]);

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    let total = 0;
    if (formData.sponge) total += SPONGES.find(s => s.id === formData.sponge)?.price || 0;
    if (formData.filling) total += FILLINGS.find(f => f.id === formData.filling)?.price || 0;
    if (formData.weight) total += WEIGHTS.find(w => w.id === formData.weight)?.price || 0;
    if (formData.shape) total += SHAPES.find(s => s.id === formData.shape)?.price || 0;
    if (formData.decoration) total += DECORATIONS.find(d => d.id === formData.decoration)?.price || 0;
    formData.addons.forEach(addId => {
      total += ADDONS.find(a => a.id === addId)?.price || 0;
    });
    return total;
  };

  const scrollToStepContent = () => {
    setTimeout(() => {
      if (stepContentRef.current) {
        const rect = stepContentRef.current.getBoundingClientRect();
        if (rect.top < 120 || rect.bottom > window.innerHeight) {
          const y = rect.top + window.scrollY - 140; 
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }
    }, 50);
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.occasion) return toast.error("Please select an occasion.");
    if (currentStep === 0 && formData.occasion === 'other' && !formData.customOccasion) return toast.error("Please specify your occasion.");
    
    if (currentStep === 1 && (!formData.sponge || !formData.filling)) return toast.error("Please select both sponge and filling.");
    if (currentStep === 1 && formData.sponge === 'custom' && !formData.customSponge) return toast.error("Please specify your custom sponge.");
    if (currentStep === 1 && formData.filling === 'custom' && !formData.customFilling) return toast.error("Please specify your custom filling.");
    
    if (currentStep === 2 && (!formData.weight || !formData.shape)) return toast.error("Please select size and shape.");
    if (currentStep === 2 && formData.weight === 'custom' && !formData.customWeight) return toast.error("Please specify your custom weight.");
    if (currentStep === 2 && formData.shape === 'custom' && !formData.customShape) return toast.error("Please specify your custom shape.");
    
    if (currentStep === 3 && !formData.decoration) return toast.error("Please select a decorative style.");
    if (currentStep === 3 && formData.decoration === 'custom' && !formData.customDecoration) return toast.error("Please specify your custom decoration.");
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      scrollToStepContent();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      scrollToStepContent();
    }
  };

  const handleSubmitOrder = async () => {
    if (!formData.reqDate || !formData.reqTime) {
      return toast.error("Please specify a required date and time.");
    }
    setIsSubmitting(true);
    
    const occ = formData.occasion === 'other' ? formData.customOccasion : OCCASIONS.find(o => o.id === formData.occasion)?.name;
    const spng = formData.sponge === 'custom' ? formData.customSponge : SPONGES.find(s=>s.id===formData.sponge)?.name;
    const fill = formData.filling === 'custom' ? formData.customFilling : FILLINGS.find(f=>f.id===formData.filling)?.name;
    const wt = formData.weight === 'custom' ? formData.customWeight : WEIGHTS.find(w=>w.id===formData.weight)?.name;
    const shp = formData.shape === 'custom' ? formData.customShape : SHAPES.find(s=>s.id===formData.shape)?.name;
    const deco = formData.decoration === 'custom' ? formData.customDecoration : DECORATIONS.find(d=>d.id===formData.decoration)?.name;
    const addonsStr = formData.addons.length > 0 ? formData.addons.map(a => ADDONS.find(ad=>ad.id===a)?.name).join(", ") : "None";

    const description = `\n` +
      `    • Occasion: ${occ || 'Custom'}\n` +
      `    • Required: ${formData.reqDate} at ${formData.reqTime}\n` +
      `    • Size: ${wt} ${shp}\n` +
      `    • Flavor: ${spng} Sponge with ${fill} Filling\n` +
      `    • Design: ${deco}\n` +
      `    • Add-ons: ${addonsStr}\n` +
      `    • Message: ${formData.message || 'None'}\n` +
      `    • Instructions: ${formData.instructions || 'None'}`;
      
    const customCakeProduct = {
      id: `custom-cake-${Date.now()}`,
      name: `Custom ${occ || 'Cake'}`,
      category: "Custom Cakes",
      description: description,
      price: calculatePrice(),
      rating: 5,
      reviews: 0,
      images: [previewImage || '/images/hero_bakery_1783112143212.png'],
      stock: 1,
      isPopular: false,
      isNew: true,
      availability: { 'attock': true, 'kamra': true as boolean },
      quantity: 1
    };
    
    addItem(customCakeProduct as any);
    localStorage.removeItem('cakoo-custom-cake');
    toast.success("Custom Cake added to cart!");
    router.push("/checkout");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setPreviewImage(URL.createObjectURL(file));
        setIsUploading(false);
        toast.success("Inspiration image attached locally");
      }, 800);
    }
  };

  // Safe fetchers for summary display
  const occName = formData.occasion === 'other' ? formData.customOccasion : OCCASIONS.find(o => o.id === formData.occasion)?.name;
  const spngName = formData.sponge === 'custom' ? formData.customSponge : SPONGES.find(s=>s.id===formData.sponge)?.name;
  const fillName = formData.filling === 'custom' ? formData.customFilling : FILLINGS.find(f=>f.id===formData.filling)?.name;
  const wtName = formData.weight === 'custom' ? formData.customWeight : WEIGHTS.find(w=>w.id===formData.weight)?.name;
  const shpName = formData.shape === 'custom' ? formData.customShape : SHAPES.find(s=>s.id===formData.shape)?.name;
  const decoName = formData.decoration === 'custom' ? formData.customDecoration : DECORATIONS.find(d=>d.id===formData.decoration)?.name;

  // Minimum date is 48 hours from now
  const minDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="bg-[#FCFBF8] min-h-screen max-md:pt-0 pt-28 pb-40 lg:pt-32 lg:pb-32 font-poppins" ref={scrollRef}>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-primary font-semibold uppercase tracking-widest text-xs mb-4 block">
            Bespoke Creations
          </span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary leading-tight"
          >
            Design Your Masterpiece
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg leading-relaxed"
          >
            A premium guided experience to craft the perfect centerpiece for your celebration. Every layer tailored to perfection.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Main Configurator Area */}
          <div className="flex-1 w-full order-2 lg:order-1">
            
            {/* Mobile Progress Bar (< 640px) */}
            <div className="sm:hidden bg-white rounded-2xl p-4 shadow-sm border border-black/5 mb-6">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-text-primary">
                  Step {currentStep + 1} of {STEPS.length}:{" "}
                  <span className="text-gold">{STEPS[currentStep].title}</span>
                </span>
                <span className="text-gold font-bold">
                  {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Luxury Stepper (Desktop/Tablet >= 640px) */}
            <div className="hidden sm:block bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-100 -z-10" />
                <motion.div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gold -z-10"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <motion.div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted ? 'bg-gold text-white shadow-md' : 
                          isCurrent ? 'bg-white border-2 border-gold text-gold shadow-sm scale-110' : 
                          'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                        whileHover={{ scale: isCurrent || isCompleted ? 1.1 : 1 }}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </motion.div>
                      <span className={`text-[10px] sm:text-xs font-semibold hidden sm:block absolute -bottom-6 whitespace-nowrap transition-colors ${isCurrent ? 'text-gold' : 'text-gray-400'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content Card */}
            <div ref={stepContentRef} className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 min-h-[450px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {/* STEP 0: OCCASION */}
                  {currentStep === 0 && (
                    <>
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">What are we celebrating?</h2>
                        <p className="text-text-secondary">This helps us personalize recommendations for you.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {OCCASIONS.map((occ, idx) => {
                          const Icon = occ.icon;
                          const isSelected = formData.occasion === occ.id;
                          return (
                            <div 
                              key={occ.id}
                              onClick={() => updateForm('occasion', occ.id)}
                              className={`relative p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center justify-center min-h-[105px] ${
                                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                              } ${
                                isSelected 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.02]' 
                                  : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-gold" />}
                              <Icon className={`w-8 h-8 mb-3 transition-colors ${isSelected ? 'text-gold' : 'text-gray-400 group-hover:text-gold/60'}`} />
                              <h4 className={`font-semibold ${isSelected ? 'text-text-primary' : 'text-gray-600'}`}>{occ.name}</h4>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Custom Occasion Input */}
                      <AnimatePresence>
                        {formData.occasion === 'other' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                            <Label className="mb-2 block">Specify Custom Occasion</Label>
                            <Input 
                              placeholder="e.g. Graduation, Baby Shower..." 
                              value={formData.customOccasion}
                              onChange={(e) => updateForm('customOccasion', e.target.value)}
                              className="py-6 rounded-xl text-base"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* STEP 1: FLAVOR */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Build Your Flavor</h2>
                        <p className="text-text-secondary">Mix and match the perfect sponge and filling.</p>
                      </div>

                      {/* Sponge Selection */}
                      <div className="space-y-4">
                        <Label className="text-lg font-fredoka font-semibold">1. Choose Sponge Base</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          {SPONGES.map(sponge => {
                            const isSelected = formData.sponge === sponge.id;
                            return (
                              <div 
                                key={sponge.id}
                                onClick={() => updateForm('sponge', sponge.id)}
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center justify-center min-h-[90px] ${
                                  isSelected ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-gold" />}
                                <h4 className="font-semibold text-sm">{sponge.name}</h4>
                                {sponge.price > 0 && <span className="text-[10px] text-gold mt-1">+Rs. {sponge.price}</span>}
                              </div>
                            );
                          })}
                        </div>
                        <AnimatePresence>
                          {formData.sponge === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Input placeholder="Specify your custom sponge (e.g. Lemon, Coffee)" value={formData.customSponge} onChange={e => updateForm('customSponge', e.target.value)} className="py-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Filling Selection */}
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Label className="text-lg font-fredoka font-semibold">2. Choose Filling/Frosting</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                          {FILLINGS.map(filling => {
                            const isSelected = formData.filling === filling.id;
                            return (
                              <div 
                                key={filling.id}
                                onClick={() => updateForm('filling', filling.id)}
                                className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center justify-center min-h-[90px] ${
                                  isSelected ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-gold" />}
                                <h4 className="font-semibold text-xs leading-tight">{filling.name}</h4>
                                {filling.price > 0 && <span className="text-[9px] text-gold mt-1">+Rs. {filling.price}</span>}
                              </div>
                            );
                          })}
                        </div>
                        <AnimatePresence>
                          {formData.filling === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Input placeholder="Specify your custom filling (e.g. Strawberry Jam)" value={formData.customFilling} onChange={e => updateForm('customFilling', e.target.value)} className="py-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SIZE & SHAPE */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Size & Structure</h2>
                        <p className="text-text-secondary">Determine the foundation of your cake.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-lg font-fredoka font-semibold">Weight & Servings</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {WEIGHTS.map(w => (
                            <div 
                              key={w.id}
                              onClick={() => updateForm('weight', w.id)}
                              className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-center ${
                                formData.weight === w.id 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)] scale-[1.02]' 
                                  : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                              }`}
                            >
                              <h4 className="font-bold text-base">{w.name}</h4>
                              <p className="text-[9px] uppercase text-gray-500 mt-1">{w.desc}</p>
                            </div>
                          ))}
                        </div>
                        <AnimatePresence>
                          {formData.weight === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Input placeholder="Specify custom weight (e.g. 15 lbs)" value={formData.customWeight} onChange={e => updateForm('customWeight', e.target.value)} className="py-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <Label className="text-lg font-fredoka font-semibold">Cake Shape</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {SHAPES.map(s => (
                            <div 
                              key={s.id}
                              onClick={() => updateForm('shape', s.id)}
                              className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                                formData.shape === s.id 
                                  ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                                  : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                              }`}
                            >
                              <span className="font-semibold text-sm">{s.name}</span>
                              {formData.shape === s.id && <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />}
                            </div>
                          ))}
                        </div>
                        <AnimatePresence>
                          {formData.shape === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Input placeholder="Specify custom shape (e.g. Hexagon)" value={formData.customShape} onChange={e => updateForm('customShape', e.target.value)} className="py-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DESIGN */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Aesthetic Details</h2>
                        <p className="text-text-secondary">Personalize the exterior finish and decorations.</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-lg font-fredoka font-semibold">Decorative Style</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {DECORATIONS.map(d => {
                            const isSelected = formData.decoration === d.id;
                            const isRecommended = d.recommendFor.includes(formData.occasion);
                            return (
                              <div 
                                key={d.id}
                                onClick={() => updateForm('decoration', d.id)}
                                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'
                                }`}
                              >
                                {isRecommended && !isSelected && (
                                  <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                                    Recommended
                                  </span>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-sm">{d.name}</span>
                                  {isSelected && <CheckCircle2 className="w-5 h-5 text-gold" />}
                                </div>
                                {d.price > 0 && <p className="text-[10px] text-gold font-bold mt-1">+ Rs. {d.price}</p>}
                              </div>
                            );
                          })}
                        </div>
                        <AnimatePresence>
                          {formData.decoration === 'custom' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Input placeholder="Describe your custom design requirements" value={formData.customDecoration} onChange={e => updateForm('customDecoration', e.target.value)} className="py-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label className="text-lg font-fredoka font-semibold">
                          Inspiration Upload <span className="text-xs font-normal text-gray-400">Optional</span>
                        </Label>
                        
                        {!previewImage ? (
                          <div className="relative">
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" />
                            <Button variant="outline" className="w-full sm:w-auto rounded-full border-gray-200 text-gray-600 font-medium group relative overflow-hidden" disabled={isUploading}>
                              {isUploading ? (
                                <><div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" /> Uploading...</>
                              ) : (
                                <><UploadCloud className="w-4 h-4 mr-2 group-hover:text-gold transition-colors" /> Upload Image</>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 bg-gray-50 p-2 pr-4 rounded-full border border-gray-100 w-max">
                            <img src={previewImage} alt="Preview" className="h-10 w-10 object-cover rounded-full" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">Image Attached</span>
                              <span className="text-[10px] text-gray-500 hover:text-red-500 cursor-pointer" onClick={() => setPreviewImage(null)}>Remove image</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: DETAILS */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-fredoka text-3xl font-bold text-text-primary mb-2">Final Details</h2>
                        <p className="text-text-secondary">When do you need it and what should it say?</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="font-semibold text-text-primary">Required Date <span className="text-primary text-xs">(Min 48h notice)</span></Label>
                          <Input 
                            type="date"
                            min={minDate}
                            value={formData.reqDate}
                            onChange={(e) => updateForm('reqDate', e.target.value)}
                            className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold text-base"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-semibold text-text-primary">Required Time</Label>
                          <Input 
                            type="time"
                            value={formData.reqTime}
                            onChange={(e) => updateForm('reqTime', e.target.value)}
                            className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label className="font-semibold">Custom Message on Cake</Label>
                        <Input 
                          placeholder="e.g., Happy 25th Anniversary!" 
                          value={formData.message}
                          onChange={(e) => updateForm('message', e.target.value)}
                          className="py-6 rounded-xl border-gray-200 focus-visible:ring-gold text-base"
                        />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label className="font-semibold text-lg font-fredoka">Optional Add-ons</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {ADDONS.map(addon => {
                            const isSelected = formData.addons.includes(addon.id);
                            return (
                              <div 
                                key={addon.id}
                                onClick={() => {
                                  if (isSelected) {
                                    updateForm('addons', formData.addons.filter(id => id !== addon.id));
                                  } else {
                                    updateForm('addons', [...formData.addons, addon.id]);
                                  }
                                }}
                                className={`p-3 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${isSelected ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-gray-100 hover:border-gold/30 hover:bg-gray-50'}`}
                              >
                                <span className="text-sm font-medium">{addon.name}</span>
                                <span className="text-xs text-gold font-bold">+ Rs. {addon.price}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label className="font-semibold">Special Instructions</Label>
                        <textarea 
                          placeholder="Allergies, delivery specifics, or specific color hex codes..." 
                          value={formData.instructions}
                          onChange={(e) => updateForm('instructions', e.target.value)}
                          className="w-full min-h-[60px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold text-base"
                        />
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6 flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-text-primary leading-relaxed">
                          <strong>Important Reminder:</strong> We will redirect you to WhatsApp to place this custom order. If you uploaded an inspiration image, <strong className="text-primary">please remember to manually attach the image</strong> in the WhatsApp chat before pressing send!
                        </p>
                      </div>

                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons (Desktop Only) */}
              <div className="hidden lg:flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`rounded-full px-6 transition-opacity min-h-[48px] ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {currentStep === STEPS.length - 1 ? (
                    <Button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    size="lg"
                    className="rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 px-8 shadow-lg hover:shadow-xl transition-all min-h-[48px]"
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing...</> : <>Checkout Order <Check className="w-4 h-4 ml-2" /></>}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    size="lg"
                    className="rounded-full bg-gold text-white hover:bg-gold/90 px-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 min-h-[48px]"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sticky Summary Panel (Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-[380px] shrink-0 sticky top-32 z-20">
            <div className="bg-white rounded-[1.5rem] shadow-[0_15px_40px_rgb(0,0,0,0.06)] border border-black/5 overflow-hidden flex flex-col">
              
              <div className="bg-[#FCFBF8] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">Progress</span>
                  <div className="font-semibold text-text-primary text-xs mt-0.5">Step {currentStep + 1} of {STEPS.length}</div>
                </div>
                <div className="text-gold font-bold text-sm bg-gold/10 px-2 py-1 rounded-full">{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 shadow-inner group">
                    <AnimatePresence mode="popLayout">
                      <motion.img 
                        key={formData.occasion || 'default'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        src={
                          previewImage ? previewImage :
                          formData.occasion === 'wedding' ? '/images/cat_wedding_1783112161369.png' :
                          formData.occasion === 'birthday' ? '/images/cat_birthday_1783112152320.png' :
                          formData.occasion === 'anniversary' ? '/images/prod_gold_leaf_1783112275495.png' :
                          formData.occasion === 'corporate' ? '/images/cat_gift_boxes_1783112178444.png' :
                          '/images/hero_bakery_1783112143212.png'
                        }
                        alt="Cake Inspiration"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                      />
                    </AnimatePresence>
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[9px] text-white font-medium">Ref Image</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-fredoka text-lg font-bold mb-3 text-text-primary">
                    Order Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <div className="font-medium text-text-primary">
                      {occName ? <span className="capitalize">{occName}</span> : '—'} 
                      <span className="text-gray-300 mx-1.5">•</span> 
                      {wtName || '—'} 
                      <span className="text-gray-300 mx-1.5">•</span> 
                      {shpName || '—'}
                    </div>

                    <div className="text-xs pt-1">
                      <span className="text-gray-400 mr-2">Style:</span>
                      {spngName || '—'} / {fillName || '—'}
                    </div>

                    {formData.reqDate && (
                      <div className="text-xs pt-1 text-gold font-medium">
                        Due: {formData.reqDate} at {formData.reqTime}
                      </div>
                    )}

                    {formData.addons.length > 0 && (
                      <div className="text-[11px] pt-1 text-gray-500">
                        + {formData.addons.length} Add-on(s)
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold block mb-0.5">Estimated Total</span>
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.span 
                      key={calculatePrice()}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-poppins font-bold text-xl text-text-primary"
                    >
                      Rs. {calculatePrice().toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Sticky Bottom Summary & Navigation Bar (lg:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] lg:hidden">
        <AnimatePresence>
          {mobileSummaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#FCFBF8] border-b border-gray-100 px-4 py-4 max-h-[50vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-fredoka text-sm font-bold text-text-primary">Order Specification</h4>
                <button
                  type="button"
                  onClick={() => setMobileSummaryOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 mb-3">
                <div className="font-medium text-text-primary">
                  {occName ? <span className="capitalize">{occName}</span> : '—'} 
                  <span className="text-gray-300 mx-1.5">•</span> 
                  {wtName || '—'} 
                  <span className="text-gray-300 mx-1.5">•</span> 
                  {shpName || '—'}
                </div>
                <div className="text-[11px] pt-1">
                  <span className="text-gray-400 mr-1.5">Style:</span>
                  {spngName || '—'} / {fillName || '—'}
                </div>
                {formData.reqDate && (
                  <div className="text-[11px] pt-1 text-gold font-medium">
                    Due: {formData.reqDate} {formData.reqTime}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-secondary">Estimated Total:</span>
            <span className="font-poppins font-bold text-sm text-text-primary">Rs. {calculatePrice().toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-gold text-xs font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>{mobileSummaryOpen ? 'Hide Details' : 'View Details'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`rounded-full px-5 min-h-[44px] border-gray-200 text-gray-700 font-medium ${
              currentStep === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-text-primary text-white hover:bg-text-primary/90 min-h-[44px] font-semibold shadow-md"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing...</> : <>Checkout <Check className="w-4 h-4 ml-1.5" /></>}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 rounded-full bg-gold text-white hover:bg-gold/90 min-h-[44px] font-semibold shadow-md"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
