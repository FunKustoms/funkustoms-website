import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Try to load from JSON file first, then fall back to environment variables
let serviceAccountKey;
const jsonPath = path.join(process.cwd(), '.env.firebase.json');

try {
  if (fs.existsSync(jsonPath)) {
    serviceAccountKey = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else {
    // Fall back to environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase credentials in server/.env');
    }

    serviceAccountKey = {
      projectId,
      clientEmail,
      privateKey,
    };
  }
} catch (error) {
  console.error('Error loading Firebase credentials:', error);
  throw error;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

export const adminApp = admin.app();
export const db = admin.firestore();
export default admin;
