

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
});

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

const adminDb = getFirestore();

async function test(code) {
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
  } catch (error) {
    return { success: false, error: error.message || "Failed to validate coupon" };
  }
}

test("EID20").then(console.log);
test("eid20").then(console.log);
