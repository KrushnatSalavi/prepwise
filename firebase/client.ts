// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgAQ2K4wxHWemp_c-K2fDm4s-a3sjPD40",
  authDomain: "prepwise-5df37.firebaseapp.com",
  projectId: "prepwise-5df37",
  storageBucket: "prepwise-5df37.firebasestorage.app",
  messagingSenderId: "124010133489",
  appId: "1:124010133489:web:092f904379950d00a63650",
  measurementId: "G-DGTV3YKZ0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);