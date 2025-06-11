// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Calendly integration
    initCalendlyIntegration();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Animate skill bars when they come into view
    initSkillBarAnimations();
    
    // Add scroll-based header styling
    initHeaderScrollEffect();
    
    // Add hover effects and interactions
    initInteractiveElements();
});

/**
 * Initialize Calendly integration for all buttons
 */
function initCalendlyIntegration() {
    const calendlyUrl = 'https://calendly.com/keyur-aghao';
    
    // Get all Calendly buttons
    const calendlyButtons = [
        document.getElementById('schedule-meeting-header'),
        document.getElementById('schedule-consultation-hero'),
        document.getElementById('book-consultation-contact')
    ];
    
    // Add click handlers to each button
    calendlyButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Try to use Calendly popup widget if available
                if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
                    try {
                        Calendly.initPopupWidget({
                            url: calendlyUrl
                        });
                    } catch (error) {
                        console.warn('Calendly popup failed, opening direct link:', error);
                        window.open(calendlyUrl, '_blank');
                    }
                } else {
                    // Fallback to direct link if Calendly widget is not available
                    console.log('Calendly widget not available, opening direct link');
                    window.open(calendlyUrl, '_blank');
                }
            });
        }
    });
    
    // Wait for Calendly script to load if not immediately available
    let retryCount = 0;
    const maxRetries = 10;
    
    function checkCalendlyAvailability() {
        if (typeof Calendly === 'undefined' && retryCount < maxRetries) {
            retryCount++;
            setTimeout(checkCalendlyAvailability, 500);
        } else if (typeof Calendly === 'undefined') {
            console.warn('Calendly widget failed to load after retries, using fallback');
            // All buttons already have fallback handlers
        }
    }
    
    checkCalendlyAvailability();
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavLink(this);
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('nav__link--active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('nav__link--active');
}

/**
 * Initialize skill bar animations
 */
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    
    // Create intersection observer to trigger animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                
                // Reset width and animate
                skillBar.style.width = '0%';
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 100);
                
                // Unobserve after animation
                observer.unobserve(skillBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * Initialize header scroll effect
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize interactive elements
 */
function initInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Skip ripple effect for Calendly buttons to avoid interference
            if (this.id && this.id.includes('schedule') || this.id.includes('book')) {
                return;
            }
            
            // Create ripple effect for other buttons
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add scroll-to-top functionality
    initScrollToTop();
    
    // Add section highlighting on scroll
    initSectionHighlighting();
}

/**
 * Initialize scroll to top functionality
 */
function initScrollToTop() {
    let scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize section highlighting based on scroll position
 */
function initSectionHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.pageYOffset + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                });
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav__link--active');
                }
            }
        });
    });
}

/**
 * Handle Calendly widget errors gracefully
 */
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('Calendly')) {
        console.warn('Calendly widget error detected:', e.message);
        
        // Ensure fallback functionality is in place
        const calendlyButtons = [
            document.getElementById('schedule-meeting-header'),
            document.getElementById('schedule-consultation-hero'),
            document.getElementById('book-consultation-contact')
        ];
        
        calendlyButtons.forEach(button => {
            if (button && !button.hasAttribute('data-fallback-set')) {
                button.setAttribute('data-fallback-set', 'true');
                button.onclick = function() {
                    window.open('https://calendly.com/keyur-aghao', '_blank');
                    return false;
                };
            }
        });
    }
});

/**
 * Add CSS for dynamic classes
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .header--scrolled {
            box-shadow: var(--shadow-md);
        }
        
        .nav__link--active {
            color: var(--color-primary);
            font-weight: var(--font-weight-semibold);
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .scroll-to-top:hover {
            background: var(--color-primary-hover);
            transform: translateY(-2px);
        }
        
        /* Enhanced card hover effects */
        .card {
            transition: all var(--duration-normal) var(--ease-standard);
        }
        
        /* Smooth transitions for interactive elements */
        .skill-tag, .btn, .publication, .conference {
            transition: all var(--duration-fast) var(--ease-standard);
        }
        
        /* Focus styles for better accessibility */
        .scroll-to-top:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        /* Loading animation for skill bars */
        .skill-bar__fill {
            position: relative;
            overflow: hidden;
        }
        
        .skill-bar__fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        /* Button loading state for Calendly buttons */
        .btn--loading {
            position: relative;
            color: transparent;
        }
        
        .btn--loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

/**
 * Performance optimization: Debounce scroll events
 */
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

/**
 * Accessibility enhancements
 */
function initAccessibilityFeatures() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && element.tagName !== 'A') {
            element.setAttribute('tabindex', '0');
        }
    });
}

// Initialize accessibility features
initAccessibilityFeatures();

/**
 * Additional error handling for network issues
 */
window.addEventListener('online', function() {
    console.log('Network connection restored');
    // Re-initialize Calendly if needed
    initCalendlyIntegration();
});

window.addEventListener('offline', function() {
    console.log('Network connection lost');
    // Show user-friendly message if needed
});