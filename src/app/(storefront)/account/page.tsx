"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, ShoppingBag, Heart, MapPin, Bell, Settings, LogOut 
} from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="bg-bg-light min-h-screen max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl font-bold mb-4 text-text-primary"
          >
            My Account
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Manage your orders, profile, and preferences.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Mobile Tabs */}
          <aside className="md:w-64 shrink-0">
            <div className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-6 border border-border-light shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 md:space-y-1 hide-scrollbar">
              {[
                { id: "profile", label: "Profile Details", icon: User },
                { id: "orders", label: "Order History", icon: ShoppingBag },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "addresses", label: "Saved Addresses", icon: MapPin },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 md:shrink md:w-full flex items-center space-x-2 md:space-x-3 px-4 py-2.5 md:py-3 rounded-xl transition-all whitespace-nowrap text-sm md:text-base ${
                      activeTab === item.id 
                        ? "bg-secondary/30 text-text-primary font-medium border border-secondary/50" 
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === item.id ? "text-gold" : ""}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
              
              <div className="pt-0 md:pt-4 mt-0 md:mt-4 border-l md:border-l-0 md:border-t border-border-light pl-2 md:pl-0 shrink-0">
                <button
                  onClick={() => toast("Logged out successfully")}
                  className="w-full flex items-center space-x-2 md:space-x-3 px-4 py-2.5 md:py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all whitespace-nowrap text-sm md:text-base"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-border-light shadow-sm min-h-[500px]"
            >
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <h2 className="font-fredoka text-2xl font-bold border-b border-border-light pb-4">Profile Details</h2>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center text-3xl font-bold text-gold">
                      JD
                    </div>
                    <div>
                      <Button variant="outline" className="rounded-full mb-2 border-border-light">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <form className="space-y-6 max-w-2xl" onSubmit={e => { e.preventDefault(); toast.success("Profile updated"); }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input defaultValue="Jane" className="rounded-xl py-6 text-base" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input defaultValue="Doe" className="rounded-xl py-6 text-base" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input defaultValue="jane.doe@example.com" type="email" className="rounded-xl py-6 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue="+92 300 1234567" type="tel" className="rounded-xl py-6 text-base" />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 px-8 min-h-[48px]">
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="font-fredoka text-2xl font-bold border-b border-border-light pb-4">Order History</h2>
                  
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-bg-light rounded-2xl p-6 border border-border-light">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 border-b border-border-light pb-4">
                        <div>
                          <p className="font-semibold">Order #BLN-100{i}</p>
                          <p className="text-sm text-muted-foreground">Placed on {new Date().toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${i === 1 ? 'bg-gold/10 text-gold' : 'bg-success/10 text-success'}`}>
                          {i === 1 ? 'Processing' : 'Delivered'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <img src={"/images/cat_gift_boxes_1783112178444.png"} alt="Product" className="w-16 h-16 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero_bakery_1783112143212.png" }} />
                        <div className="flex-1">
                          <p className="font-medium">Premium Cake</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                        <span className="font-semibold">Rs. 4,500</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab !== "profile" && activeTab !== "orders" && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Settings className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="font-fredoka text-2xl font-bold mb-2">Coming Soon</h2>
                  <p className="text-muted-foreground max-w-sm">This section is currently under development in the prototype.</p>
                </div>
              )}
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}
