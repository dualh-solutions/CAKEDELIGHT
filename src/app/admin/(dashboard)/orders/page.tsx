"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Filter, CheckCircle, Clock, Truck, Loader2, MapPin, Phone, Package, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: any;
  items: any[];
  address?: string;
  fulfillmentMethod?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      ords.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setOrders(ords);
      setLoading(false);
      
      // Update selected order if it's currently open
      if (selectedOrder) {
        const updated = ords.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedOrder]);

  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Truck className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'processing': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'delivered': return "bg-green-50 text-green-700 border-green-200";
      case 'cancelled': return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "orders", selectedOrder.id), {
        status: newStatus
      });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-slate-500 mt-2">Manage incoming orders and delivery statuses.</p>
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
              placeholder="Search by Order ID or Customer Name..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {search ? "No orders found matching your search." : "No orders have been placed yet."}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.customerName}
                      <div className="text-xs text-slate-500 font-normal">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1.5 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      Rs. {order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col p-4 space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-0.5 uppercase">#{order.id.slice(0, 8)}</p>
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerPhone}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Package className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{order.items?.length || 0} items ({order.fulfillmentMethod || 'Delivery'})</span>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-lg">Rs. {order.totalAmount?.toLocaleString() || 0}</span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                  className="w-full mt-2 min-h-[44px] rounded-xl border-slate-200 text-slate-700 font-semibold"
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>

      {/* Order Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">Order #{selectedOrder.id.slice(0,8)}</DialogTitle>
                    <DialogDescription className="mt-1">
                      Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                    </DialogDescription>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> Customer Info
                    </h4>
                    <p className="text-sm font-medium text-slate-700">{selectedOrder.customerName}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> Fulfillment
                    </h4>
                    <p className="text-sm font-medium text-slate-700 capitalize">{selectedOrder.fulfillmentMethod || 'Delivery'}</p>
                    {selectedOrder.address && (
                      <p className="text-sm text-slate-500">{selectedOrder.address}</p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" /> Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="flex-1 pr-4">
                          <p className="font-medium text-slate-900">{item.quantity || 1}x {item.name}</p>
                          {item.message && <p className="text-xs text-slate-500 mt-0.5">Inscription: "{item.message}"</p>}
                        </div>
                        <span className="font-semibold text-slate-900 whitespace-nowrap">
                          Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-bold text-lg text-primary">
                    <span>Total</span>
                    <span>Rs. {selectedOrder.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Update Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    onClick={() => handleUpdateStatus('processing')}
                    disabled={isUpdating || selectedOrder.status === 'processing'}
                  >
                    Mark as Processing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => handleUpdateStatus('delivered')}
                    disabled={isUpdating || selectedOrder.status === 'delivered'}
                  >
                    Mark as Delivered
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={isUpdating || selectedOrder.status === 'cancelled'}
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
