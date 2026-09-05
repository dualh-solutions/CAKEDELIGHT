import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: any = null;

try {
  if (!getApps().length) {
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      console.warn("Missing Firebase Admin credentials in .env.local. Admin SDK will not be initialized.");
    } else {
      let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
      if (privateKey) {
        privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
      }
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  if (getApps().length > 0) {
    adminDb = getFirestore();
  }
} catch (error) {
  console.error('Firebase Admin initialization error', error);
}

export { adminDb };
