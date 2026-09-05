"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Map, Loader2, Edit2, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  minOrderValue: number;
  estimatedTime: string;
}

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [fee, setFee] = useState<number>(0);
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "delivery_zones"), (snapshot) => {
      const z: DeliveryZone[] = [];
      snapshot.forEach((doc) => {
        z.push({ id: doc.id, ...doc.data() } as DeliveryZone);
      });
      setZones(z);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching delivery zones:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(search.toLowerCase())
  );

  const openForm = (zone?: DeliveryZone) => {
    if (zone) {
      setEditingZone(zone);
      setName(zone.name);
      setFee(zone.fee);
      setMinOrderValue(zone.minOrderValue);
      setEstimatedTime(zone.estimatedTime);
    } else {
      setEditingZone(null);
      setName("");
      setFee(0);
      setMinOrderValue(0);
      setEstimatedTime("30-45 mins");
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Zone name is required");

    setIsSubmitting(true);
    try {
      const id = editingZone?.id || name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, "delivery_zones", id), {
        id, 
        name, 
        fee: Number(fee), 
        minOrderValue: Number(minOrderValue), 
        estimatedTime
      });
      toast.success(editingZone ? "Delivery zone updated" : "Delivery zone created");
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save delivery zone");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery zone?")) return;
    
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, "delivery_zones", id));
      toast.success("Delivery zone deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete delivery zone");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delivery Zones</h1>
          <p className="text-slate-500 mt-2">Manage delivery areas, fees, and minimum order values.</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Zone
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
              placeholder="Search by zone name..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading delivery zones...
          </div>
        ) : filteredZones.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No zones found matching your search." : "No delivery zones created yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Zone Name</th>
                  <th className="px-6 py-4">Delivery Fee</th>
                  <th className="px-6 py-4">Min. Order Value</th>
                  <th className="px-6 py-4">Est. Delivery Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Map className="w-4 h-4 text-primary shrink-0" />
                        {zone.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {zone.fee === 0 ? <span className="text-green-600">Free</span> : `Rs. ${zone.fee}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {zone.minOrderValue === 0 ? "None" : `Rs. ${zone.minOrderValue}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {zone.estimatedTime || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openForm(zone)}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(zone.id)}
                        disabled={isDeleting === zone.id}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                      >
                        {isDeleting === zone.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingZone ? "Edit Delivery Zone" : "New Delivery Zone"}</DialogTitle>
            <DialogDescription>
              Configure delivery areas and their respective rules.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Zone Name (e.g. Islamabad Sector F)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">Delivery Fee (Rs.)</Label>
                  <Input id="fee" type="number" min="0" value={fee} onChange={(e) => setFee(Number(e.target.value))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Min Order (Rs.)</Label>
                  <Input id="minOrderValue" type="number" min="0" value={minOrderValue} onChange={(e) => setMinOrderValue(Number(e.target.value))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
                <Input id="estimatedTime" placeholder="e.g. 45-60 mins" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Zone
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
