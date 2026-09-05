"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Trash2, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved';
  createdAt: any;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs: Review[] = [];
      snapshot.forEach((doc) => {
        revs.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(revs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "reviews", id), { status: 'approved' });
      toast.success("Review approved");
    } catch (error) {
      console.error("Error approving review", error);
      toast.error("Failed to approve review");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
        toast.success("Review deleted successfully");
      } catch (error) {
        console.error("Error deleting review", error);
        toast.error("Failed to delete review");
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.comment.toLowerCase().includes(search.toLowerCase()) ||
    r.productId.toLowerCase().includes(search.toLowerCase())
  );

  const pendingReviews = filteredReviews.filter(r => r.status === 'pending');
  const approvedReviews = filteredReviews.filter(r => r.status === 'approved');

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ReviewList = ({ list }: { list: Review[] }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-4">
      {list.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No reviews found in this category.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {list.map((review, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={review.id}
              className="p-6 flex flex-col sm:flex-row items-start gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{review.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      Product ID: {review.productId}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {review.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(review.createdAt.toDate()) : 'Just now'}
                  </span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
              </div>

              <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100 justify-end">
                {review.status === 'pending' && (
                  <Button variant="outline" size="sm" onClick={(e) => handleApprove(review.id, e)} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(review.id, e)} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reviews Moderation</h1>
          <p className="text-sm text-slate-500">Approve or delete customer reviews before they appear on the site.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search reviews..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200"
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Approved ({approvedReviews.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <ReviewList list={pendingReviews} />
        </TabsContent>
        <TabsContent value="approved">
          <ReviewList list={approvedReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
