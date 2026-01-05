import { db, storage } from "./firebase-init.js";
import { doc, setDoc, onSnapshot } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const settingsRef = doc(db, "siteSettings", "main");

// حفظ الإعدادات
document.getElementById("saveSettingsBtn").onclick = async () => {
  const data = {
    name: shopName.value,
    subtitle: shopSubtitle.value,
    chairCount: Number(chairCount.value),
    maxWaiting: Number(maxWaiting.value),
    updatedAt: Date.now()
  };

  await setDoc(settingsRef, data, { merge: true });
  alert("✅ تم الحفظ – الزوار يرون التغييرات فورًا");
};

// تحديث فوري للزوار
onSnapshot(settingsRef, (snap) => {
  if (!snap.exists()) return;
  const s = snap.data();
  document.querySelector(".shop-name").textContent = s.name;
  document.querySelector(".shop-subtitle").textContent = s.subtitle;
});
