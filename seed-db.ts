import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import { PRODUCTS, CATEGORIES } from './src/lib/mockData';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
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
  const batch = adminDb.batch();
  console.log('Seeding', PRODUCTS.length, 'products and', CATEGORIES.length, 'categories...');
  for (const p of PRODUCTS) {
    const ref = adminDb.collection('products').doc(p.id);
    batch.set(ref, p);
  }
  for (const [idx, cat] of CATEGORIES.entries()) {
    const id = cat.toLowerCase().replace(/\s+/g, '-');
    const ref = adminDb.collection('categories').doc(id);
    batch.set(ref, { id, name: cat, order: idx });
  }
  await batch.commit();
  console.log('Seeding completed successfully!');
}

run().catch(console.error);
