"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product, CATEGORIES } from "@/lib/mockData";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push(doc.data() as Product);
      });
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="font-fredoka text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1">Manage your bakery menu, pricing, and availability.</p>
        </div>
        <Button 
          onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-white shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search products by name..." 
              className="pl-9 bg-white border-slate-200 text-sm focus-visible:ring-primary focus-visible:ring-1 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="w-full sm:w-auto h-9 items-center justify-between whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-700"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No products found.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400 border border-slate-200">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {product.stock > 0 ? (
                        <span>{product.stock} in stock</span>
                      ) : (
                        <span className="text-red-500 font-medium">Out of stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                        className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col p-4 space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 border border-slate-200 shrink-0">No img</div>
                )}
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="font-semibold text-slate-900 truncate text-base mb-0.5">{product.name}</h3>
                  <p className="text-xs text-slate-500 mb-2 truncate">{product.category}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Rs. {product.price.toLocaleString()}</span>
                    {product.stock > 0 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{product.stock} left</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md">Out of stock</span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                  className="absolute top-2 right-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full h-8 w-8"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl border-none p-0 bg-transparent shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Product Form</DialogTitle>
          <DialogDescription className="sr-only">Create or edit a product</DialogDescription>
          {isFormOpen && (
            <ProductForm 
              initialData={editingProduct || undefined} 
              onSuccess={() => setIsFormOpen(false)}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
