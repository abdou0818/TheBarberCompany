import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBA4lhTkkLBZWYYqMw-FY1jEKETaKFymjQ",
  authDomain: "the-barber-company-302a4.firebaseapp.com",
  projectId: "the-barber-company-302a4",
  storageBucket: "the-barber-company-302a4.appspot.com",
  messagingSenderId: "1001421518378",
  appId: "1:1001421518378:web:5ff4852c39736e58a8f553"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
