// Project data
const projectData = {
    1: {
        title: "Project 1",
        description: "This is a comprehensive project showcasing modern design principles and cutting-edge technology. We implemented innovative solutions to meet the client's unique requirements and delivered exceptional results.",
        client: "Premium Client",
        duration: "4 months",
        technology: "HTML5, CSS3, JavaScript, React",
        images: [
            "images/Project 1/1.jpg",
            "images/Project 1/2.jpg",
            "images/Project 1/3.jpg",
            "images/Project 1/4.jpg",
            "images/Project 1/5.jpg",
            "images/Project 1/6.jpg",
            "images/Project 1/7.jpg",
            "images/Project 1/8.jpg",
            "images/Project 1/9.jpg",
            "images/Project 1/10.jpg"
        ]
    },
    2: {
        title: "Project 2",
        description: "Coming soon - An exciting new project that will showcase our latest capabilities and innovative approach to problem-solving.",
        client: "To be announced",
        duration: "TBA",
        technology: "TBA",
        images: ["images/Project 1/2.jpg"] // Placeholder image
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal-close');
    const modalMainImage = document.getElementById('modalMainImage');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const currentImageIndex = document.getElementById('currentImageIndex');
    const totalImages = document.getElementById('totalImages');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalProjectClient = document.getElementById('modalProjectClient');
    const modalProjectDuration = document.getElementById('modalProjectDuration');
    const modalProjectTechnology = document.getElementById('modalProjectTechnology');
    const modalImageGrid = document.getElementById('modalImageGrid');

    let currentProject = null;
    let currentImageIdx = 0;

    // Initialize lazy loading for main project cards
    initializeMainImageLazyLoading();

    // Open project modal
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = card.dataset.project;
            currentProject = projectData[projectId];
            currentImageIdx = 0;
            openProjectModal();
        });
    });

    function openProjectModal() {
        if (!currentProject) return;

        // Update project information
        modalProjectTitle.textContent = currentProject.title;
        modalProjectDescription.textContent = currentProject.description;
        modalProjectClient.textContent = currentProject.client;
        modalProjectDuration.textContent = currentProject.duration;
        modalProjectTechnology.textContent = currentProject.technology;

        // Update image counter
        totalImages.textContent = currentProject.images.length;

        // Load the first image immediately
        updateMainImage();

        // Show modal and prevent body scroll
        projectModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add scroll indicator if not exists
        if (!document.querySelector('.scroll-indicator')) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            scrollIndicator.innerHTML = '↓ Scroll for details ↓';
            document.querySelector('.modal-image-viewer').appendChild(scrollIndicator);
        }

        // Defer grid creation to improve initial modal opening speed
        setTimeout(() => {
            createImageGrid();
        }, 100);
        
        // Scroll to top of modal smoothly
        setTimeout(() => {
            projectModal.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 150);
    }

    function updateMainImage() {
        if (!currentProject || !currentProject.images[currentImageIdx]) return;
        
        // Show loading state
        const imageViewer = document.querySelector('.modal-image-viewer');
        imageViewer.classList.add('loading');
        modalMainImage.style.opacity = '0.5';
        
        // Create new image for preloading
        const newImage = new Image();
        newImage.onload = function() {
            modalMainImage.src = this.src;
            modalMainImage.style.opacity = '1';
            imageViewer.classList.remove('loading');
            currentImageIndex.textContent = currentImageIdx + 1;
            
            // Preload next and previous images for smoother navigation
            preloadAdjacentImages();
        };
        
        newImage.onerror = function() {
            console.log('Error loading image:', currentProject.images[currentImageIdx]);
            imageViewer.classList.remove('loading');
            modalMainImage.style.opacity = '1';
        };
        
        newImage.src = currentProject.images[currentImageIdx];
    }

    // Preload adjacent images for smooth navigation
    function preloadAdjacentImages() {
        const preloadImages = [];
        
        // Preload previous image
        if (currentImageIdx > 0) {
            preloadImages.push(currentProject.images[currentImageIdx - 1]);
        }
        
        // Preload next image
        if (currentImageIdx < currentProject.images.length - 1) {
            preloadImages.push(currentProject.images[currentImageIdx + 1]);
        }
        
        preloadImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    function createImageGrid() {
        modalImageGrid.innerHTML = '';
        
        currentProject.images.forEach((imageSrc, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            const img = document.createElement('img');
            img.className = 'grid-image lazy-load';
            img.alt = `${currentProject.title} - Image ${index + 1}`;
            
            // Set up lazy loading with data-src
            img.setAttribute('data-src', imageSrc);
            
            // Create a lightweight placeholder
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
            
            // Click handler for grid images
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentImageIdx = index;
                updateMainImage();
                // Smooth scroll to top to show the main image
                projectModal.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            gridItem.appendChild(img);
            modalImageGrid.appendChild(gridItem);
        });
        
        // Initialize lazy loading for grid images
        initializeLazyLoading();
    }

    // Lazy loading for main project card images
    function initializeMainImageLazyLoading() {
        const lazyMainImages = document.querySelectorAll('.lazy-load-main');
        
        const mainImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Add placeholder while loading
                        img.style.background = '#f0f0f0';
                        
                        const newImg = new Image();
                        newImg.onload = function() {
                            img.src = this.src;
                            img.classList.remove('lazy-load-main');
                            img.style.background = 'none';
                        };
                        newImg.onerror = function() {
                            img.classList.remove('lazy-load-main');
                            img.style.background = '#f5f5f5';
                            console.log('Failed to load main project image:', src);
                        };
                        newImg.src = src;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '20px 0px',
            threshold: 0.1
        });
        
        lazyMainImages.forEach(img => {
            // Set placeholder image
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';
            mainImageObserver.observe(img);
        });
    }

    // Lazy loading implementation using Intersection Observer
    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Create new image to preload
                        const newImg = new Image();
                        newImg.onload = function() {
                            img.src = this.src;
                            img.classList.remove('lazy-load');
                            img.classList.add('loaded');
                        };
                        newImg.onerror = function() {
                            img.classList.remove('lazy-load');
                            img.classList.add('error');
                        };
                        newImg.src = src;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
            threshold: 0.1
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Close modal
    function closeModal() {
        projectModal.classList.remove('show');
        document.body.style.overflow = '';
        currentProject = null;
        
        // Remove scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.remove();
        }
        
        // Reset scroll position
        setTimeout(() => {
            projectModal.scrollTop = 0;
        }, 300);
    }

    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Image navigation
    modalPrevBtn.addEventListener('click', () => {
        if (!currentProject) return;
        currentImageIdx = (currentImageIdx - 1 + currentProject.images.length) % currentProject.images.length;
        updateMainImage();
    });

    modalNextBtn.addEventListener('click', () => {
        if (!currentProject) return;
        currentImageIdx = (currentImageIdx + 1) % currentProject.images.length;
        updateMainImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!projectModal.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            modalPrevBtn.click();
        } else if (e.key === 'ArrowRight') {
            modalNextBtn.click();
        }
    });

    // Hamburger menu for mobile (inherited from main script)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});