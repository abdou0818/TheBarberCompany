import { db, storage } from './firebase-init.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// عناصر الصفحة
const shopName = document.getElementById('shopName');
const shopSubtitle = document.getElementById('shopSubtitle');
const chairCount = document.getElementById('chairCount');
const maxWaiting = document.getElementById('maxWaiting');
const galleryInput = document.getElementById('galleryInput');
const saveSettings = document.getElementById('saveSettings');
const settingsModal = document.getElementById('settingsModal');
const openSettings = document.getElementById('openSettings');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const galleryGrid = document.querySelector('.gallery-grid');

const settingsRef = ref(db, 'settings');

// فتح/إغلاق المودال
openSettings.onclick = () => settingsModal.style.display = 'flex';
closeSettingsBtn.onclick = () => settingsModal.style.display = 'none';
window.onclick = (e) => { if(e.target === settingsModal) settingsModal.style.display='none'; };

// جلب الإعدادات الحالية وعرضها
async function fetchSettings() {
  const res = await fetch('https://the-barber-company-302a4-default-rtdb.firebaseio.com/settings.json');
  const data = await res.json();
  if(!data) return;

  shopName.value = data.name || '';
  shopSubtitle.value = data.subtitle || '';
  chairCount.value = data.chairCount || 0;
  maxWaiting.value = data.maxWaiting || 0;

  // عرض الصور
  if(Array.isArray(data.gallery)){
    galleryGrid.innerHTML = '';
    data.gallery.forEach(url => {
      const div = document.createElement('div');
      div.classList.add('gallery-item');
      div.innerHTML = `<img src="${url}" alt="صورة المعرض">`;
      galleryGrid.appendChild(div);
    });
  }
}
fetchSettings();

// حفظ الإعدادات النصية
saveSettings.onclick = async () => {
  const data = {
    name: shopName.value,
    subtitle: shopSubtitle.value,
    chairCount: Number(chairCount.value),
    maxWaiting: Number(maxWaiting.value)
  };
  await update(settingsRef, data);
  alert('تم حفظ الإعدادات – الزوار سيرونها فورًا');
  fetchSettings();
};

// رفع صورة جديدة
galleryInput.onchange = async (e) => {
  const file = e.target.files[0];
  if(!file) return;

  const fileRef = sRef(storage, 'gallery/' + Date.now() + '-' + file.name);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  // تحديث قاعدة البيانات
  const res = await fetch('https://the-barber-company-302a4-default-rtdb.firebaseio.com/settings.json');
  const data = await res.json();
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  gallery.push(url);

  await update(settingsRef, { gallery });
  fetchSettings();
};
