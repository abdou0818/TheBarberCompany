// تأكد من تغيير القيم بقيم مشروعك الخاص على Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "ضع هنا مفتاح API",
  authDomain: "ضع هنا authDomain",
  databaseURL: "ضع هنا رابط قاعدة البيانات", // مهم جدًا لتجنب خطأ 404
  projectId: "ضع هنا projectId",
  storageBucket: "ضع هنا storageBucket",
  messagingSenderId: "ضع هنا messagingSenderId",
  appId: "ضع هنا appId"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
