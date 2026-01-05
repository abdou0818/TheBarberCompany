// =========================
// script.js - Barber Shop Full Control
// =========================

// ---------- متغيرات عامة ----------
let waitingCustomers = 0;
let chairStates = {};
let currentSettings = {};
let contacts = [];
let galleryImages = [];
let currentBackground = null;

// ---------- تحميل الصفحة ----------
document.addEventListener('DOMContentLoaded', () => {
    loadSettingsFromServer();
    setupUIControls();
});

// ========================
// 1️⃣ تحميل الإعدادات من السيرفر
// ========================
function loadSettingsFromServer() {
    fetch('settings-version.json')
        .then(res => res.json())
        .then(data => {
            currentSettings = data.settings || data; 
            // إعدادات عامة
            waitingCustomers = 0;
            chairStates = {};
            for (let i = 1; i <= (currentSettings.chairCount || 3); i++) {
                chairStates[i] = 'available';
            }
            galleryImages = currentSettings.gallery || [];
            if(currentSettings.backgroundImage) currentBackground = {src: currentSettings.backgroundImage};

            applyAllSettings(currentSettings);
            fillSettingsInputs(currentSettings);
        })
        .catch(err => console.error('Error loading settings:', err));
}

// ========================
// 2️⃣ تطبيق جميع الإعدادات على الصفحة
// ========================
function applyAllSettings(settings) {
    // الاسم والعنوان
    const shopName = document.querySelector('.shop-name');
    const shopSubtitle = document.querySelector('.shop-subtitle');
    if(shopName) shopName.textContent = settings.name || '';
    if(shopSubtitle) shopSubtitle.textContent = settings.subtitle || '';

    // الكراسي
    const chairsGrid = document.querySelector('.chairs-grid');
    if(chairsGrid){
        chairsGrid.innerHTML = '';
        for (let i = 1; i <= (settings.chairCount || 3); i++) {
            chairStates[i] = chairStates[i] || 'available';
            const chairCard = document.createElement('div');
            chairCard.className = `chair-card ${chairStates[i]}`;
            chairCard.setAttribute('data-chair', i);
            chairCard.innerHTML = `
                <div class="chair-icon"><i class="fas fa-chair"></i></div>
                <h3>كرسي ${i}</h3>
                <span class="chair-status ${chairStates[i]}">${chairStates[i]==='available'?'متاح':'مشغول'}</span>
                <button class="toggle-chair-btn" onclick="toggleChair(${i})">تغيير الحالة</button>
            `;
            chairsGrid.appendChild(chairCard);
        }
    }

    // عدّاد الزبائن
    const waitingCounter = document.querySelector('.waiting-counter');
    if(waitingCounter) waitingCounter.textContent = settings.maxWaiting || 0;

    // الخلفية
    applyBackgroundImage();

    // روابط التواصل
    const socialLinks = {
        instagram: document.querySelector('.social-link.instagram'),
        whatsapp: document.querySelector('.social-link.phone')
    };
    for(let key in socialLinks){
        if(socialLinks[key]){
            if(settings[key] && settings[key].trim() !== ''){
                socialLinks[key].setAttribute('href', settings[key]);
                socialLinks[key].style.display = 'flex';
            } else {
                socialLinks[key].style.display = 'none';
            }
        }
    }

    // معرض الصور
    displayGalleryOnMainPage();
}

// ========================
// 3️⃣ فتح / إغلاق لوحة التحكم
// ========================
function setupUIControls() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('openSettings');
    const closeBtn = document.getElementById('closeSettings');
    const closeBtn2 = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('save-settings-btn');
    const galleryInput = document.getElementById('galleryInput');

    openBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    closeBtn2.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target == modal) modal.style.display = 'none'; });

    // تحديث مباشر عند الكتابة
    document.querySelectorAll('.settings-section input').forEach(input => {
        input.addEventListener('input', () => {
            const key = input.dataset.settingKey;
            if(!key) return;
            let value = input.type === 'number' ? parseInt(input.value)||0 : input.value;
            currentSettings[key] = value;
            applyAllSettings(currentSettings);
        });
    });

    // حفظ الإعدادات على السيرفر
    saveBtn.addEventListener('click', () => {
        try{
            currentSettings.gallery = JSON.parse(galleryInput.value);
        } catch(e){
            alert('صيغة معرض الصور غير صحيحة');
            return;
        }
        applyAllSettings(currentSettings);
        // 🔴 إرسال الإعدادات للسيرفر
        fetch('/save-settings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currentSettings)
        })
        .then(res => res.text())
        .then(msg => {
            alert('تم تطبيق جميع التغييرات وحفظها لجميع الزبائن!');
        })
        .catch(err => {
            console.error(err);
            alert('حدث خطأ أثناء حفظ الإعدادات على السيرفر');
        });
        modal.style.display = 'none';
    });
}

// ========================
// 4️⃣ إدارة الكراسي
// ========================
function toggleChair(chairNumber){
    chairStates[chairNumber] = chairStates[chairNumber] === 'available' ? 'occupied' : 'available';
    applyAllSettings(currentSettings);
}

// ========================
// 5️⃣ إدارة الخلفية
// ========================
function applyBackgroundImage(){
    if(currentSettings.backgroundImage){
        document.body.style.backgroundImage = `url(${currentSettings.backgroundImage})`;
        document.body.classList.add('custom-background');
    } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('custom-background');
    }
}

// ========================
// 6️⃣ إدارة المعرض
// ========================
function displayGalleryOnMainPage() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if(!galleryGrid) return;
    galleryGrid.innerHTML = '';
    if(currentSettings.gallery && Array.isArray(currentSettings.gallery)){
        currentSettings.gallery.forEach(img => {
            const div = document.createElement('div');
            div.classList.add('gallery-item');
            div.innerHTML = `
                <img src="${img.src}" alt="${img.alt||''}">
                <div class="gallery-item-overlay">
                    <div class="gallery-item-info">${img.alt||''}</div>
                </div>
            `;
            galleryGrid.appendChild(div);
        });
    }
}

// ========================
// 7️⃣ ملء لوحة التحكم بالقيم الحالية
// ========================
function fillSettingsInputs(settings){
    document.querySelectorAll('.settings-section input').forEach(input => {
        const key = input.dataset.settingKey;
        if(key && settings[key] !== undefined) input.value = settings[key];
    });
    const galleryInput = document.getElementById('galleryInput');
    if(galleryInput && settings.gallery) galleryInput.value = JSON.stringify(settings.gallery, null, 2);
}

// ========================
// ✅ العدّاد والزبائن يمكن إضافتهم بنفس الأسلوب القديم إذا أحببت
// ========================
