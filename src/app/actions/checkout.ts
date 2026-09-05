"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function validateCouponAction(code: string) {
  if (!code) return { success: false, error: "No code provided" };
  
  try {
    const docRef = adminDb.collection("coupons").doc(code.toUpperCase().replace(/\s+/g, ''));
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return { success: false, error: "Invalid coupon code" };
    }
    
    const couponData = docSnap.data();
    
    if (!couponData?.isActive) {
      return { success: false, error: "This coupon is no longer active" };
    }
    
    if (couponData?.expiryDate && new Date(couponData.expiryDate) < new Date()) {
      return { success: false, error: "This coupon has expired" };
    }
    
    return { 
      success: true, 
      coupon: {
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        minPurchase: couponData.minPurchase || 0
      } 
    };
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return { success: false, error: error.message || "Failed to validate coupon" };
  }
}

export async function submitOrderAction(orderData: any) {
  try {
    const docRef = await adminDb.collection("orders").add({
      ...orderData,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Auto-Customer Tracking
    if (orderData.customerPhone) {
      try {
        const customerId = orderData.customerPhone.toLowerCase().replace(/[^a-z0-9+]/g, '');
        const customerRef = adminDb.collection("customers").doc(customerId);
        
        const custDoc = await customerRef.get();
        if (custDoc.exists) {
          await customerRef.update({
            totalOrders: FieldValue.increment(1),
            lifetimeValue: FieldValue.increment(orderData.totalAmount || 0),
            lastOrderDate: FieldValue.serverTimestamp(),
            // Only update name if they provided a new one
            name: orderData.customerName ? orderData.customerName : custDoc.data()?.name,
            phone: orderData.customerPhone || custDoc.data()?.phone || "",
          });
        } else {
          await customerRef.set({
            name: orderData.customerName || "Anonymous",
            phone: orderData.customerPhone || "",
            totalOrders: 1,
            lifetimeValue: orderData.totalAmount || 0,
            createdAt: FieldValue.serverTimestamp(),
            lastOrderDate: FieldValue.serverTimestamp()
          });
        }
      } catch (custError) {
        console.error("Failed to update customer profile:", custError);
        // We don't fail the order if CRM tracking fails
      }
    }
    
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error("Error submitting order:", error);
    return { success: false, error: error.message || "Failed to place order" };
  }
}

export async function submitCustomOrderAction(orderData: any) {
  try {
    const docRef = await adminDb.collection("custom_orders").add({
      ...orderData,
      createdAt: Date.now(),
      status: 'new',
    });
    
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error("Error submitting custom order:", error);
    return { success: false, error: error.message || "Failed to place custom order" };
  }
}
