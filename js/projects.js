document.addEventListener('DOMContentLoaded', function() {
    // Image gallery functionality
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    const images = [
        'photos/Project 1/1.jpg',
        'photos/Project 1/2.jpg',
        'photos/Project 1/3.jpg',
        'photos/Project 1/4.jpg',
        'photos/Project 1/5.jpg',
        'photos/Project 1/6.jpg',
        'photos/Project 1/7.jpg',
        'photos/Project 1/8.jpg',
        'photos/Project 1/9.jpg',
        'photos/Project 1/10.jpg'
    ];

    // Update main image and thumbnails
    function updateMainImage(index) {
        currentImageIndex = index;
        mainImage.src = images[index];
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateMainImage(index);
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        updateMainImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        updateMainImage(newIndex);
    });

    // Lightbox functionality
    mainImage.addEventListener('click', () => {
        lightboxImage.src = images[currentImageIndex];
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Lightbox navigation
    lightboxPrev.addEventListener('click', () => {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        updateMainImage(newIndex);
        lightboxImage.src = images[newIndex];
    });

    lightboxNext.addEventListener('click', () => {
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        updateMainImage(newIndex);
        lightboxImage.src = images[newIndex];
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            }
        }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    mainImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    mainImage.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextBtn.click();
            } else {
                // Swipe right - previous image
                prevBtn.click();
            }
        }
    }
});