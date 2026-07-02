/* ============================================================
   LIGHTBOX MODULE — Galería interactiva (nav, swipe, caption)
   ============================================================ */

export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    const capEl = document.getElementById('lightbox-caption');
    const gallery = document.getElementById('masonry-grid');
    if (!lightbox || !imgEl || !gallery) return;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const images = Array.from(gallery.querySelectorAll('img'));
    if (!images.length) return;
    let index = 0;

    function render() {
        const img = images[index];
        imgEl.src = img.currentSrc || img.src;
        imgEl.alt = img.alt || '';
        if (capEl) capEl.textContent = img.dataset.caption || img.alt || '';
    }

    function open(i) {
        index = i;
        render();
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.hidden = true;
        imgEl.src = '';
        document.body.style.overflow = '';
    }

    function go(dir) {
        index = (index + dir + images.length) % images.length;
        render();
    }

    gallery.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) open(images.indexOf(img));
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(1); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
    });

    // Swipe (mobile)
    let startX = 0;
    let startY = 0;
    lightbox.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
        }
    }, { passive: true });
}
