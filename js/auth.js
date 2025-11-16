// auth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged as firebaseOnAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';
import { createUserDoc } from './db.js';

let app = null;
let auth = null;

export function initAuth() {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  return { app, auth };
}

/**
 * Register a student: creates Firebase Auth user + Firestore user doc
 * payload: { name, email, password, department }
 * returns: firebase user object
 */
export async function registerStudent(payload) {
  if (!auth) initAuth();
  const { name, email, password, department } = payload;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  // create user document (role=student, approved=false initially)
  await createUserDoc(user.uid, {
    name,
    email,
    role: 'student',
    approved: false,
    department: department || null,
    createdAt: new Date().toISOString()
  });
  return user;
}

export async function login(email, password) {
  if (!auth) initAuth();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  if (!auth) initAuth();
  return signOut(auth);
}

/** callback receives firebase user or null */
export function onAuthStateChanged(cb) {
  if (!auth) initAuth();
  firebaseOnAuthStateChanged(auth, cb);
}
