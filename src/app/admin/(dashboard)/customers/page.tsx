"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Loader2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  lifetimeValue: number;
  createdAt: any;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const custs: Customer[] = [];
      snapshot.forEach((doc) => {
        custs.push({ id: doc.id, ...doc.data() } as Customer);
      });
      // Sort by highest lifetime value by default
      custs.sort((a, b) => (b.lifetimeValue || 0) - (a.lifetimeValue || 0));
      setCustomers(custs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-2">View your customer base, order history, and lifetime value.</p>
        </div>
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
              placeholder="Search by name, phone or email..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No customers found matching your search." : "No customers have registered yet."}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-right">Lifetime Value</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary font-semibold">
                          {customer.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-slate-900">{customer.name || 'Anonymous User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 space-y-1">
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />
                          <span className="text-xs">{customer.phone}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs">{customer.email}</span>
                        </div>
                      )}
                      {!customer.phone && !customer.email && <span className="text-xs text-slate-400">No contact info</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {customer.createdAt ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {customer.totalOrders || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-primary">
                      Rs. {customer.lifetimeValue?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col p-4 space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-secondary/30 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                    {customer.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-base">{customer.name || 'Anonymous User'}</h3>
                    <p className="text-xs text-slate-500 mb-1">Joined {customer.createdAt ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                    
                    {customer.phone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs truncate">{customer.phone}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 self-start -mt-2 -mr-2">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Orders</span>
                    <span className="font-bold text-slate-800">{customer.totalOrders || 0}</span>
                  </div>
                  <div className="bg-primary/5 p-2.5 rounded-xl border border-primary/10 flex flex-col">
                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-0.5">Spent</span>
                    <span className="font-bold text-primary">Rs. {customer.lifetimeValue?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
    </div>
  );
}
