"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Mail, Trash2, MailOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await updateDoc(doc(db, "messages", msg.id), { read: true });
      } catch (error) {
        console.error("Error marking as read", error);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        toast.success("Message deleted successfully");
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } catch (error) {
        console.error("Error deleting message", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.subject.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.firstName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-500">View and manage customer inquiries.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search messages..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No messages found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={msg.id}
                onClick={() => markAsRead(msg)}
                className={`p-4 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${!msg.read ? 'bg-primary/5' : ''}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${!msg.read ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {!msg.read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-medium truncate ${!msg.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {msg.firstName} {msg.lastName}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0">
                      {msg.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(msg.createdAt.toDate()) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mb-1 truncate">{msg.subject}</p>
                  <p className="text-sm text-slate-500 truncate">{msg.message}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(msg.id, e)} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl bg-white">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessage.firstName} {selectedMessage.lastName} ({selectedMessage.email})
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
