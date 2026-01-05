// ======= Firebase imports =======
import { db, storage } from './firebase-init.js';
import { ref as dbRef, update, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {

    // العناصر
    const shopName = document.getElementById("shopName");
    const shopSubtitle = document.getElementById("shopSubtitle");
    const chairCount = document.getElementById("chairCount");
    const maxWaiting = document.getElementById("maxWaiting");
    const saveBtn = document.getElementById("saveSettingsBtn");
    const galleryInput = document.getElementById("galleryInput");

    const settingsRef = dbRef(db, "settings");

    // ======= تحميل الإعدادات الحالية عند فتح لوحة التحكم =======
    async function loadSettings() {
        try {
            const snapshot = await get(settingsRef);
            const data = snapshot.val() || {};
            
            if (shopName) shopName.value = data.name || "";
            if (shopSubtitle) shopSubtitle.value = data.subtitle || "";
            if (chairCount) chairCount.value = data.chairCount || 0;
            if (maxWaiting) maxWaiting.value = data.maxWaiting || 0;

            // تحميل معرض الصور (إذا كان موجود)
            if (data.gallery && Array.isArray(data.gallery)) {
                const galleryGrid = document.querySelector(".gallery-grid");
                if (galleryGrid) {
                    galleryGrid.innerHTML = "";
                    data.gallery.forEach(url => {
                        const div = document.createElement("div");
                        div.classList.add("gallery-item");
                        div.innerHTML = `
                            <img src="${url}" alt="">
                            <div class="gallery-item-overlay">
                                <div class="gallery-item-info"></div>
                            </div>
                        `;
                        galleryGrid.appendChild(div);
                    });
                }
            }
        } catch (err) {
            console.error("Error loading settings:", err);
            alert("❌ خطأ في تحميل الإعدادات من Firebase");
        }
    }

    loadSettings(); // استدعاء عند فتح الصفحة

    // ======= حفظ الإعدادات =======
    if (saveBtn) {
        saveBtn.onclick = async () => {
            try {
                const data = {
                    name: shopName.value,
                    subtitle: shopSubtitle.value,
                    chairCount: Number(chairCount.value),
                    maxWaiting: Number(maxWaiting.value),
                    updatedAt: Date.now()
                };
                await update(settingsRef, data);
                alert("✅ تم حفظ الإعدادات – الزوار سيرون التغييرات فورًا");
            } catch (err) {
                console.error("Error saving settings:", err);
                alert("❌ خطأ أثناء حفظ الإعدادات");
            }
        };
    }

    // ======= رفع صورة للمعرض =======
    if (galleryInput) {
        galleryInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                // رفع الملف على Firebase Storage
                const fileRef = sRef(storage, "gallery/" + Date.now() + "_" + file.name);
                await uploadBytes(fileRef, file);
                const url = await getDownloadURL(fileRef);

                // تحديث قائمة الصور في Realtime Database
                const snapshot = await get(settingsRef);
                const currentData = snapshot.val() || {};
                const gallery = currentData.gallery || [];
                gallery.push(url);

                await update(settingsRef, { gallery });
                alert("✅ تم رفع الصورة – الزوار سيرونها فورًا");

                // إعادة تحميل المعرض في لوحة التحكم
                loadSettings();

            } catch (err) {
                console.error("Error uploading image:", err);
                alert("❌ خطأ أثناء رفع الصورة");
            }
        });
    }

});
