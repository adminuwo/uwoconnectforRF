import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCLYBlLMK3YizQ24p2xVgfxZlnFkhbsnqU",
  authDomain: "ai-mall-484810.firebaseapp.com",
  projectId: "ai-mall-484810",
  storageBucket: "ai-mall-484810.firebasestorage.app",
  messagingSenderId: "743928421487",
  appId: "1:743928421487:web:0d9f9320d4fdf892bd019a",
  measurementId: "G-769N9LKL88"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

export {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
};
