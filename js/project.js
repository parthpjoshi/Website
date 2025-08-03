// Project 1 gallery logic
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = Array.from(document.querySelectorAll('.gallery-thumbnails .thumbnail'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    function setMainImage(index) {
        currentIndex = index;
        mainImage.src = thumbnails[index].src;
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        let index = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        setMainImage(index);
    });
    nextBtn.addEventListener('click', () => {
        let index = (currentIndex + 1) % thumbnails.length;
        setMainImage(index);
    });

    thumbnails.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => setMainImage(idx));
    });

    // Lightbox logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    function openLightbox(index) {
        lightboxImg.src = thumbnails[index].src;
        lightbox.classList.add('show');
        lightboxImg.dataset.index = index;
    }
    function closeLightbox() {
        lightbox.classList.remove('show');
    }
    mainImage.addEventListener('click', () => openLightbox(currentIndex));
    lightboxClose.addEventListener('click', closeLightbox);

    lightboxPrev.addEventListener('click', () => {
        let index = (parseInt(lightboxImg.dataset.index) - 1 + thumbnails.length) % thumbnails.length;
        lightboxImg.src = thumbnails[index].src;
        lightboxImg.dataset.index = index;
        setMainImage(index);
    });
    lightboxNext.addEventListener('click', () => {
        let index = (parseInt(lightboxImg.dataset.index) + 1) % thumbnails.length;
        lightboxImg.src = thumbnails[index].src;
        lightboxImg.dataset.index = index;
        setMainImage(index);
    });

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation for the lightbox
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") lightboxNext.click();
        if (e.key === "ArrowLeft") lightboxPrev.click();
    });

    // Set initial main image
    setMainImage(0);

    // Hamburger menu for mobile (optional)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }
});