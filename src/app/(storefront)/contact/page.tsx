"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageCircle, Camera, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBranchStore } from "@/lib/store/branchStore";

const faqs = [
  {
    question: "Do you offer custom cakes for weddings and events?",
    answer: "Yes, we specialize in bespoke custom cakes for all occasions. Please contact us at least 2 weeks in advance for weddings and large events, and 48 hours for regular birthday cakes."
  },
  {
    question: "What are your delivery areas?",
    answer: "We currently deliver across Attock, Taxila, and surrounding areas. Delivery charges vary based on distance."
  },
  {
    question: "Do you have gluten-free or vegan options?",
    answer: "Yes! We have a dedicated selection of vegan and gluten-friendly desserts. However, our kitchen handles wheat and dairy, so we cannot guarantee 100% absence of traces."
  },
  {
    question: "How do I store my cake?",
    answer: "Most of our cakes should be refrigerated until about 1-2 hours before serving. They taste best at room temperature. Fondant cakes should be kept in a cool, air-conditioned room, not the fridge."
  }
];

export default function ContactPage() {
  const { getCurrentBranch } = useBranchStore();
  const branch = getCurrentBranch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false,
      });
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-light min-h-screen max-md:pt-0 pt-32 pb-24">
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl md:text-5xl font-bold mb-4 text-text-primary"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            We'd love to hear from you. Whether you have a question about our cakes, pricing, or anything else, our team is ready to answer all your questions.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-border-light shadow-sm"
          >
            <h2 className="font-fredoka text-3xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" className="rounded-xl bg-bg-light border-none py-6 text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="rounded-xl bg-bg-light border-none py-6 text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className="rounded-xl bg-bg-light border-none py-6 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input required name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" className="rounded-xl bg-bg-light border-none py-6 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea 
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..." 
                  className="w-full min-h-[150px] p-4 rounded-xl bg-bg-light border-none focus:outline-none focus:ring-2 focus:ring-gold resize-none text-base"
                />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full min-h-[48px] rounded-full bg-text-primary text-primary-foreground hover:bg-text-primary/90 py-6 text-base">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-secondary/10 p-8 rounded-3xl border border-secondary/30">
              <h3 className="font-fredoka text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Visit Us</h4>
                    <p className="text-muted-foreground mt-1 whitespace-pre-line">{branch.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Call Us</h4>
                    <p className="text-muted-foreground mt-1">{branch.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Email Us</h4>
                    <p className="text-muted-foreground mt-1">{branch.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-secondary/30">
                <h4 className="font-semibold text-text-primary mb-4">Connect with us</h4>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/attockcakedelight4251/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-text-primary shadow-sm hover:bg-gold hover:text-white transition-all">
                    <Camera className="w-5 h-5" />
                  </a>
                  <a href="https://www.facebook.com/104000102288059?ref=NONE_xav_ig_profile_page_web" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-text-primary shadow-sm hover:bg-gold hover:text-white transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href={branch.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm hover:bg-[#128C7E] transition-all px-4 gap-2 font-medium">
                    <MessageCircle className="w-5 h-5" /> WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border-light shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center shrink-0 text-gold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-fredoka text-2xl font-bold">Business Hours</h3>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Thursday</span>
                  <span className="font-medium text-text-primary">10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium text-text-primary">02:00 PM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-medium text-text-primary">10:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Map & FAQs */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Map Embed */}
          <div className="bg-muted rounded-3xl overflow-hidden min-h-[400px] relative border border-border-light">
            <iframe 
              src="https://maps.google.com/maps?q=Kamra,+Cant,+Attock,+Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="font-fredoka text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <Accordion className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border-light">
                  <AccordionTrigger className="text-left font-poppins text-base hover:text-gold data-[state=open]:text-gold min-h-[44px] py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

      </div>
    </div>
  );
}
