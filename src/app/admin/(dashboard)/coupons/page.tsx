"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Edit2, Trash2, Plus, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  isActive: boolean;
  expiryDate?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [minPurchase, setMinPurchase] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "coupons"), (snapshot) => {
      const c: Coupon[] = [];
      snapshot.forEach((doc) => {
        c.push({ id: doc.id, ...doc.data() } as Coupon);
      });
      setCoupons(c);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching coupons:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openForm = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue);
      setMinPurchase(coupon.minPurchase || 0);
      setIsActive(coupon.isActive);
      setExpiryDate(coupon.expiryDate || "");
    } else {
      setEditingCoupon(null);
      setCode("");
      setDiscountType("percentage");
      setDiscountValue(10);
      setMinPurchase(0);
      setIsActive(true);
      setExpiryDate("");
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Coupon code is required");

    setIsSubmitting(true);
    try {
      const id = editingCoupon?.id || code.toUpperCase().replace(/\s+/g, '');
      await setDoc(doc(db, "coupons", id), {
        id, 
        code: code.toUpperCase(), 
        discountType,
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase),
        isActive,
        expiryDate
      });
      toast.success(editingCoupon ? "Coupon updated" : "Coupon created");
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, "coupons", id));
      toast.success("Coupon deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Coupons & Discounts</h1>
          <p className="text-slate-500 mt-2">Create promotional codes to offer discounts to customers.</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by coupon code..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading coupons...
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No coupons found matching your search." : "No coupons created yet."}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min. Purchase</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-fit">
                        <Percent className="w-3.5 h-3.5 text-primary shrink-0" />
                        {coupon.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`} Off
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {coupon.minPurchase === 0 ? "None" : `Rs. ${coupon.minPurchase}`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openForm(coupon)}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(coupon.id)}
                        disabled={isDeleting === coupon.id}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                      >
                        {isDeleting === coupon.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Ticket Cards View */}
          <div className="md:hidden flex flex-col p-4 space-y-4">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
                {/* Top Ticket Section */}
                <div className="bg-primary/5 p-5 border-b border-dashed border-slate-200 flex justify-between items-center relative">
                  <div className="absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-slate-50 border-r border-t border-slate-200"></div>
                  <div className="absolute -right-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-slate-50 border-l border-t border-slate-200"></div>
                  
                  <div className="flex items-center gap-2 font-mono font-bold text-xl text-primary">
                    <Percent className="w-5 h-5 shrink-0" />
                    {coupon.code}
                  </div>
                  {coupon.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">Active</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">Inactive</span>
                  )}
                </div>
                
                {/* Bottom Ticket Section */}
                <div className="p-5 bg-white relative">
                  <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-slate-50 border-r border-b border-slate-200"></div>
                  <div className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-slate-50 border-l border-b border-slate-200"></div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Discount</p>
                      <p className="font-bold text-slate-900 text-lg">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue}`} Off
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Min. Purchase</p>
                      <p className="font-semibold text-slate-700">
                        {coupon.minPurchase === 0 ? "None" : `Rs. ${coupon.minPurchase}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Expires</p>
                      <p className="text-sm font-medium text-slate-600">
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openForm(coupon)} className="h-9 w-9 rounded-xl text-slate-500 border-slate-200 shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(coupon.id)} disabled={isDeleting === coupon.id} className="h-9 w-9 rounded-xl text-red-500 border-red-100 bg-red-50 shadow-sm">
                        {isDeleting === coupon.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "New Coupon"}</DialogTitle>
            <DialogDescription>
              Create promotional discount codes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER10" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <select 
                    id="discountType" 
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Value</Label>
                  <Input id="discountValue" type="number" min="0" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPurchase">Minimum Purchase (Rs.)</Label>
                <Input id="minPurchase" type="number" min="0" value={minPurchase} onChange={(e) => setMinPurchase(Number(e.target.value))} />
                <p className="text-xs text-slate-500">Leave as 0 for no minimum requirement.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isActive" className="font-medium cursor-pointer">Coupon is currently active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Coupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
