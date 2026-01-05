import { db, storage } from './firebase-init.js';
import { ref, set, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const settingsRef = ref(db, 'settings');

// حفظ الإعدادات النصية
document.getElementById('saveSettings').onclick = () => {
  const data = {
    name: shopName.value,
    subtitle: shopSubtitle.value,
    chairCount: Number(chairCount.value),
    maxWaiting: Number(maxWaiting.value)
  };

  update(settingsRef, data);
  alert('تم حفظ الإعدادات – الزوار سيرونها فورًا');
};

// رفع صورة للمعرض
document.getElementById('galleryInput').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileRef = sRef(storage, 'gallery/' + Date.now() + file.name);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  const snap = await fetchCurrentSettings();
  const gallery = snap.gallery || [];
  gallery.push(url);

  update(settingsRef, { gallery });
};

async function fetchCurrentSettings() {
  const res = await fetch(
    'https://the-barber-company-302a4-default-rtdb.firebaseio.com/settings.json'
  );
  return res.json();
}
<script type="module" src="firebase-init.js"></script>
<script type="module" src="admin.js"></script>
