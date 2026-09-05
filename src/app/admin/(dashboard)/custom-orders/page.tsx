"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, MessageSquare, Clock, CheckCircle, Eye, Calendar, DollarSign, Store, Phone } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BRANCHES, BranchId } from "@/lib/store/branchStore";

interface CustomOrder {
  id: string;
  name: string;
  phone: string;
  description: string;
  referenceImage?: string;
  status: 'new' | 'reviewed' | 'accepted' | 'declined';
  createdAt: number;
  fulfillmentDate?: string;
  estimatedPrice?: number;
  branchId?: string;
  configuration?: {
    occasion?: string;
    size?: string;
    flavor?: string;
    design?: string;
    message?: string;
    instructions?: string;
  };
}

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "custom_orders"), (snapshot) => {
      const ords: CustomOrder[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as CustomOrder);
      });
      // Sort newest first
      ords.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(ords);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching custom orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.name?.toLowerCase().includes(search.toLowerCase()) || 
    o.phone?.includes(search)
  );

  const handleStatusChange = async (id: string, newStatus: CustomOrder['status']) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, "custom_orders", id), {
        status: newStatus
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">New Request</span>;
      case 'reviewed': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Reviewed</span>;
      case 'accepted': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Accepted</span>;
      case 'declined': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Declined</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Custom Orders</h1>
          <p className="text-slate-500 mt-2">Review custom cake requests submitted by customers.</p>
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
              placeholder="Search by customer name or phone..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading requests...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No requests found matching your search." : "No custom cake requests received yet."}
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:flex flex-col divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-row gap-6">
                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{order.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 gap-4 mt-1">
                        <span>{order.phone}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p>{order.description || "No description provided."}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {updating === order.id ? (
                      <Button disabled variant="outline" size="sm"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</Button>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStatusChange(order.id, 'reviewed')}
                          disabled={order.status === 'reviewed'}
                        >
                          Mark as Reviewed
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white" 
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                          disabled={order.status === 'accepted'}
                        >
                          Accept Request
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleStatusChange(order.id, 'declined')}
                          disabled={order.status === 'declined'}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Reference Image */}
                {order.referenceImage && (
                  <div className="md:w-48 shrink-0 flex flex-col gap-2">
                    <p className="text-xs font-medium text-slate-500 uppercase">Reference Image</p>
                    <img 
                      src={order.referenceImage} 
                      alt="Reference" 
                      className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col p-4 space-y-5 bg-slate-50/30">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {order.referenceImage && (
                  <div className="relative h-32 w-full bg-slate-100">
                    <img 
                      src={order.referenceImage} 
                      alt="Reference" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                      <span className="text-white font-semibold shadow-sm">{order.name}</span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                )}
                
                <div className="p-4 flex flex-col gap-4">
                  {!order.referenceImage && (
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-slate-900">{order.name}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{order.phone}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm text-slate-700 italic flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="line-clamp-3">{order.description || "No description provided."}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50 mt-1">
                    {updating === order.id ? (
                      <Button disabled variant="outline" className="col-span-2 min-h-[44px] rounded-xl"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedOrder(order)}
                          className="min-h-[44px] rounded-xl text-slate-700 border-slate-200 shadow-sm"
                        >
                          Details
                        </Button>
                        {order.status !== 'accepted' && order.status !== 'declined' ? (
                          <Button 
                            className="bg-primary hover:bg-primary/90 text-white min-h-[44px] rounded-xl shadow-sm"
                            onClick={() => handleStatusChange(order.id, 'accepted')}
                          >
                            Accept
                          </Button>
                        ) : order.status === 'accepted' ? (
                          <Button disabled variant="outline" className="min-h-[44px] rounded-xl border-green-200 bg-green-50 text-green-700">
                            Accepted
                          </Button>
                        ) : (
                          <Button disabled variant="outline" className="min-h-[44px] rounded-xl border-red-200 bg-red-50 text-red-700">
                            Declined
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              Order Details
              <div className="text-sm font-normal">
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Customer</p>
                  <p className="font-medium text-slate-900">{selectedOrder.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <p className="font-medium text-slate-900">{selectedOrder.phone}</p>
                </div>
              </div>

              {/* Order Meta */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Fulfillment Date</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedOrder.fulfillmentDate || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Store className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pickup Branch</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedOrder.branchId && BRANCHES[selectedOrder.branchId as BranchId] 
                        ? BRANCHES[selectedOrder.branchId as BranchId].name 
                        : selectedOrder.branchId || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Estimated Price</p>
                    <p className="text-sm font-semibold text-slate-900">Rs. {selectedOrder.estimatedPrice?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description / Configuration */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Configuration & Instructions</p>
                
                {selectedOrder.configuration ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {selectedOrder.configuration.occasion && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Occasion</p>
                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.configuration.occasion}</p>
                      </div>
                    )}
                    {selectedOrder.configuration.size && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Size & Shape</p>
                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.configuration.size}</p>
                      </div>
                    )}
                    {selectedOrder.configuration.flavor && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Flavor</p>
                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.configuration.flavor}</p>
                      </div>
                    )}
                    {selectedOrder.configuration.design && (
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Design Style</p>
                        <p className="text-sm text-slate-800 font-medium">{selectedOrder.configuration.design}</p>
                      </div>
                    )}
                    
                    <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Custom Message / Writing on Cake</p>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic text-sm text-slate-700 min-h-[40px]">
                        {selectedOrder.configuration.message ? `"${selectedOrder.configuration.message}"` : "No custom message provided."}
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Special Instructions</p>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50 min-h-[40px]">
                        {selectedOrder.configuration.instructions || "No special instructions provided."}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedOrder.description.split('. ').map((sentence, idx) => (
                      sentence ? <p key={idx} className="mb-1">• {sentence.trim()}</p> : null
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
                {selectedOrder.status !== 'accepted' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white" 
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'accepted');
                      setSelectedOrder(null);
                    }}
                  >
                    Accept Order
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
