// Enhanced JavaScript for matematicas.top
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        setTimeout(() => {
            loadingSpinner.classList.add('fade-out');
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 500);
        }, 800);
    }

    // Animated text in hero section
    const words = ['Entiende', 'Aprende', 'Aprueba', 'Domina', 'Supera'];
    let currentIndex = 0;

    function animateText() {
        const textElement = document.getElementById('animatedText');
        if (textElement) {
            textElement.style.opacity = 0;
            
            setTimeout(() => {
                textElement.textContent = words[currentIndex];
                textElement.style.opacity = 1;
                
                currentIndex = (currentIndex + 1) % words.length;
                
                setTimeout(animateText, 2000);
            }, 500);
        }
    }

    animateText();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const target = document.querySelector('#cursos');
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Calculator functionality
let calcDisplay = '';

function openCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function appendToCalc(value) {
    const display = document.getElementById('calc-result');
    if (display) {
        calcDisplay += value;
        display.value = calcDisplay;
    }
}

function clearCalc() {
    const display = document.getElementById('calc-result');
    if (display) {
        calcDisplay = '';
        display.value = '';
    }
}

function deleteLast() {
    const display = document.getElementById('calc-result');
    if (display && calcDisplay.length > 0) {
        calcDisplay = calcDisplay.slice(0, -1);
        display.value = calcDisplay;
    }
}

function calculateResult() {
    const display = document.getElementById('calc-result');
    if (display && calcDisplay) {
        try {
            // Replace display symbols with actual operators
            let expression = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(expression);
            display.value = result;
            calcDisplay = result.toString();
        } catch (error) {
            display.value = 'Error';
            calcDisplay = '';
        }
    }
}

// Other resource functions
function openGrapher() {
    // For demo purposes, we'll show an alert
    // In a real implementation, you'd open a graphing tool
    alert('¡Próximamente! El graficador de funciones estará disponible muy pronto. Mientras tanto, puedes usar herramientas como Desmos o GeoGebra.');
}

function downloadFormulas() {
    // For demo purposes, we'll show an alert
    // In a real implementation, you'd provide downloadable PDFs
    alert('¡Genial! Los formularios en PDF estarán disponibles próximamente. Suscríbete a nuestro canal de YouTube para recibir notificaciones.');
}

function openExercises() {
    // For demo purposes, we'll show an alert
    // In a real implementation, you'd open an exercise platform
    alert('¡Excelente idea! El banco de ejercicios resueltos estará disponible pronto. Por ahora, revisa nuestros videos en YouTube.');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('calculator-modal');
    if (event.target === modal) {
        closeCalculator();
    }
});

// Keyboard support for calculator
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('calculator-modal');
    if (modal && modal.style.display === 'block') {
        const key = event.key;
        
        if ('0123456789.+-*/'.includes(key)) {
            appendToCalc(key === '*' ? '×' : key === '/' ? '÷' : key);
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
        } else if (key === 'Escape') {
            closeCalculator();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Delete' || key.toLowerCase() === 'c') {
            clearCalc();
        }
    }
});

// Performance optimizations
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Scroll-related operations here if needed
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Analytics and tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Add your analytics tracking here
    console.log(`Event: ${eventName}`, eventData);
}
