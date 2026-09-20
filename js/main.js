// Hotel Landing Page JavaScript
// Azure Haven Hotel - Interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initBookingForm();
    initTestimonials();
    initGallery();
    initSmoothScrolling();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Booking form functionality
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const guestsSelect = document.getElementById('guests');
    const roomsSelect = document.getElementById('rooms');
    const bookingMessage = document.getElementById('bookingMessage');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (checkInInput) {
        checkInInput.setAttribute('min', today);
    }
    
    // Update checkout minimum date when check-in changes
    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', function() {
            const checkInDate = new Date(this.value);
            const minCheckOut = new Date(checkInDate);
            minCheckOut.setDate(minCheckOut.getDate() + 1);
            
            checkOutInput.setAttribute('min', minCheckOut.toISOString().split('T')[0]);
            
            // Clear checkout if it's before the new minimum
            if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                checkOutInput.value = '';
            }
        });
    }
    
    // Form validation and submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            // Validate form
            let isValid = true;
            
            // Validate check-in date
            if (!checkInInput.value) {
                showError('checkInError', 'Please select a check-in date');
                isValid = false;
            }
            
            // Validate check-out date
            if (!checkOutInput.value) {
                showError('checkOutError', 'Please select a check-out date');
                isValid = false;
            } else if (checkInInput.value && new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
                showError('checkOutError', 'Check-out date must be after check-in date');
                isValid = false;
            }
            
            // Validate guests
            if (!guestsSelect.value) {
                showError('guestsError', 'Please select number of guests');
                isValid = false;
            }
            
            // Validate rooms
            if (!roomsSelect.value) {
                showError('roomsError', 'Please select number of rooms');
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                showBookingMessage('success', `Searching availability for ${guestsSelect.value} guest${guestsSelect.value > 1 ? 's' : ''} in ${roomsSelect.value} room${roomsSelect.value > 1 ? 's' : ''} from ${formatDate(checkInInput.value)} to ${formatDate(checkOutInput.value)}.`);
                
                // In a real application, this would make an API call
                console.log('Booking search:', {
                    checkIn: checkInInput.value,
                    checkOut: checkOutInput.value,
                    guests: guestsSelect.value,
                    rooms: roomsSelect.value
                });
            }
        });
    }
    
    // Real-time validation
    if (checkInInput) {
        checkInInput.addEventListener('blur', function() {
            if (!this.value) {
                showError('checkInError', 'Please select a check-in date');
            } else {
                clearError('checkInError');
            }
        });
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('blur', function() {
            if (!this.value) {
                showError('checkOutError', 'Please select a check-out date');
            } else if (checkInInput.value && new Date(this.value) <= new Date(checkInInput.value)) {
                showError('checkOutError', 'Check-out date must be after check-in date');
            } else {
                clearError('checkOutError');
            }
        });
    }
}

// Testimonials slider functionality
function initTestimonials() {
    const slider = document.getElementById('testimonialsSlider');
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialDots');
    
    if (!slider || !track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', function() {
                goToTestimonial(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Navigation functions
    function goToTestimonial(index) {
        currentIndex = index;
        const offset = -index * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Update ARIA live region
        track.setAttribute('aria-live', 'polite');
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % totalCards;
        goToTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        goToTestimonial(currentIndex);
    }
    
    // Button events
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    // Keyboard navigation
    slider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    });
    
    // Auto-rotate (optional)
    let autoRotateInterval;
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Pause auto-rotate on hover
    slider.addEventListener('mouseenter', stopAutoRotate);
    slider.addEventListener('mouseleave', startAutoRotate);
    
    // Start auto-rotate
    startAutoRotate();
    
    // Pause when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });
}

// Gallery functionality
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Simple lightbox implementation
            const caption = this.querySelector('.gallery-caption').textContent;
            showLightbox(index, caption);
        });
        
        // Keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Close lightbox on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Simple lightbox implementation
function showLightbox(index, caption) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Gallery image view');
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const image = document.createElement('div');
    image.className = 'lightbox-image';
    image.style.background = getGalleryBackground(index);
    
    const captionEl = document.createElement('p');
    captionEl.className = 'lightbox-caption';
    captionEl.textContent = caption;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    
    lightboxContent.appendChild(image);
    lightboxContent.appendChild(captionEl);
    lightboxContent.appendChild(closeBtn);
    lightbox.appendChild(lightboxContent);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
        }
        
        .lightbox-content {
            max-width: 900px;
            max-height: 90vh;
            text-align: center;
        }
        
        .lightbox-image {
            height: 70vh;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .lightbox-caption {
            color: white;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 10px;
        }
        
        .lightbox-close:hover {
            opacity: 0.7;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    
    // Close events
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Focus management
    closeBtn.focus();
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.remove();
    }
}

function getGalleryBackground(index) {
    const backgrounds = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    return backgrounds[index % backgrounds.length];
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus
                setTimeout(() => {
                    target.focus({ preventScroll: true });
                }, 500);
            }
        });
    });
}

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.room-card, .amenity-card, .experience-card, .gallery-item');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.booking-error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

function showBookingMessage(type, message) {
    const messageElement = document.getElementById('bookingMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `booking-message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Room detail buttons (placeholder functionality)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('room-details')) {
        e.preventDefault();
        const roomCard = e.target.closest('.room-card');
        const roomTitle = roomCard.querySelector('.room-title').textContent;
        
        // In a real application, this would open a modal or navigate to a detail page
        console.log(`View details for: ${roomTitle}`);
        
        // Simple feedback
        e.target.textContent = 'Coming Soon';
        setTimeout(() => {
            e.target.textContent = 'View Details';
        }, 2000);
    }
});

// Explore dining button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button') && e.target.textContent === 'Explore Dining') {
        e.preventDefault();
        // Scroll to restaurant section
        const restaurantSection = document.querySelector('.restaurant-section');
        if (restaurantSection) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = restaurantSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(function() {
    // Scroll-based animations can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Console log for debugging (remove in production)
console.log('Azure Haven Hotel - JavaScript loaded successfully');