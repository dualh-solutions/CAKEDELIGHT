const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
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

async function run() {
  console.log("Starting migration...");
  const ordersSnap = await adminDb.collection("orders").get();
  
  const customers = {};

  ordersSnap.forEach(doc => {
    const order = doc.data();
    if (order.customerPhone) {
      const customerId = order.customerPhone.toLowerCase().replace(/[^a-z0-9+]/g, '');
      if (!customers[customerId]) {
        customers[customerId] = {
          name: order.customerName || "Anonymous",
          phone: order.customerPhone || "",
          totalOrders: 0,
          lifetimeValue: 0,
          createdAt: order.createdAt || FieldValue.serverTimestamp(),
          lastOrderDate: order.createdAt || FieldValue.serverTimestamp()
        };
      }
      customers[customerId].totalOrders += 1;
      customers[customerId].lifetimeValue += (order.totalAmount || 0);
      
      // Update last order date if newer
      if (order.createdAt && customers[customerId].lastOrderDate) {
         if (order.createdAt.toMillis && customers[customerId].lastOrderDate.toMillis) {
             if (order.createdAt.toMillis() > customers[customerId].lastOrderDate.toMillis()) {
                 customers[customerId].lastOrderDate = order.createdAt;
             }
         }
      }
    }
  });

  const batch = adminDb.batch();
  let count = 0;
  for (const [id, data] of Object.entries(customers)) {
    const ref = adminDb.collection("customers").doc(id);
    batch.set(ref, data, { merge: true });
    count++;
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Successfully migrated ${count} customers!`);
  } else {
    console.log("No customers to migrate.");
  }
}

run().catch(console.error);
