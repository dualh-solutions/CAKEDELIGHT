"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, Edit2, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "branches"), (snapshot) => {
      const b: Branch[] = [];
      snapshot.forEach((doc) => {
        b.push({ id: doc.id, ...doc.data() } as Branch);
      });
      setBranches(b);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching branches:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openForm = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setName(branch.name || "");
      setAddress(branch.address || "");
      setPhone(branch.phone || "");
      setEmail(branch.email || "");
      setStatus(branch.status || "active");
    } else {
      setEditingBranch(null);
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setStatus("active");
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    setIsSubmitting(true);
    try {
      const id = editingBranch?.id || name.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, "branches", id), {
        id, 
        name: name || "", 
        address: address || "", 
        phone: phone || "", 
        email: email || "", 
        status: status || "active"
      });
      toast.success(editingBranch ? "Branch updated" : "Branch created");
      setIsFormOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Branches</h1>
          <p className="text-slate-500 mt-2">Manage your physical bakery locations and operating status.</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <MapPin className="w-4 h-4 mr-2" /> Add Branch
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500 flex justify-center items-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading branches...
          </div>
        ) : branches.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No branches found.
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all">
              <div className="p-4 md:p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-slate-900">{branch.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    branch.status === 'active' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {branch.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <span>{branch.address || 'No address provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{branch.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{branch.email || 'No email'}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                <Button variant="outline" className="w-full bg-white" onClick={() => openForm(branch)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                </Button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBranch ? "Edit Branch" : "New Branch"}</DialogTitle>
            <DialogDescription>
              Update your bakery's location details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Operating Status</Label>
                <select 
                  id="status" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as 'active'|'inactive')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="active">Active (Open)</option>
                  <option value="inactive">Inactive (Temporarily Closed)</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Branch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
