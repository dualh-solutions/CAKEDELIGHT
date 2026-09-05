"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { motion } from "framer-motion";
import { LineChart, DollarSign, ShoppingBag, Users, Activity, BarChart3, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  productRef?: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: number;
  items: OrderItem[];
  email: string;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    customers: 0,
    avgOrderValue: 0
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<{name: string, sales: number, rev: number}[]>([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let revenue = 0;
      let deliveredCount = 0;
      let orderCount = snapshot.docs.length;
      const uniqueEmails = new Set<string>();
      
      const dailyRevenue: Record<string, number> = {};
      const productTally: Record<string, {sales: number, rev: number}> = {};

      snapshot.docs.forEach(doc => {
        const order = doc.data() as Order;
        if (order.email) uniqueEmails.add(order.email);

        if (order.status === "delivered") {
          revenue += order.totalAmount || 0;
          deliveredCount++;

          // Build Chart Data (Daily)
          const date = new Date(order.createdAt);
          const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailyRevenue[dateString] = (dailyRevenue[dateString] || 0) + (order.totalAmount || 0);
        }

        // Tally products
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const name = item.name || "Unknown Item";
            if (!productTally[name]) {
              productTally[name] = { sales: 0, rev: 0 };
            }
            productTally[name].sales += item.quantity || 1;
            productTally[name].rev += (item.price || 0) * (item.quantity || 1);
          });
        }
      });

      // Format KPIs
      setKpi({
        totalRevenue: revenue,
        totalOrders: orderCount,
        customers: uniqueEmails.size,
        avgOrderValue: deliveredCount > 0 ? Math.round(revenue / deliveredCount) : 0
      });

      // Format Chart Data
      const formattedChart = Object.keys(dailyRevenue).map(date => ({
        date,
        revenue: dailyRevenue[date]
      }));
      setChartData(formattedChart);

      // Format Top Products
      const formattedProducts = Object.keys(productTally).map(name => ({
        name,
        sales: productTally[name].sales,
        rev: productTally[name].rev
      }));
      formattedProducts.sort((a, b) => b.rev - a.rev);
      setTopProducts(formattedProducts.slice(0, 5)); // Top 5

      setLoading(false);
    }, (error) => {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 mt-2">Track your sales, revenue, and store performance.</p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {[
          { title: "Total Revenue", value: `Rs. ${kpi.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
          { title: "Total Orders", value: kpi.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600" },
          { title: "Total Customers", value: kpi.customers.toString(), icon: Users, color: "text-purple-600" },
          { title: "Avg Order Value", value: `Rs. ${kpi.avgOrderValue.toLocaleString()}`, icon: Activity, color: "text-orange-600" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-row items-center justify-between"
          >
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
            <LineChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a33a3a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a33a3a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `Rs.${value/1000}k`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#a33a3a" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
                <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                <p>No revenue data yet</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Top Products</h2>
          </div>
          <div className="p-6">
            {topProducts.length > 0 ? (
              <div className="space-y-6">
                {topProducts.map((prod, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 max-w-[150px] truncate" title={prod.name}>{prod.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{prod.sales} sales</p>
                      </div>
                    </div>
                    <div className="font-semibold text-primary text-sm">
                      Rs. {prod.rev.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-10">
                No product sales yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
