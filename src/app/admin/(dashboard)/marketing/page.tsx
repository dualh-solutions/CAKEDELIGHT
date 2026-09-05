"use client";

import { motion } from "framer-motion";
import { Megaphone, Mail, Bell, Share2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminMarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Marketing</h1>
          <p className="text-slate-500 mt-2">Manage your campaigns, newsletters, and promotional announcements.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Megaphone className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Active Campaigns", value: "3", icon: Megaphone, trend: "+12%" },
          { title: "Newsletter Subscribers", value: "1,245", icon: Mail, trend: "+8%" },
          { title: "Social Clicks", value: "48.2k", icon: Share2, trend: "+24%" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" /> {stat.trend} from last month
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Campaigns</h2>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No active campaigns</h3>
          <p className="text-slate-500 max-w-sm mb-6">Create your first marketing campaign to reach out to your customers with new products and offers.</p>
          <Button variant="outline">Create Campaign</Button>
        </div>
      </motion.div>
    </div>
  );
}
