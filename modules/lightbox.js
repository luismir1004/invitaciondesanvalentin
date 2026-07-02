/* ============================================================
   LIGHTBOX MODULE — Ampliar fotos de la galería
   ============================================================ */

export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButton = document.querySelector('.lightbox-close');
    const gallery = document.getElementById('masonry-grid');

    if (!lightbox || !lightboxImage || !gallery) return;

    function open(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.hidden = true;
        lightboxImage.src = '';
        document.body.style.overflow = '';
    }

    gallery.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img) open(img.src, img.alt);
    });

    closeButton.addEventListener('click', close);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
    });
}
