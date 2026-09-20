/**
 * Azure Haven Hotel - Main JavaScript
 * Handles interactive functionality and user experience enhancements
 */

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const bookingForm = document.getElementById('bookingForm');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const guestsSelect = document.getElementById('guests');
const roomsSelect = document.getElementById('rooms');
const bookingMessage = document.getElementById('bookingMessage');
const testimonialsSlider = document.getElementById('testimonialsSlider');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const testimonialDots = document.getElementById('testimonialDots');
const header = document.getElementById('header');

// State Management
let currentTestimonial = 0;
let isNavOpen = false;
const testimonialCards = document.querySelectorAll('.testimonial-card');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBooking();
    initializeTestimonials();
    initializeScrollEffects();
    initializeGallery();
    initializeRoomInteractions();
    setMinDates();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleNavigation);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isNavOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeNavigation();
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeNavigation();
            });
        });
        
        // Handle keyboard navigation
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNavigation();
            }
        });
    }
}

function toggleNavigation() {
    isNavOpen = !isNavOpen;
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    
    if (navToggle) {
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isNavOpen);
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
}

function closeNavigation() {
    isNavOpen = false;
    
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    
    document.body.style.overflow = '';
}

/**
 * Booking form functionality
 */
function initializeBooking() {
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
        // Real-time validation
        if (checkInInput) {
            checkInInput.addEventListener('change', validateDates);
        }
        
        if (checkOutInput) {
            checkOutInput.addEventListener('change', validateDates);
        }
        
        if (guestsSelect) {
            guestsSelect.addEventListener('change', validateGuests);
        }
        
        if (roomsSelect) {
            roomsSelect.addEventListener('change', validateRooms);
        }
    }
}

function setMinDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (checkInInput) {
        checkInInput.min = today.toISOString().split('T')[0];
    }
    
    if (checkOutInput) {
        checkOutInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function validateDates() {
    if (!checkInInput || !checkOutInput) return;
    
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Clear previous errors
    clearBookingErrors();
    
    let isValid = true;
    
    // Validate check-in date
    if (checkInInput.value && checkInDate < today) {
        showFieldError('checkIn', 'Check-in date cannot be in the past');
        isValid = false;
    }
    
    // Validate check-out date
    if (checkOutInput.value && checkInInput.value) {
        if (checkOutDate <= checkInDate) {
            showFieldError('checkOut', 'Check-out must be after check-in');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateGuests() {
    if (!guestsSelect) return true;
    
    clearBookingErrors();
    
    if (guestsSelect.value === '') {
        showFieldError('guests', 'Please select number of guests');
        return false;
    }
    
    return true;
}

function validateRooms() {
    if (!roomsSelect) return true;
    
    clearBookingErrors();
    
    if (roomsSelect.value === '') {
        showFieldError('rooms', 'Please select number of rooms');
        return false;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
    }
}

function clearBookingErrors() {
    const errorElements = document.querySelectorAll('.booking-error');
    const inputs = document.querySelectorAll('.booking-input, .booking-select');
    
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isDatesValid = validateDates();
    const isGuestsValid = validateGuests();
    const isRoomsValid = validateRooms();
    
    if (!isDatesValid || !isGuestsValid || !isRoomsValid) {
        showBookingMessage('Please correct the errors above', 'error');
        return;
    }
    
    // Get form values
    const formData = {
        checkIn: checkInInput?.value || '',
        checkOut: checkOutInput?.value || '',
        guests: guestsSelect?.value || '',
        rooms: roomsSelect?.value || ''
    };
    
    // Simulate booking search
    showBookingMessage('Searching for available rooms...', 'success');
    
    setTimeout(() => {
        const nights = calculateNights(formData.checkIn, formData.checkOut);
        showBookingMessage(
            `Found ${formData.rooms} room(s) available for ${nights} night(s) from ${formatDate(formData.checkIn)} to ${formatDate(formData.checkOut)}. Please contact us to complete your booking.`,
            'success'
        );
    }, 1500);
}

function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showBookingMessage(message, type) {
    if (!bookingMessage) return;
    
    bookingMessage.textContent = message;
    bookingMessage.className = `booking-message ${type}`;
    bookingMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        bookingMessage.style.display = 'none';
    }, 5000);
}

/**
 * Testimonials slider functionality
 */
function initializeTestimonials() {
    if (!testimonialsSlider || testimonialCards.length === 0) return;
    
    // Create dot indicators
    createTestimonialDots();
    
    // Set up navigation buttons
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => navigateTestimonials('prev'));
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => navigateTestimonials('next'));
    }
    
    // Auto-rotate testimonials
    startTestimonialAutoplay();
    
    // Pause autoplay on hover
    testimonialsSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
    testimonialsSlider.addEventListener('mouseleave', startTestimonialAutoplay);
    
    // Keyboard navigation
    testimonialsSlider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigateTestimonials('prev');
        } else if (e.key === 'ArrowRight') {
            navigateTestimonials('next');
        }
    });
}

function createTestimonialDots() {
    if (!testimonialDots) return;
    
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToTestimonial(index));
        testimonialDots.appendChild(dot);
    });
    
    updateTestimonialDots();
}

function navigateTestimonials(direction) {
    const totalTestimonials = testimonialCards.length;
    
    if (direction === 'prev') {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    } else {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    }
    
    updateTestimonialPosition();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialPosition();
}

function updateTestimonialPosition() {
    if (!testimonialsTrack) return;
    
    const offset = -currentTestimonial * 100;
    testimonialsTrack.style.transform = `translateX(${offset}%)`;
    updateTestimonialDots();
}

function updateTestimonialDots() {
    if (!testimonialDots) return;
    
    const dots = testimonialDots.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

let testimonialAutoplayInterval;

function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    testimonialAutoplayInterval = setInterval(() => {
        navigateTestimonials('next');
    }, 5000);
}

function stopTestimonialAutoplay() {
    if (testimonialAutoplayInterval) {
        clearInterval(testimonialAutoplayInterval);
    }
}

/**
 * Scroll effects and header behavior
 */
function initializeScrollEffects() {
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for header styling
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Gallery functionality
 */
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Simple lightbox effect could be implemented here
            // For now, just add a visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Keyboard interaction
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Room interactions
 */
function initializeRoomInteractions() {
    const roomDetailsButtons = document.querySelectorAll('.room-details');
    
    roomDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const roomCard = this.closest('.room-card');
            const roomTitle = roomCard.querySelector('.room-title').textContent;
            
            // Simple modal or alert for room details
            showRoomDetails(roomTitle);
        });
    });
}

function showRoomDetails(roomName) {
    // Create a simple modal for room details
    const modal = document.createElement('div');
    modal.className = 'room-modal';
    modal.innerHTML = `
        <div class="room-modal-content">
            <h3>${roomName}</h3>
            <p>Experience the ultimate in luxury and comfort. This room features premium amenities, stunning views, and exceptional service.</p>
            <ul>
                <li>Luxury bedding and linens</li>
                <li>Mini bar and coffee station</li>
                <li>High-speed internet</li>
                <li>24/7 room service</li>
                <li>Daily housekeeping</li>
            </ul>
            <button class="btn btn-primary close-modal">Close</button>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .room-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 2rem;
        }
        .room-modal-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .room-modal-content h3 {
            margin-bottom: 1rem;
        }
        .room-modal-content ul {
            margin: 1rem 0;
        }
        .room-modal-content li {
            margin-bottom: 0.5rem;
        }
        .close-modal {
            margin-top: 1.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBtn.click();
        }
    });
}

/**
 * Utility functions
 */

// Debounce function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add fade-in animation to elements as they come into view
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    const animateOnScroll = debounce(() => {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }, 100);
    
    // Set initial styles
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Check initial state
}

// Initialize scroll animations
initializeScrollAnimations();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}