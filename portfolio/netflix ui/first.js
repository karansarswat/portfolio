function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

// Add scroll handling for trending section
document.addEventListener('DOMContentLoaded', function() {
    const trending = document.querySelector('.trending');
    const dots = document.querySelectorAll('.scroll-dot');
    
    if (trending && window.innerWidth <= 576) {
        trending.addEventListener('scroll', function() {
            const scrollPosition = trending.scrollLeft;
            const cardWidth = trending.querySelector('.card').offsetWidth;
            const activeIndex = Math.round(scrollPosition / cardWidth);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        });

        // Optional: Add touch slide animation
        let startX;
        let scrollLeft;

        trending.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - trending.offsetLeft;
            scrollLeft = trending.scrollLeft;
        });

        trending.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - trending.offsetLeft;
            const walk = (x - startX) * 2;
            trending.scrollLeft = scrollLeft - walk;
        });

        trending.addEventListener('touchend', () => {
            startX = null;
        });
    }

    // Modal functionality
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImage = modalOverlay.querySelector('img');
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalClose = modalOverlay.querySelector('.modal-close');

    // Enhanced mobile modal interactions
    let touchStartY = 0;
    let touchEndY = 0;
    const MIN_SWIPE_DISTANCE = 100;

    modalOverlay.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    modalOverlay.addEventListener('touchmove', (e) => {
        if (!modalOverlay.classList.contains('active')) return;
        
        touchEndY = e.touches[0].clientY;
        const distance = touchEndY - touchStartY;
        
        if (distance > 0) { // Only allow downward swipe
            const transform = `translateY(${distance}px)`;
            const opacity = 1 - (distance / window.innerHeight);
            
            modalContent.style.transform = transform;
            modalOverlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity * 0.9})`;
            e.preventDefault();
        }
    }, { passive: false });

    modalOverlay.addEventListener('touchend', () => {
        const distance = touchEndY - touchStartY;
        
        if (distance > MIN_SWIPE_DISTANCE) {
            closeModal();
        } else {
            // Reset position if swipe wasn't long enough
            modalContent.style.transform = '';
            modalOverlay.style.backgroundColor = '';
        }
        
        touchStartY = 0;
        touchEndY = 0;
    });

    // Slider functionality for mobile
    const modalSlider = modalOverlay.querySelector('.modal-slider');
    const slideNav = modalOverlay.querySelector('.slide-nav');
    const prevBtn = modalOverlay.querySelector('.slide-prev');
    const nextBtn = modalOverlay.querySelector('.slide-next');
    let currentSlide = 0;
    let slides = [];

    function updateSlider() {
        modalSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.slide-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    // Update card click handler
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('p').textContent;
            const isMobile = window.innerWidth <= 576;
            
            modalOverlay.style.display = 'flex';
            modalOverlay.offsetHeight;

            if (isMobile) {
                // Create slides for mobile view
                slides = Array.from(document.querySelectorAll('.card img')).map(img => ({
                    src: img.src,
                    alt: img.alt
                }));

                // Clear existing slides
                modalSlider.innerHTML = '';
                slideNav.innerHTML = '';

                // Add slides and dots
                slides.forEach((slide, index) => {
                    modalSlider.innerHTML += `
                        <div class="modal-slide">
                            <img src="${slide.src}" alt="${slide.alt}">
                        </div>
                    `;
                    slideNav.innerHTML += `
                        <div class="slide-dot ${index === 0 ? 'active' : ''}"></div>
                    `;
                });

                // Set initial slide to clicked image
                currentSlide = Array.from(document.querySelectorAll('.card')).indexOf(card);
                updateSlider();
            } else {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
            }

            modalTitle.textContent = title;
            
            // Reset any lingering transforms
            modalContent.style.transform = '';
            modalOverlay.style.backgroundColor = '';
            
            // Mobile animation
            setTimeout(() => {
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Hide swipe indicator after delay
                setTimeout(() => {
                    const swipeIndicator = modalOverlay.querySelector('.swipe-indicator');
                    if (swipeIndicator) {
                        swipeIndicator.style.opacity = '0';
                    }
                }, 2000);
            }, 10);
        });
    });

    // Add slide navigation events
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Add touch swipe for slider
    let touchStartX = 0;
    let touchEndX = 0;

    modalOverlay.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    modalOverlay.addEventListener('touchmove', (e) => {
        if (!modalOverlay.classList.contains('active')) return;
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    modalOverlay.addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    });

    // Close modal when clicking the close button or outside the modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // Wait for the transition to complete before hiding the overlay
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 500); // Match this with your transition duration
    }
});