import { db } from './firebase-init.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const settingsRef = ref(db, 'settings');

onValue(settingsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // الاسم والعنوان
  document.querySelector('.shop-name').textContent = data.name;
  document.querySelector('.shop-subtitle').textContent = data.subtitle;

  // عدد الكراسي
  if (data.chairCount) updateChairCount(data.chairCount);

  // الخلفية
  if (data.background) {
    document.body.style.backgroundImage = `url(${data.background})`;
  }

  // معرض الصور
  if (Array.isArray(data.gallery)) {
    renderGallery(data.gallery);
  }
});

function renderGallery(images) {
  const container = document.getElementById('galleryContainer');
  container.innerHTML = '';

  images.forEach(img => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `<img src="${img}" />`;
    div.onclick = () => window.open(img, '_blank');
    container.appendChild(div);
  });
}
