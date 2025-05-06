// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3vG_ZT1ZTHKKJQYSd5VTX1H1yNGN8e9M",
  authDomain: "frontend-project-react-ono.firebaseapp.com",
  projectId: "frontend-project-react-ono",
  storageBucket: "frontend-project-react-ono.firebasestorage.app",
  messagingSenderId: "137651834655",
  appId: "1:137651834655:web:79d2c2738acc99747cea2a",
  measurementId: "G-QRYSL0X4CF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
