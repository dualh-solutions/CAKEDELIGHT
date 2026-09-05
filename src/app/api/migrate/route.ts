import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { PRODUCTS, CATEGORIES } from '@/lib/mockData';

export async function GET(request: Request) {
  // Simple protection: only allow migration if a secret key is provided in the URL
  // e.g. /api/migrate?secret=cakoo123
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'cakoo123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!adminDb) {
      throw new Error("Firebase Admin not initialized. Check .env.local credentials.");
    }

    const batch = adminDb.batch();

    // Migrate Products
    for (const product of PRODUCTS) {
      // Use the existing mock ID as the document ID for consistency
      const productRef = adminDb.collection('products').doc(product.id);
      batch.set(productRef, product);
    }

    // Migrate Categories
    for (const [index, category] of CATEGORIES.entries()) {
      const categoryId = category.toLowerCase().replace(/\s+/g, '-');
      const categoryRef = adminDb.collection('categories').doc(categoryId);
      batch.set(categoryRef, {
        id: categoryId,
        name: category,
        order: index
      });
    }

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${PRODUCTS.length} products and ${CATEGORIES.length} categories to Firestore.` 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
