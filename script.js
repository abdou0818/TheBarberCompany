// script.js

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------
    // 1️⃣ الكود الأساسي لإدارة الصالون
    // -------------------------------

    let waitingCustomers = 0;
    const maxWaitingDisplay = document.querySelector('.waiting-counter');
    const chairCards = document.querySelectorAll('.chair-card');

    // تحديث حالة الكراسي
    function updateChairState() {
        chairCards.forEach((card, index) => {
            const status = card.querySelector('.chair-status');
            if(index < (window.currentSettings?.chairCount || 3)){
                card.classList.add('available'); card.classList.remove('occupied');
                if(status){ status.textContent = 'متاح'; status.classList.add('available'); status.classList.remove('occupied'); }
            } else {
                card.classList.remove('available'); card.classList.add('occupied');
                if(status){ status.textContent = 'مشغول'; status.classList.remove('available'); status.classList.add('occupied'); }
            }
        });
    }

    // إضافة عميل جديد
    function addCustomer() {
        waitingCustomers++;
        if(maxWaitingDisplay) maxWaitingDisplay.textContent = waitingCustomers;
        // مثال: إضافة إشعار
        showNotification('تم إضافة عميل جديد');
        updateChairState();
    }

    // إزالة عميل
    function removeCustomer() {
        if(waitingCustomers > 0) waitingCustomers--;
        if(maxWaitingDisplay) maxWaitingDisplay.textContent = waitingCustomers;
        updateChairState();
    }

    // إشعارات بسيطة
    function showNotification(msg) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    // -------------------------------
    // 2️⃣ الكود الخاص بالإعدادات من JSON
    // -------------------------------

    window.currentSettings = {}; // نجعلها global لتستخدم في الكود الأساسي

    // عناصر التحكم
    const openBtn = document.getElementById('openSettings');
    const closeBtn = document.getElementById('closeSettings');
    const closeBtn2 = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('save-settings-btn');
    const galleryInput = document.getElementById('galleryInput');
    const modal = document.getElementById('settingsModal');

    if(openBtn) openBtn.addEventListener('click', () => modal.style.display = 'block');
    if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    if(closeBtn2) closeBtn2.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

    // تحميل الإعدادات من JSON
    fetch('settings-version.json')
        .then(res => res.json())
        .then(data => {
            window.currentSettings = data.settings || {};
            applyAllSettings(window.currentSettings);
            fillSettingsInputs(window.currentSettings);
        })
        .catch(err => console.error('Error loading settings:', err));

    // تطبيق جميع الإعدادات على الصفحة
    function applyAllSettings(settings) {

        // الاسم والشعار
        const shopName = document.querySelector('.shop-name');
        const shopSubtitle = document.querySelector('.shop-subtitle');
        if(shopName) shopName.textContent = settings.name || '';
        if(shopSubtitle) shopSubtitle.textContent = settings.subtitle || '';

        // الكراسي
        updateChairState();

        // الحد الأقصى للانتظار
        if(maxWaitingDisplay) maxWaitingDisplay.textContent = settings.maxWaiting || 0;

        // الخلفية
        if(settings.backgroundImage){
            document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
            document.body.classList.add('custom-background');
        } else {
            document.body.style.backgroundImage = '';
            document.body.classList.remove('custom-background');
        }

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

        // المعرض
        if(settings.gallery && Array.isArray(settings.gallery)){
            const galleryGrid = document.querySelector('.gallery-grid');
            if(galleryGrid){
                galleryGrid.innerHTML = '';
                settings.gallery.forEach(img => {
                    const div = document.createElement('div');
                    div.classList.add('gallery-item');
                    div.innerHTML = `
                        <img src="${img.src}" alt="${img.alt || ''}">
                        <div class="gallery-item-overlay">
                            <div class="gallery-item-info">${img.alt || ''}</div>
                        </div>
                    `;
                    galleryGrid.appendChild(div);
                });
            }
        }
    }

    // ملء لوحة التحكم بالقيم الحالية
    function fillSettingsInputs(settings){
        document.querySelectorAll('.settings-section input').forEach(input => {
            const key = input.dataset.settingKey;
            if(key && settings[key] !== undefined) input.value = settings[key];
        });
        if(settings.gallery) galleryInput.value = JSON.stringify(settings.gallery, null, 2);
    }

    // تحديث الإعدادات مباشرة عند الكتابة
    document.querySelectorAll('.settings-section input').forEach(input => {
        input.addEventListener('input', () => {
            const key = input.dataset.settingKey;
            if(!key) return;
            let value = input.type === 'number' ? parseInt(input.value)||0 : input.value;
            window.currentSettings[key] = value;
            applyAllSettings(window.currentSettings);
        });
    });

    // حفظ التغييرات مباشرة
    if(saveBtn) saveBtn.addEventListener('click', () => {
        try{ window.currentSettings.gallery = JSON.parse(galleryInput.value); } 
        catch(e){ alert('صيغة معرض الصور غير صحيحة'); return; }

        applyAllSettings(window.currentSettings);
        modal.style.display = 'none';
        alert('تم تطبيق جميع التغييرات مباشرة للزبائن!');
        console.log('Current Settings:', window.currentSettings);
    });

});
