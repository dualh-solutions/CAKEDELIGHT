"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How far in advance should I order a custom cake?",
    answer: "For custom cakes, we recommend placing your order at least 48 to 72 hours in advance. For elaborate wedding cakes or large corporate events, please contact us 2-3 weeks prior to ensure availability."
  },
  {
    question: "Do you offer vegan or gluten-free options?",
    answer: "Currently, our primary menu features traditional baking methods using premium dairy and wheat. However, we do occasionally offer special dietary options. Please contact our Attock branch directly to discuss specific requirements."
  },
  {
    question: "What is your delivery radius?",
    answer: "We deliver within a 15km radius of our Attock and Rawalpindi branches. Delivery charges are calculated at checkout based on your exact location. Free delivery is available for orders over Rs. 3000."
  },
  {
    question: "How should I store my cake?",
    answer: "Most of our cakes should be refrigerated if not consumed immediately. However, for the best taste and texture, we recommend taking the cake out of the fridge 30-45 minutes before serving so it can come to room temperature."
  },
  {
    question: "Can I change my order after it's been placed?",
    answer: "Modifications to standard orders can be made up to 24 hours before the scheduled delivery/pickup time. Custom cake orders cannot be modified within 48 hours of the scheduled time as preparation has already begun."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-4 block">
            Support
          </span>
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our products, ordering, and delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border-light shadow-sm"
        >
          <Accordion className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-poppins font-semibold text-lg hover:text-primary transition-colors min-h-[44px] py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
