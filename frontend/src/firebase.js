// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvLM7QrLBMtiymjusNXI6fRcT5HTBaUow",
  authDomain: "bulmarks-ab0c8.firebaseapp.com",
  projectId: "bulmarks-ab0c8",
  storageBucket: "bulmarks-ab0c8.appspot.com",
  messagingSenderId: "932759329827",
  appId: "1:932759329827:web:a0a1ce16a3e0f9e19c6596"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();