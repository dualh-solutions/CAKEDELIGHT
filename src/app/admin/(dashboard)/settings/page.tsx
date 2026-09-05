"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Store, Mail, Phone, Lock, Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase/client";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Attock Cake Delight");
  const [currency, setCurrency] = useState("PKR");
  const [whatsapp, setWhatsapp] = useState("+923001234567");
  const [acceptingOrders, setAcceptingOrders] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "store");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.storeName) setStoreName(data.storeName);
          if (data.currency) setCurrency(data.currency);
          if (data.whatsapp) setWhatsapp(data.whatsapp);
          if (typeof data.acceptingOrders === "boolean") setAcceptingOrders(data.acceptingOrders);
        }
      } catch (error) {
        console.error("Error loading store settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Save store settings to Firestore
      await setDoc(doc(db, "settings", "store"), {
        storeName,
        currency,
        whatsapp,
        acceptingOrders,
        updatedAt: Date.now(),
      }, { merge: true });

      // 2. If user entered a new password, update it in Firebase Auth
      if (newPassword) {
        if (!auth.currentUser) {
          throw new Error("No active admin login session found. Please log out and sign in again.");
        }
        if (!currentPassword) {
          throw new Error("Please enter your Current Password to verify your identity before setting a new password.");
        }
        if (newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }

        const email = auth.currentUser.email || "admin@attockcakedelight.com";
        const credential = EmailAuthProvider.credential(email, currentPassword);

        // Reauthenticate first so Firebase Auth allows password update
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // Update password
        await updatePassword(auth.currentUser, newPassword);

        toast.success("Settings and password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.success("Settings saved successfully!");
      }
    } catch (error: any) {
      console.error("Settings save error:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Incorrect Current Password. Please check and try again.");
      } else if (error.code === "auth/weak-password") {
        toast.error("New password must be at least 6 characters long.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("Your session has expired. Please log out and sign in again to change password.");
      } else {
        toast.error(error.message || "Failed to save settings");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex justify-center items-center bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your store preferences, contact details, and admin security.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Store Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Store Details</h2>
          </div>
          <div className="p-4 md:p-6 grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input 
                  id="storeName" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select 
                  id="currency" 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="PKR">Pakistani Rupee (Rs.)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Primary WhatsApp Number (For Orders)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="whatsapp" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                  className="pl-9" 
                  required 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Configuration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Store Status</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Accepting Orders</p>
                <p className="text-sm text-slate-500">Temporarily disable checkout if the bakery is closed.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={acceptingOrders}
                  onChange={(e) => setAcceptingOrders(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Admin Account */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-900">Admin Security & Password</h2>
          </div>
          <div className="p-4 md:p-6 grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" value="admin@attockcakedelight.com" className="pl-9 bg-slate-50" readOnly />
              </div>
              <p className="text-xs text-slate-500">Your admin email is fixed to admin@attockcakedelight.com.</p>
            </div>

            <div className="border-t border-slate-100 pt-4 grid gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Change Admin Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your current password to verify your identity before setting a new password.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="Enter new password (min. 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end pt-4 pb-20 md:pb-4">
          <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white shadow-sm px-8 w-full sm:w-auto">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
