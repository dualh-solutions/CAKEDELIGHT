import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Product, PRODUCTS, CATEGORIES } from '@/lib/mockData';

export const revalidate = 0; // Disable cache for now to ensure fresh data

export async function GET() {
  return NextResponse.json({ 
    products: PRODUCTS, 
    categories: CATEGORIES,
    source: 'mock' 
  });
}
