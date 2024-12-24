// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfHWAfrQZWd76p47dMMneQq2q4PEZ-cac",
  authDomain: "aprobaciones-oleflores.firebaseapp.com",
  projectId: "aprobaciones-oleflores",
  storageBucket: "aprobaciones-oleflores.firebasestorage.app",
  messagingSenderId: "1070837136052",
  appId: "1:1070837136052:web:b75feb1da48622a1c835e1",
  measurementId: "G-DRLL7G5T43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);