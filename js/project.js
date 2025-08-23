// Project data
const projectData = {
    1: {
        title: "Project 1",
        description: "This is a comprehensive project showcasing modern design principles and cutting-edge technology. We implemented innovative solutions to meet the client's unique requirements and delivered exceptional results.",
        client: "Karthikeya Residence",
        duration: "Katraj, Pune",
        technology: "40000 sq.ft.",
        projectType: "Residential Apartment",
        video: "images/Project 1/Project 1.mp4",
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
        ],
        additionalSlides: [
            "images/Project 1/1.jpg",
            "images/Project 1/3.jpg",
            "images/Project 1/5.jpg",
            "images/Project 1/7.jpg",
            "images/Project 1/9.jpg"
        ]
    },
    2: {
        title: "Project 2",
        description: "This is a comprehensive project showcasing modern design principles and cutting-edge technology. We implemented innovative solutions to meet the client's unique requirements and delivered exceptional results.",
        client: "Lilium Park",
        duration: "Shikrapur, Pune",
        technology: "80000 sq.ft.",
        projectType: "Residential Apartment",
        video: null,
        images: [
            "images/Project 2/2nd_1.jpg",
            "images/Project 2/2nd_2.jpg",
            "images/Project 2/2nd_3.jpg",
            "images/Project 2/2nd_4.jpg",
            "images/Project 2/2nd_5.jpg",
            "images/Project 2/2nd_6.jpg",
            "images/Project 2/2nd_7.jpg",
            "images/Project 2/2nd_8.jpg",
            "images/Project 2/2nd_9.jpg",
            "images/Project 2/2nd_10.jpg",
            "images/Project 2/2nd_11.jpg"
        ],
        additionalSlides: [
            "images/Project 2/2nd_1.jpg",
            "images/Project 2/2nd_3.jpg",
            "images/Project 2/2nd_5.jpg",
            "images/Project 2/2nd_7.jpg",
            "images/Project 2/2nd_9.jpg"
        ]
    },
    3: {
        title: "Project 3",
        description: "This is a comprehensive project showcasing modern design principles and cutting-edge technology. We implemented innovative solutions to meet the client's unique requirements and delivered exceptional results.",
        client: "Dr. Awanti's Dental Clinic",
        duration: "Wadgaon Sheri, Pune",
        technology: "900 sq.ft.",
        projectType: "Commercial Interior",
        areaLabel: "Carpet Area",
        video: null,
        images: [
            "images/Project 3/1.png",
            "images/Project 3/2.png",
            "images/Project 3/3.png",
            "images/Project 3/4.png",
            "images/Project 3/5.png",
            "images/Project 3/6.png",
            "images/Project 3/7.png",
            "images/Project 3/8.png",
            "images/Project 3/9.png",
            "images/Project 3/10.png"
        ],
        additionalSlides: [
            "images/Project 3/1.png",
            "images/Project 3/3.png",
            "images/Project 3/5.png",
            "images/Project 3/7.png",
            "images/Project 3/9.png"
        ]
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
    const projectVideo = document.getElementById('projectVideo');

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
        
        // Update the project type field
        const projectTypeSpan = document.querySelector('#modalProjectType');
        if (projectTypeSpan) {
            projectTypeSpan.textContent = currentProject.projectType;
        }
        
        // Update area label if custom label exists (for Project 3 - Carpet Area)
        const areaLabelElement = document.querySelector('.detail-item:nth-child(3) strong');
        if (areaLabelElement && currentProject.areaLabel) {
            areaLabelElement.textContent = currentProject.areaLabel + ':';
        } else if (areaLabelElement) {
            areaLabelElement.textContent = 'Built-Up-Area:';
        }

        // Update image counter
        totalImages.textContent = currentProject.images.length;

        // Load the first image immediately
        updateMainImage();

        // Setup video
        setupProjectVideo();

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

    // Setup project video with lazy loading and autoplay
    function setupProjectVideo() {
        if (!currentProject || !projectVideo) return;
        
        if (currentProject.video) {
            // Add lazy loading class
            projectVideo.classList.add('lazy-video');
            
            // Create loading placeholder
            const videoContainer = projectVideo.parentElement;
            let placeholder = videoContainer.querySelector('.video-loading-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.className = 'video-loading-placeholder';
                placeholder.innerHTML = 'Loading video...';
                videoContainer.appendChild(placeholder);
            }
            
            // Show video section
            projectVideo.parentElement.parentElement.style.display = 'block';
            
            // Setup lazy loading observer for video
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadProjectVideo();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });
            
            videoObserver.observe(projectVideo.parentElement);
        } else {
            // Hide video section if no video available
            projectVideo.parentElement.parentElement.style.display = 'none';
        }
    }
    
    // Load project video
    function loadProjectVideo() {
        if (!currentProject || !projectVideo) return;
        
        const videoContainer = projectVideo.parentElement;
        const placeholder = videoContainer.querySelector('.video-loading-placeholder');
        
        // Set video source
        const source = projectVideo.querySelector('source');
        source.src = currentProject.video;
        
        // Handle video load events
        projectVideo.addEventListener('loadeddata', () => {
            projectVideo.classList.remove('lazy-video');
            projectVideo.classList.add('loaded');
            if (placeholder) placeholder.style.display = 'none';
            
            // Autoplay with user gesture (muted)
            projectVideo.muted = true;
            projectVideo.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
        });
        
        projectVideo.addEventListener('error', () => {
            console.log('Error loading video:', currentProject.video);
            if (placeholder) {
                placeholder.innerHTML = 'Video unavailable';
                placeholder.style.color = '#ff6b6b';
            }
        });
        
        // Start loading
        projectVideo.load();
    }

    // Create additional slider
    function createAdditionalSlider() {
        if (!currentProject || !additionalSlider) return;
        
        additionalSlider.innerHTML = '';
        currentSlideIdx = 0;
        
        if (currentProject.additionalSlides && currentProject.additionalSlides.length > 0) {
            currentProject.additionalSlides.forEach((slideSrc, index) => {
                const slideItem = document.createElement('div');
                slideItem.className = 'slider-item';
                
                const img = document.createElement('img');
                img.src = slideSrc;
                img.alt = `${currentProject.title} - Additional ${index + 1}`;
                img.style.cursor = 'pointer';
                
                // Click handler to show in main image viewer
                img.addEventListener('click', () => {
                    // Find the index in the main images array
                    const mainImageIndex = currentProject.images.indexOf(slideSrc);
                    if (mainImageIndex !== -1) {
                        currentImageIdx = mainImageIndex;
                        updateMainImage();
                        // Scroll to top to show the main image
                        projectModal.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                });
                
                slideItem.appendChild(img);
                additionalSlider.appendChild(slideItem);
            });
            
            additionalSlider.parentElement.parentElement.style.display = 'block';
        } else {
            // Hide additional slider section if no slides available
            additionalSlider.parentElement.parentElement.style.display = 'none';
        }
    }

    // Additional slider navigation
    function slideAdditional(direction) {
        if (!currentProject || !currentProject.additionalSlides) return;
        
        const slideWidth = 320; // 300px width + 20px gap
        const maxSlide = Math.max(0, currentProject.additionalSlides.length - 3); // Show 3 slides at a time
        
        if (direction === 'next') {
            currentSlideIdx = Math.min(currentSlideIdx + 1, maxSlide);
        } else {
            currentSlideIdx = Math.max(currentSlideIdx - 1, 0);
        }
        
        additionalSlider.scrollTo({
            left: currentSlideIdx * slideWidth,
            behavior: 'smooth'
        });
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
        
        // Stop and reset video
        if (projectVideo) {
            projectVideo.pause();
            projectVideo.currentTime = 0;
            projectVideo.classList.add('lazy-video');
            projectVideo.classList.remove('loaded');
            
            // Show placeholder again
            const videoContainer = projectVideo.parentElement;
            const placeholder = videoContainer.querySelector('.video-loading-placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
                placeholder.innerHTML = 'Loading video...';
                placeholder.style.color = '#999';
            }
        }
        
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

    // Additional slider navigation
    if (additionalPrevBtn) {
        additionalPrevBtn.addEventListener('click', () => {
            slideAdditional('prev');
        });
    }

    if (additionalNextBtn) {
        additionalNextBtn.addEventListener('click', () => {
            slideAdditional('next');
        });
    }

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