import { db, storage } from './firebase-init.js';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const settingsRef = ref(db, 'settings');

// تحميل الإعدادات عند الفتح
onValue(settingsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.getElementById('shopName').value = data.name || '';
  document.getElementById('shopSubtitle').value = data.subtitle || '';
  document.getElementById('chairCount').value = data.chairCount || 0;
  document.getElementById('maxWaiting').value = data.maxWaiting || 0;
});

// حفظ الإعدادات
document.getElementById('saveSettings').onclick = () => {
  update(settingsRef, {
    name: shopName.value,
    subtitle: shopSubtitle.value,
    chairCount: Number(chairCount.value),
    maxWaiting: Number(maxWaiting.value)
  });

  alert('✅ تم الحفظ – الزوار سيرون التغييرات فورًا');
};

// رفع صورة
document.getElementById('galleryInput').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileRef = sRef(storage, 'gallery/' + Date.now());
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  update(settingsRef, {
    gallery: [url]
  });

  alert('📷 تم رفع الصورة');
};
