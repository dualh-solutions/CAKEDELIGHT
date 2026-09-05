const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./cakoo-981c3-firebase-adminsdk-fbsvc-a9bfb888e0.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrate() {
  console.log('Starting migration of custom orders...');
  
  const ordersSnapshot = await db.collection('orders').get();
  let migratedCount = 0;
  let deletedOrdersCount = 0;
  let updatedOrdersCount = 0;

  for (const doc of ordersSnapshot.docs) {
    const orderData = doc.data();
    const items = orderData.items || [];
    
    // Find all custom cake items in this order
    const customCakeItems = items.filter(item => item.category === 'Custom Cakes');
    const regularItems = items.filter(item => item.category !== 'Custom Cakes');
    
    if (customCakeItems.length > 0) {
      // Migrate each custom cake item into its own custom_orders document
      for (const customItem of customCakeItems) {
        await db.collection('custom_orders').add({
          name: orderData.customerName || 'Unknown Customer',
          phone: orderData.customerPhone || 'Unknown Phone',
          description: customItem.description || customItem.name,
          referenceImage: customItem.images && customItem.images.length > 0 ? customItem.images[0] : null,
          status: 'new',
          createdAt: orderData.createdAt ? orderData.createdAt.toMillis() : Date.now(),
          originalOrderId: doc.id // For reference
        });
        migratedCount++;
      }
      
      // Update or delete the original order
      if (regularItems.length === 0) {
        // If the order ONLY contained custom cakes, delete it entirely so it doesn't show in Orders
        await db.collection('orders').doc(doc.id).delete();
        deletedOrdersCount++;
        console.log(`Deleted order ${doc.id} as it only contained custom cakes.`);
      } else {
        // Recalculate totals
        const newSubtotal = regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let discountAmount = 0;
        // Basic discount recalculation (assuming fixed if applied, though we don't have the original coupon doc here)
        // If it was percentage, this might be slightly off, but it's an edge case.
        if (orderData.discountAmount && orderData.subtotal) {
            discountAmount = Math.min(orderData.discountAmount, newSubtotal); // Prevent negative total
        }

        const newTotal = Math.max(0, newSubtotal - discountAmount) + (orderData.deliveryFee || 0);

        await db.collection('orders').doc(doc.id).update({
          items: regularItems,
          subtotal: newSubtotal,
          totalAmount: newTotal,
          discountAmount: discountAmount
        });
        updatedOrdersCount++;
        console.log(`Updated order ${doc.id} by removing custom cakes.`);
      }
    }
  }
  
  console.log('Migration complete!');
  console.log(`Migrated ${migratedCount} custom cake items.`);
  console.log(`Deleted ${deletedOrdersCount} empty orders.`);
  console.log(`Updated ${updatedOrdersCount} mixed orders.`);
}

migrate().catch(console.error);
