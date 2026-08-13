import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    // Prefer GOOGLE_APPLICATION_CREDENTIALS when available
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath && fs.existsSync(credPath)) {
      initializeApp();
      return { auth: getAuth(), db: getFirestore() };
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Debug info (avoid printing the full key)
    console.debug("FIREBASE_PRIVATE_KEY present:", !!privateKey);
    console.debug("FIREBASE_PRIVATE_KEY contains BEGIN:", privateKey?.includes("-----BEGIN"));
    console.debug("FIREBASE_PRIVATE_KEY contains escaped \\n+:", privateKey?.includes("\\n"));
    console.debug("FIREBASE_PRIVATE_KEY length:", privateKey?.length ?? 0);

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin credentials not found in env; skipping initialization.");
      return { auth: null as any, db: null as any };
    }

    // Normalize private key: strip surrounding quotes, convert escaped newlines, normalize CRLF
    privateKey = privateKey.trim();
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    privateKey = privateKey.replace(/\r\n/g, "\n");

    // If looks like base64 (no spaces, contains = at end), try decoding
    if (!privateKey.includes("-----BEGIN") && /^[A-Za-z0-9+/=\r\n]+$/.test(privateKey)) {
      try {
        const decoded = Buffer.from(privateKey, "base64").toString("utf8");
        if (decoded.includes("-----BEGIN")) privateKey = decoded;
      } catch (e) {
        // ignore decoding errors and proceed with original value
      }
    }

    try {
      console.debug("Initializing Firebase Admin with privateKey preview:", privateKey.slice(0, 30).replace(/\n/g, "\\n") + "...");
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      console.error("Failed to initialize Firebase Admin SDK:", err);
      throw err;
    }
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

export function getAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("Firebase Admin SDK should only be used on the server.");
  }

  if (_auth && _db) return { auth: _auth, db: _db };

  const { auth, db } = initFirebaseAdmin();
  _auth = auth;
  _db = db;
  return { auth, db };
}