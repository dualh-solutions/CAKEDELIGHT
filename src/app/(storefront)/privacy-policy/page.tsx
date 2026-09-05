"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-light max-md:pt-0 pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-border-light shadow-sm prose prose-sage max-w-none"
        >
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold mb-8 text-text-primary">
            Privacy Policy
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Attock Cake Delight ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Attock Cake Delight.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Information We Collect</h3>
          <p className="text-muted-foreground mb-6">
            We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. The collected information includes your name, email address, mailing address, phone number, and payment details.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">How We Use Your Information</h3>
          <ul className="text-muted-foreground mb-6 list-disc pl-6 space-y-2">
            <li>To personalize your experience and better respond to your individual needs.</li>
            <li>To improve our website based on the information and feedback we receive from you.</li>
            <li>To process transactions quickly and securely.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
          </ul>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Data Security</h3>
          <p className="text-muted-foreground mb-6">
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database.
          </p>

          <h3 className="font-fredoka text-2xl font-bold mt-10 mb-4">Contacting Us</h3>
          <p className="text-muted-foreground mb-6">
            If there are any questions regarding this privacy policy, you may contact us using the information on our Contact page or by emailing contact@attockcakedelight.com.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
