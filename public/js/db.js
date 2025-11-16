// db.js
import { getFirestore, doc, setDoc, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { app } from './main-app-ref.js';

// NOTE: main-app-ref.js just re-exports the initialized app if you prefer.
// For simplicity we will initialize Firestore lazily using the firebase app from auth module.
// If you rename files, adapt accordingly.

let db = null;
function ensureDb() {
  if (!db) {
    // attempt to import app from auth init; if not available, initialize separately
    try {
      // eslint-disable-next-line
      import('./main.js'); // ensure main loaded
    } catch (e) {
      // ignore
    }
    db = getFirestore();
  }
  return db;
}

/** Create a user doc in 'users' collection */
export async function createUserDoc(uid, data) {
  const database = ensureDb();
  const ref = doc(database, 'users', uid);
  await setDoc(ref, data, { merge: true });
  return ref;
}

/** write a single log entry (small helper used by logger) */
export async function writeLogEntry(entry) {
  const database = ensureDb();
  const ref = await addDoc(collection(database, 'logs'), entry);
  return ref;
}
