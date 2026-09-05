"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Save, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Product } from "@/lib/mockData";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  // Local state for tracking unsaved stock changes
  const [localStocks, setLocalStocks] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStockChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setLocalStocks(prev => ({ ...prev, [id]: num }));
  };

  const saveStock = async (id: string) => {
    if (localStocks[id] === undefined) return;
    
    setUpdatingStock(id);
    try {
      await updateDoc(doc(db, "products", id), {
        stock: localStocks[id]
      });
      toast.success("Stock updated");
      // Remove from local tracking once saved
      setLocalStocks(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update stock");
    } finally {
      setUpdatingStock(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-2">Quickly manage stock levels for all products.</p>
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
              placeholder="Search by product name or category..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-primary" /> Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const currentStock = localStocks[product.id] !== undefined ? localStocks[product.id] : (product.stock || 0);
                  const isLowStock = currentStock > 0 && currentStock <= 5;
                  const isOutOfStock = currentStock === 0;
                  const hasUnsavedChanges = localStocks[product.id] !== undefined;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                      <td className="px-6 py-4 text-slate-600">{product.category}</td>
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Input 
                          type="number" 
                          min="0"
                          value={currentStock} 
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className={`w-24 h-8 text-center ${hasUnsavedChanges ? 'border-amber-400 focus-visible:ring-amber-500' : ''}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm" 
                          onClick={() => saveStock(product.id)}
                          disabled={!hasUnsavedChanges || updatingStock === product.id}
                          className={hasUnsavedChanges ? "bg-primary hover:bg-primary/90 text-white" : "bg-slate-100 text-slate-400"}
                        >
                          {updatingStock === product.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
                          Save
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
