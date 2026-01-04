// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA4lhTkkLBZWYYqMw-FY1jEKETaKFymjQ",
  authDomain: "the-barber-company-302a4.firebaseapp.com",
  projectId: "the-barber-company-302a4",
  storageBucket: "the-barber-company-302a4.firebasestorage.app",
  messagingSenderId: "1001421518378",
  appId: "1:1001421518378:web:5ff4852c39736e58a8f553",
  measurementId: "G-X6MHRDF6RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
