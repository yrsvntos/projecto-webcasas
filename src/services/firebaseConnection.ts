// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5-wF-9GIXIL7xRmeN8ZWhm2F-RWcWajY",
  authDomain: "webcasas-a874f.firebaseapp.com",
  projectId: "webcasas-a874f",
  storageBucket: "webcasas-a874f.firebasestorage.app",
  messagingSenderId: "94739535379",
  appId: "1:94739535379:web:0e8083ea8c89a6ff9b91e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};