import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export let app: FirebaseApp;
let auth: any;

const firebaseConfig = {
  apiKey: "AIzaSyC2c45DnPk_Uju6pKCYdyFXYY2wHVFzAAM",
authDomain: "allregistration-f828a.firebaseapp.com",
projectId: "allregistration-f828a",
storageBucket: "allregistration-f828a.firebasestorage.app",
messagingSenderId: "183241775507",
appId: "1:183241775507:web:e778f83d89d8f0df4b7066",
measurementId: "G-SZ1BTCZEEY"
};

try {
  app = getApp('app');
  auth = getAuth(app);
} catch (e) {
  app = initializeApp(firebaseConfig, 'app');
  auth = getAuth(app);
}

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default firebase;

export async function logout() {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user?.user;
  } catch (e: any) {
    throw new Error(e?.code); //auth/invalid-login-credentials
  }
}

export async function signup(email: string, password: string) {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user?.user;
  } catch (e: any) {
    throw new Error(e?.code); //auth/email-already-in-use
  }
}
