import { db, storage } from './firebase-init.js';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

  const saveBtn = document.getElementById('saveSettings');
  const galleryInput = document.getElementById('galleryInput');

  if (!saveBtn) {
    console.error('❌ زر saveSettings غير موجود في HTML');
    return;
  }

  const settingsRef = ref(db, 'settings');

  saveBtn.onclick = () => {
    update(settingsRef, {
      name: shopName.value,
      subtitle: shopSubtitle.value,
      chairCount: Number(chairCount.value),
      maxWaiting: Number(maxWaiting.value)
    });

    alert('✅ تم الحفظ – الزوار يرون التغيير فورًا');
  };

  galleryInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileRef = sRef(storage, 'gallery/' + Date.now());
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    update(settingsRef, { gallery: [url] });
    alert('📷 تم رفع الصورة');
  };

});
