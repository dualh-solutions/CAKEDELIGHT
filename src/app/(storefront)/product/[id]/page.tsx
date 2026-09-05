"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Minus, Plus, Heart, Share2, Truck, Store, Info, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function ProductDetailsPage() {
  const params = useParams();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find(p => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState(product?.flavorOptions?.[0] || "");
  const [isCustomFlavor, setIsCustomFlavor] = useState(false);
  const [customFlavor, setCustomFlavor] = useState("");
  const [weight, setWeight] = useState(product?.weightOptions?.[0] || "");
  const [size, setSize] = useState(product?.sizeOptions?.[0]?.name || "");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [message, setMessage] = useState("");
  const addItem = useCartStore(state => state.addItem);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, name: "", comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", String(params.id)),
      where("status", "==", "approved")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const r: any[] = [];
      snapshot.forEach(doc => r.push({ id: doc.id, ...doc.data() }));
      r.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setReviews(r);
    });
    return () => unsubscribe();
  }, [params.id]);

  const dynamicReviewCount = reviews.length;
  const dynamicRating = dynamicReviewCount > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / dynamicReviewCount).toFixed(1)
    : product?.rating || "0";

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: String(params.id),
        rating: newReview.rating,
        name: newReview.name,
        comment: newReview.comment,
        status: "pending",
        createdAt: serverTimestamp()
      });
      setNewReview({ rating: 5, name: "", comment: "" });
      toast.success("Review submitted! It will appear after moderation.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isWishlisted } = useWishlistStore();
  const isFavorite = product ? isWishlisted(product.id) : false;

  const toggleWishlist = () => {
    if (!product) return;
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (isLoading && !product) return <div className="max-md:pt-0 pt-32 text-center pb-24 h-screen">Loading product...</div>;
  if (!product) return <div className="max-md:pt-0 pt-32 text-center pb-24 h-screen">Product not found</div>;

  // Use the actual product image
  const imageSrc = product.images?.[0] || "/images/hero_bakery_1783112143212.png";

  const currentPrice = product?.sizeOptions?.find(s => s.name === size)?.price || product.price;

  const handleAddToCart = () => {
    addItem({
      ...product,
      price: currentPrice,
      quantity,
      selectedFlavor: isCustomFlavor ? customFlavor : flavor,
      selectedWeight: weight,
      selectedSize: size,
      message
    });
    toast.success(`${product.name} added to cart`);
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen max-md:pt-0 pt-24 pb-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <span className="hover:text-text-primary cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-text-primary cursor-pointer">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Gallery Area */}
          <div className="lg:w-1/2 space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-muted relative group"
            >
              <img 
                src={imageSrc} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }}
              />
              {/* 360 preview placeholder badge */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> 360° Preview Available
              </div>
            </motion.div>
            
            <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border-2 ${i === 0 ? 'border-gold' : 'border-transparent'}`}>
                  <img src={imageSrc} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Area */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24"
            >
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-fredoka text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full bg-bg-light hover:bg-secondary/30"><Share2 className="w-4 h-4" /></Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleWishlist}
                    className={`rounded-full transition-colors ${isFavorite ? 'bg-destructive/10 text-destructive' : 'bg-bg-light hover:bg-secondary/30 text-destructive'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-semibold text-sm">{dynamicRating}</span>
                </div>
                <span className="text-sm text-muted-foreground underline cursor-pointer">{dynamicReviewCount > 0 ? dynamicReviewCount : product.reviews} Reviews</span>
              </div>

              <p className="text-xl sm:text-2xl font-poppins font-bold text-text-primary mb-6">
                Rs. {currentPrice.toLocaleString()}
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Options */}
              <div className="space-y-6 mb-8">
                {product.flavorOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Flavor</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.flavorOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setFlavor(opt); setIsCustomFlavor(false); }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${flavor === opt && !isCustomFlavor ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt}
                        </button>
                      ))}
                      <button
                        onClick={() => setIsCustomFlavor(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isCustomFlavor ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                      >
                        Other (Custom)
                      </button>
                    </div>
                    {isCustomFlavor && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                        <Input 
                          value={customFlavor}
                          onChange={e => setCustomFlavor(e.target.value)}
                          placeholder="Type your desired flavor..." 
                          className="rounded-xl border-border-light focus-visible:ring-gold"
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {product.weightOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Weight</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.weightOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setWeight(opt)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${weight === opt ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizeOptions && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Select Size</Label>
                    <div className="flex flex-wrap gap-3">
                      {product.sizeOptions.map(opt => (
                        <button
                          key={opt.name}
                          onClick={() => setSize(opt.name)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${size === opt.name ? 'bg-secondary text-primary-foreground border-secondary' : 'bg-white border-border-light text-muted-foreground hover:border-gold'}`}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Message on Cake (Optional)</Label>
                  <Input 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Happy Birthday!" 
                    className="rounded-xl border-border-light focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Delivery Method</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'delivery' ? 'border-gold bg-gold/5 text-gold' : 'border-border-light text-muted-foreground hover:border-gold/50'}`}
                    >
                      <Truck className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Delivery</span>
                    </div>
                    <div 
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${deliveryType === 'pickup' ? 'border-gold bg-gold/5 text-gold' : 'border-border-light text-muted-foreground hover:border-gold/50'}`}
                    >
                      <Store className="w-6 h-6 mb-2" />
                      <span className="font-medium text-sm">Store Pickup</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Sticky-like behavior */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 py-6 border-t border-b border-border-light mb-8">
                <div className="flex items-center justify-between sm:justify-start border border-border-light rounded-full p-1 bg-bg-light">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full flex-1 rounded-full py-6 text-[17px] md:text-[18px] font-semibold bg-text-primary text-primary-foreground hover:bg-text-primary/90 min-h-[48px]"
                >
                  Add to My Box — Rs. {(currentPrice * quantity).toLocaleString()}
                </Button>
              </div>

              <div className="flex items-start gap-4 text-sm text-muted-foreground bg-bg-light p-4 rounded-xl border border-border-light">
                <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>Order now to receive by tomorrow. Freshly baked upon order confirmation. 100% vegetarian ingredients available upon request.</p>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Tabs section for Description, Ingredients, Reviews */}
        <div className="mb-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full flex overflow-x-auto flex-nowrap sm:flex-wrap justify-start border-b border-border-light rounded-none bg-transparent h-auto p-0 gap-6 md:gap-8 mb-8 hide-scrollbar">
              <TabsTrigger value="details" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Product Details</TabsTrigger>
              <TabsTrigger value="ingredients" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Ingredients & Nutrition</TabsTrigger>
              <TabsTrigger value="reviews" className="whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 text-sm md:text-base font-semibold data-[state=active]:text-text-primary px-0">Reviews ({dynamicReviewCount > 0 ? dynamicReviewCount : product.reviews})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="text-muted-foreground leading-relaxed">
              <p className="mb-4">Our {product.name} is a testament to our commitment to quality. Handcrafted by our master bakers, this cake features multiple layers of delicate sponge, perfectly balanced with our signature fillings and frostings. Every element is made from scratch using traditional recipes and premium imported ingredients.</p>
              <p>Storage Instructions: Keep refrigerated. Consume within 3 days for the best experience. Serve at room temperature.</p>
            </TabsContent>
            <TabsContent value="ingredients" className="text-muted-foreground leading-relaxed">
              <p className="mb-4"><strong>Ingredients:</strong> Premium wheat flour, free-range eggs, pure butter, refined sugar, Madagascar vanilla extract, baking powder, sea salt, full-cream milk.</p>
              <p><strong>Allergen Information:</strong> Contains gluten, dairy, and eggs. May contain traces of nuts as it is prepared in a facility that handles tree nuts.</p>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground italic text-center py-8">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-bg-light p-6 rounded-2xl border border-border-light">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-foreground font-bold uppercase">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{review.name}</p>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-gold text-gold' : 'fill-slate-200 text-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(review.createdAt.toDate()) : ''}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-bg-light p-6 sm:p-8 rounded-3xl border border-border-light mt-12">
                  <h3 className="font-fredoka text-xl font-bold mb-6">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label className="block mb-2">Rating</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            onClick={() => setNewReview({ ...newReview, rating: s })}
                            className={`w-6 h-6 cursor-pointer transition-colors ${s <= newReview.rating ? 'fill-gold text-gold' : 'fill-transparent text-slate-300 hover:text-gold'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="block mb-2">Your Name</Label>
                      <Input 
                        value={newReview.name} 
                        onChange={e => setNewReview({ ...newReview, name: e.target.value })} 
                        placeholder="John Doe" 
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">Your Review</Label>
                      <textarea 
                        value={newReview.comment} 
                        onChange={e => setNewReview({ ...newReview, comment: e.target.value })} 
                        placeholder="What did you think about this product?" 
                        required
                        rows={4}
                        className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <Button type="submit" disabled={isSubmittingReview} className="w-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 rounded-full py-6">
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-fredoka text-3xl font-bold mb-8 text-center md:text-left">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
