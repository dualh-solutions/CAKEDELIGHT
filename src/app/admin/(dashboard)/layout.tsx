"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Loader2 } from "lucide-react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  PackageSearch, 
  Boxes, 
  Tags, 
  Cake, 
  MapPin, 
  Truck, 
  Ticket, 
  LineChart, 
  Megaphone, 
  Image as ImageIcon, 
  Settings,
  Search,
  Bell,
  Menu,
  ChevronLeft,
  LogOut,
  Plus,
  User as UserIcon,
  X,
  MessageSquare,
  Star
} from "lucide-react";
import { useBranchStore, BRANCHES } from "@/lib/store/branchStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Custom Cakes", href: "/admin/custom-orders", icon: Cake },
  { name: "Products", href: "/admin/products", icon: PackageSearch },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Branches", href: "/admin/branches", icon: MapPin },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  { name: "Media", href: "/admin/gallery", icon: ImageIcon },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const BOTTOM_NAV_ITEMS = [
  { name: "Home", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Cakes", href: "/admin/custom-orders", icon: Cake },
  { name: "Stats", href: "/admin/analytics", icon: LineChart },
  { name: "Account", href: "/admin/settings", icon: UserIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Desktop state
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [adminBranchFilter, setAdminBranchFilter] = useState("ALL");
  
  // Mobile states
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileFabOpen, setMobileFabOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Mobile scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsBottomNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsBottomNavVisible(false);
        setMobileFabOpen(false); // Close FAB on scroll down
      } else if (currentScrollY < lastScrollY) {
        setIsBottomNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileDrawerOpen]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
  };

  const desktopSidebarWidth = isSidebarOpen ? 260 : 72;

  return (
    <div className="min-h-screen bg-slate-50 flex font-poppins text-slate-900 selection:bg-primary/20">
      
      {/* =========================================
          DESKTOP SIDEBAR (Hidden on mobile)
      ========================================= */}
      <motion.aside
        animate={{ width: desktopSidebarWidth }}
        className="hidden md:flex bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-50 flex-col transition-all overflow-hidden"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
          {isSidebarOpen && (
            <Link href="/admin" className="font-fredoka text-xl font-bold tracking-tight text-yellow-400 truncate hover:opacity-90 transition-opacity">
              CAKE DELIGHT ADMIN
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="shrink-0 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-1 px-3">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                    isActive 
                      ? "bg-secondary/20 text-slate-900 font-medium" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-700"}`} />
                  {isSidebarOpen && (
                    <span className="text-sm truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-200 shrink-0">
            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-full bg-secondary/40 flex items-center justify-center text-primary font-bold">
                  SA
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-semibold truncate text-slate-900">System Admin</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0 text-slate-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.aside>

      {/* =========================================
          MOBILE DRAWER (Hidden on desktop)
      ========================================= */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white/95 backdrop-blur-xl border-r border-slate-200/50 z-[101] flex flex-col rounded-r-2xl shadow-2xl md:hidden overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <Link href="/admin" className="font-fredoka text-xl font-bold tracking-tight text-yellow-400 hover:opacity-90 transition-opacity">
                  CAKE DELIGHT ADMIN
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileDrawerOpen(false)} className="rounded-full text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Profile Card */}
              <div className="p-5 bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                    SA
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold truncate text-slate-900">System Admin</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-slate-400"}`} />
                      <span className="text-[15px]">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="w-full rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 min-h-[48px]"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all md:pl-[var(--desktop-sidebar)] pb-24 md:pb-0"
        style={{ '--desktop-sidebar': `${desktopSidebarWidth}px` } as any}
      >
        {/* DESKTOP HEADER (Hidden on mobile) */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 sticky top-0 z-40 items-center justify-between px-6">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search orders, customers, or products..."
              className="w-full pl-9 bg-slate-50 border-slate-200 rounded-lg text-sm focus-visible:ring-primary focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-3">Filter Dashboard:</span>
              <Select value={adminBranchFilter} onValueChange={(val) => setAdminBranchFilter(val || '')}>
                <SelectTrigger className="w-[180px] h-9 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Branches</SelectItem>
                  {Object.values(BRANCHES).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-lg text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-lg text-slate-600">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* MOBILE APP BAR (Hidden on desktop) */}
        <header className="md:hidden flex h-16 bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => setMobileDrawerOpen(true)} className="rounded-full text-slate-600">
            <Menu className="w-6 h-6" />
          </Button>
          <div className="font-fredoka text-lg font-bold tracking-tight text-yellow-400">
            CAKE DELIGHT ADMIN
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-full text-slate-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-50/50 md:bg-slate-50 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* =========================================
          MOBILE FAB & BOTTOM NAV (Hidden on desktop)
      ========================================= */}
      
      {/* Floating Action Button & Mini Menu */}
      <div className="md:hidden fixed bottom-24 right-4 z-50 flex flex-col items-end">
        <AnimatePresence>
          {mobileFabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="flex flex-col gap-3 mb-4 items-end"
            >
              {[
                { label: "New Order", icon: ShoppingBag, href: "/admin/orders/new" },
                { label: "New Cake", icon: Cake, href: "/custom-cake" },
                { label: "New Product", icon: PackageSearch, href: "/admin/products/new" },
              ].map((action, i) => (
                <Link key={i} href={action.href} onClick={() => setMobileFabOpen(false)}>
                  <div className="flex items-center gap-3">
                    <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-slate-700">{action.label}</span>
                    <div className="w-10 h-10 rounded-full bg-white text-primary shadow-md flex items-center justify-center">
                      <action.icon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileFabOpen(!mobileFabOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-colors duration-300 ${
            mobileFabOpen ? 'bg-slate-800' : 'bg-primary'
          }`}
        >
          <motion.div animate={{ rotate: mobileFabOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Plus className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </div>

      {/* Persistent Bottom Navigation */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe transition-transform duration-300 ease-in-out ${
          isBottomNavVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-2">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center w-12 h-14 relative group">
                <div className={`relative flex items-center justify-center transition-all duration-300 ${isActive ? "text-primary -translate-y-1 scale-110" : "text-slate-400 group-hover:text-slate-600"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? "text-primary opacity-100 mt-1" : "text-slate-500 opacity-80 mt-0.5"}`}>
                  {item.name}
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="adminBottomNavIndicator"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay to close FAB menu */}
      <AnimatePresence>
        {mobileFabOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileFabOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}
