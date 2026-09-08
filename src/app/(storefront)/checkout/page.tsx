"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, MessageCircle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBranchStore, BRANCHES, BranchId } from "@/lib/store/branchStore";

import { validateCouponAction, submitOrderAction } from "@/app/actions/checkout";
import { Loader2, CheckCircle, X } from "lucide-react";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const router = useRouter();
  
  const { selectedBranchId, setBranch } = useBranchStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "",
    fulfillmentMethod: "delivery", // 'delivery' | 'pickup'
    address: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  } | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  const subtotal = getSubtotal();
  const delivery = formData.fulfillmentMethod === 'delivery' && subtotal > 0 ? 300 : 0;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }
  
  const total = Math.max(0, subtotal - discountAmount) + delivery;

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      const res = await validateCouponAction(couponCode.trim());
      
      if (!res.success) {
        toast.error(res.error || "Failed to apply coupon");
        setAppliedCoupon(null);
        return;
      }
      
      const couponData = res.coupon;
      
      if (!couponData) {
        toast.error("Failed to apply coupon");
        setAppliedCoupon(null);
        return;
      }
      
      if (couponData.minPurchase && couponData.minPurchase > 0 && subtotal < couponData.minPurchase) {
        toast.error(`Minimum purchase of Rs. ${couponData.minPurchase} required`);
        return;
      }
      
      setAppliedCoupon({
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue
      });
      toast.success("Coupon applied successfully!");
      setCouponCode("");
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.phone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (formData.fulfillmentMethod === 'delivery' && !formData.address) {
      toast.error("Please enter your delivery address");
      return;
    }

    setIsSubmitting(true);
    
    // Open window early to prevent browser popup blockers during async await
    const targetWin = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();
      const branchName = Object.values(BRANCHES).find(b => b.id === selectedBranchId)?.name || 'Unknown Branch';
      
      const orderPayload = {
        customerName,
        customerPhone: formData.phone,
        fulfillmentMethod: formData.fulfillmentMethod,
        address: formData.fulfillmentMethod === 'delivery' ? formData.address : "",
        branchId: selectedBranchId,
        branchName,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: item.description || "",
          message: item.message || "",
          selectedFlavor: item.selectedFlavor || "",
          selectedWeight: item.selectedWeight || "",
          selectedSize: item.selectedSize || ""
        })),
        subtotal,
        discountAmount,
        couponCode: appliedCoupon?.code || null,
        deliveryFee: delivery,
        totalAmount: total,
        status: 'pending',
        source: 'whatsapp'
      };

      const res = await submitOrderAction(orderPayload);
      
      let message = `🎂 *New Order - Attock Cake Delight*\n`;
      if (res.success && res.orderId) {
        message += `*Order ID:* #${res.orderId.slice(0, 8).toUpperCase()}\n`;
      }
      message += `\n*Customer:* ${customerName}\n`;
      message += `*Phone:* ${formData.phone}\n`;
      message += `*Branch:* ${branchName}\n`;
      message += `*Method:* ${formData.fulfillmentMethod === 'delivery' ? 'Delivery' : 'Store Pickup'}\n`;
      
      if (formData.fulfillmentMethod === 'delivery' && formData.address) {
        message += `*Address:* ${formData.address}\n`;
      }
      
      message += `\n*Order Details:*\n`;
      
      items.forEach(item => {
        message += `• ${item.quantity}x ${item.name}`;
        
        if (item.id.startsWith('custom-cake')) {
          message += `\n  *Details:* ${item.description}`;
        } else {
          const details = [];
          if (item.selectedFlavor) details.push(item.selectedFlavor);
          if (item.selectedWeight) details.push(item.selectedWeight);
          if (item.selectedSize) details.push(item.selectedSize);
          
          if (details.length > 0) {
            message += ` (${details.join(', ')})`;
          }
          
          if (item.message) {
            message += `\n  *Cake Message:* "${item.message}"`;
          }
        }
        message += `\n`;
      });
      
      message += `\n*Total Amount:* Rs. ${total.toLocaleString()}`;

      const whatsappNumber = "923327659882";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      toast.success("Order saved! Redirecting to WhatsApp...");
      clearCart();
      setIsSubmitting(false);
      
      if (targetWin) {
        targetWin.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
      router.push("/");

    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An error occurred while saving order. Redirecting to WhatsApp...");
      setIsSubmitting(false);
      
      // Fallback redirect if error occurred
      const fallbackUrl = `https://wa.me/923327659882`;
      if (targetWin) {
        targetWin.location.href = fallbackUrl;
      } else {
        window.location.href = fallbackUrl;
      }
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-light min-h-screen max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1">
            <h2 className="font-fredoka text-3xl font-bold mb-6 text-text-primary">Complete Your Order</h2>
            
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-border-light shadow-sm flex flex-col gap-8">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border-light pb-2">1. Select Branch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(BRANCHES).map(branch => (
                    <div 
                      key={branch.id}
                      onClick={() => setBranch(branch.id as BranchId)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedBranchId === branch.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-light bg-white hover:border-primary/30'}`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedBranchId === branch.id ? 'border-primary text-primary' : 'border-muted-foreground'}`}>
                        {selectedBranchId === branch.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">{branch.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{branch.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border-light pb-2">2. Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} className="rounded-xl text-base" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} className="rounded-xl text-base" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input type="tel" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="rounded-xl text-base" placeholder="03XXXXXXXXX" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border-light pb-2">3. Fulfillment</h3>
                <div className="flex gap-4 p-1 bg-muted/50 rounded-xl w-full sm:w-auto border border-border-light">
                  <button 
                    onClick={() => updateForm('fulfillmentMethod', 'delivery')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.fulfillmentMethod === 'delivery' ? 'bg-white shadow-sm text-text-primary border border-border-light' : 'text-muted-foreground hover:text-text-primary'}`}
                  >
                    Delivery
                  </button>
                  <button 
                    onClick={() => updateForm('fulfillmentMethod', 'pickup')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.fulfillmentMethod === 'pickup' ? 'bg-white shadow-sm text-text-primary border border-border-light' : 'text-muted-foreground hover:text-text-primary'}`}
                  >
                    Store Pickup
                  </button>
                </div>

                {formData.fulfillmentMethod === 'delivery' && (
                  <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-border-light mt-4">
                    <div className="flex items-center gap-2 mb-2 text-text-primary font-medium">
                      <MapPin className="w-4 h-4 text-gold" /> Delivery Address *
                    </div>
                    <div className="space-y-2">
                      <Input value={formData.address} onChange={e => updateForm('address', e.target.value)} className="rounded-xl bg-white text-base" placeholder="Enter your full address" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-border-light shadow-sm sticky top-32">
              <h3 className="font-fredoka text-xl font-bold mb-6">Summary</h3>
              
              <div className="space-y-4 text-sm text-muted-foreground mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-text-primary font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">{appliedCoupon.code}</span>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-red-500 ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-medium">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                {formData.fulfillmentMethod === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-text-primary font-medium">Rs. {delivery.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {!appliedCoupon && (
                <div className="flex gap-2 mb-6 border-t border-border-light pt-6">
                  <Input 
                    placeholder="Coupon Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-xl text-base"
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center py-4 border-t border-border-light mb-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-poppins font-bold text-2xl text-text-primary">Rs. {total.toLocaleString()}</span>
              </div>

              <Button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full min-h-[48px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-6 flex items-center justify-center text-lg shadow-md transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? "Processing..." : "Confirm via WhatsApp"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing this order, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
