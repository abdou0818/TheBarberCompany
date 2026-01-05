document.addEventListener('DOMContentLoaded', () => {
    let currentSettings = {};

    const openBtn = document.getElementById('openSettings');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('save-settings-btn');
    const galleryInput = document.getElementById('galleryInput');
    const backgroundInput = document.getElementById('backgroundInput');
    const modal = document.getElementById('settingsModal');

    openBtn.addEventListener('click', () => modal.style.display='block');
    closeBtn.addEventListener('click', () => modal.style.display='none');
    window.addEventListener('click', e => { if(e.target==modal) modal.style.display='none'; });

    // تحميل الإعدادات من السيرفر
    fetch('settings.json')
    .then(res=>res.json())
    .then(data=>{
        currentSettings = data;
        applySettings();
        fillInputs();
    })
    .catch(()=>{ console.log('لا يوجد ملف إعدادات حتى الآن'); });

    function applySettings(){
        // الاسم والوصف
        document.querySelector('.shop-name').textContent = currentSettings.name || '';
        document.querySelector('.shop-subtitle').textContent = currentSettings.subtitle || '';

        // الكراسي
        document.querySelectorAll('.chair-card').forEach((card, idx)=>{
            const status = card.querySelector('.chair-status');
            if(idx < (currentSettings.chairCount || 3)){
                card.classList.add('available'); card.classList.remove('occupied');
                if(status){ status.textContent='متاح'; status.classList.add('available'); status.classList.remove('occupied'); }
            } else {
                card.classList.remove('available'); card.classList.add('occupied');
                if(status){ status.textContent='مشغول'; status.classList.remove('available'); status.classList.add('occupied'); }
            }
        });

        // الزبائن
        document.querySelector('.waiting-counter').textContent = currentSettings.maxWaiting || 0;

        // الخلفية
        if(currentSettings.backgroundImage){
            document.body.style.backgroundImage=`url(${currentSettings.backgroundImage})`;
            document.body.classList.add('custom-background');
        } else {
            document.body.style.backgroundImage='';
            document.body.classList.remove('custom-background');
        }

        // روابط التواصل
        const socialLinks = {
            instagram: document.querySelector('.social-link.instagram'),
            whatsapp: document.querySelector('.social-link.phone')
        };
        for(let key in socialLinks){
            if(socialLinks[key]){
                if(currentSettings[key] && currentSettings[key].trim()!==''){
                    socialLinks[key].setAttribute('href', currentSettings[key]);
                    socialLinks[key].style.display='flex';
                } else {
                    socialLinks[key].style.display='none';
                }
            }
        }

        // معرض الصور
        if(currentSettings.gallery && Array.isArray(currentSettings.gallery)){
            const grid = document.querySelector('.gallery-grid');
            grid.innerHTML='';
            currentSettings.gallery.forEach(img=>{
                const div = document.createElement('div');
                div.classList.add('gallery-item');
                div.innerHTML=`
                    <img src="${img.src}" alt="${img.alt || ''}">
                    <div class="gallery-item-overlay"><div class="gallery-item-info">${img.alt||''}</div></div>
                `;
                div.addEventListener('click', ()=>viewImage(img.src));
                grid.appendChild(div);
            });
        }
    }

    function fillInputs(){
        document.querySelectorAll('.settings-section input').forEach(input=>{
            const key = input.dataset.settingKey;
            if(key && currentSettings[key]!==undefined) input.value=currentSettings[key];
        });
    }

    // حفظ الإعدادات
    saveBtn.addEventListener('click', ()=>{
        // الخلفية
        if(backgroundInput.files[0]){
            const reader = new FileReader();
            reader.onload = e=>{
                currentSettings.backgroundImage=e.target.result;
                saveToServer();
            }
            reader.readAsDataURL(backgroundInput.files[0]);
        } else {
            saveToServer();
        }

        // معرض الصور
        if(galleryInput.files.length>0){
            currentSettings.gallery = currentSettings.gallery||[];
            Array.from(galleryInput.files).forEach(file=>{
                const reader = new FileReader();
                reader.onload = e=>{
                    currentSettings.gallery.push({src:e.target.result, alt:file.name});
                    applySettings();
                }
                reader.readAsDataURL(file);
            });
        }
    });

    function saveToServer(){
        fetch('save-settings.php',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(currentSettings)
        })
        .then(res=>res.text())
        .then(msg=>{ alert(msg); applySettings(); modal.style.display='none'; })
        .catch(err=>console.error(err));
    }

    function viewImage(src){
        const modal=document.createElement('div');
        modal.className='image-modal';
        modal.style=`position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;cursor:pointer;`;
        const img=document.createElement('img');
        img.src=src;
        img.style=`max-width:90%;max-height:90%;border-radius:10px;object-fit:contain;`;
        modal.appendChild(img);
        document.body.appendChild(modal);
        modal.addEventListener('click',()=>document.body.removeChild(modal));
    }
});
