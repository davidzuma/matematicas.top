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
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Quiz System
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizData = {};

// Quiz questions database
const quizQuestions = {
    integrales: {
        title: "Cuestionario de Integrales",
        questions: [
            {
                question: "¿Cuál es la integral de x²?",
                options: ["x³/3 + C", "2x + C", "x³ + C", "3x² + C"],
                correct: 0
            },
            {
                question: "¿Qué método usarías para integrar ∫x·e^x dx?",
                options: ["Sustitución", "Integración por partes", "Fracciones parciales", "Directa"],
                correct: 1
            },
            {
                question: "La integral definida ∫[0,1] x dx es igual a:",
                options: ["1", "1/2", "0", "2"],
                correct: 1
            },
            {
                question: "¿Cuál es la antiderivada de 1/x?",
                options: ["x²/2", "ln(x) + C", "-1/x²", "1"],
                correct: 1
            },
            {
                question: "Para integrar ∫cos(x)dx obtenemos:",
                options: ["-sen(x) + C", "sen(x) + C", "cos(x) + C", "-cos(x) + C"],
                correct: 1
            }
        ]
    },
    derivadas: {
        title: "Cuestionario de Derivadas",
        questions: [
            {
                question: "La derivada de x³ es:",
                options: ["x²", "3x²", "3x³", "x⁴/4"],
                correct: 1
            },
            {
                question: "¿Cuál es la regla de la cadena?",
                options: ["(f+g)' = f' + g'", "(fg)' = f'g + fg'", "(f∘g)' = f'(g)·g'", "(f/g)' = (f'g - fg')/g²"],
                correct: 2
            },
            {
                question: "La derivada de sen(x) es:",
                options: ["cos(x)", "-cos(x)", "-sen(x)", "tan(x)"],
                correct: 0
            },
            {
                question: "Si f(x) = e^x, entonces f'(x) =",
                options: ["xe^(x-1)", "e^x", "e^x · ln(e)", "x·e^x"],
                correct: 1
            },
            {
                question: "La derivada de ln(x) es:",
                options: ["1/x", "ln(x)", "e^x", "x"],
                correct: 0
            }
        ]
    },
    limites: {
        title: "Cuestionario de Límites",
        questions: [
            {
                question: "¿Qué significa que lim(x→a) f(x) = L?",
                options: ["f(a) = L", "f(x) se acerca a L cuando x se acerca a a", "f(x) = L para todo x", "f es continua en a"],
                correct: 1
            },
            {
                question: "El límite lim(x→0) (sen(x)/x) es igual a:",
                options: ["0", "1", "∞", "No existe"],
                correct: 1
            },
            {
                question: "¿Cuándo se aplica la regla de L'Hôpital?",
                options: ["Siempre", "Para formas indeterminadas 0/0 o ∞/∞", "Solo para polinomios", "Cuando f es continua"],
                correct: 1
            },
            {
                question: "El límite lim(x→∞) (1/x) es:",
                options: ["1", "∞", "0", "-1"],
                correct: 2
            },
            {
                question: "Si f(x) = (x²-1)/(x-1), ¿cuál es lim(x→1) f(x)?",
                options: ["0", "1", "2", "No existe"],
                correct: 2
            }
        ]
    },
    funciones: {
        title: "Cuestionario de Funciones",
        questions: [
            {
                question: "¿Qué es el dominio de una función?",
                options: ["Los valores de salida", "Los valores de entrada permitidos", "La gráfica de la función", "La derivada"],
                correct: 1
            },
            {
                question: "Una función f es inyectiva si:",
                options: ["f(a) = f(b) implica a = b", "Todo y tiene preimagen", "Es continua", "Es derivable"],
                correct: 0
            },
            {
                question: "El rango de f(x) = x² es:",
                options: ["ℝ", "[0, +∞)", "(-∞, 0]", "[-1, 1]"],
                correct: 1
            },
            {
                question: "Si f(x) = 2x + 1 y g(x) = x², entonces (f∘g)(x) =",
                options: ["2x² + 1", "2x³ + x²", "(2x + 1)²", "2x² + 2x + 1"],
                correct: 0
            },
            {
                question: "Una función par cumple:",
                options: ["f(-x) = f(x)", "f(-x) = -f(x)", "f(x) = x", "f es creciente"],
                correct: 0
            }
        ]
    },
    geometria: {
        title: "Cuestionario de Geometría Analítica",
        questions: [
            {
                question: "La distancia entre los puntos (0,0) y (3,4) es:",
                options: ["7", "5", "12", "√7"],
                correct: 1
            },
            {
                question: "La ecuación de la recta que pasa por (1,2) con pendiente 3 es:",
                options: ["y = 3x - 1", "y = 3x + 2", "y = x + 3", "y = 3x - 5"],
                correct: 0
            },
            {
                question: "El centro de la circunferencia x² + y² - 4x + 6y = 0 es:",
                options: ["(0,0)", "(2,-3)", "(4,-6)", "(-2,3)"],
                correct: 1
            },
            {
                question: "Dos rectas son paralelas si:",
                options: ["Se cortan", "Tienen la misma pendiente", "Son perpendiculares", "Una es vertical"],
                correct: 1
            },
            {
                question: "La ecuación x²/9 + y²/4 = 1 representa:",
                options: ["Una circunferencia", "Una parábola", "Una elipse", "Una hipérbola"],
                correct: 2
            }
        ]
    },
    estadistica: {
        title: "Cuestionario de Probabilidad y Estadística",
        questions: [
            {
                question: "La media aritmética de 2, 4, 6, 8 es:",
                options: ["4", "5", "6", "20"],
                correct: 1
            },
            {
                question: "Si P(A) = 0.3 y P(B) = 0.4, y A y B son independientes, entonces P(A∩B) =",
                options: ["0.7", "0.12", "0.1", "0.04"],
                correct: 1
            },
            {
                question: "La mediana de 1, 3, 7, 9, 12 es:",
                options: ["6.4", "7", "3", "9"],
                correct: 1
            },
            {
                question: "¿Cuál es la probabilidad de obtener cara al lanzar una moneda?",
                options: ["0", "0.5", "1", "0.25"],
                correct: 1
            },
            {
                question: "En una distribución normal, ¿qué porcentaje de datos está dentro de 1 desviación estándar?",
                options: ["50%", "68%", "95%", "99%"],
                correct: 1
            }
        ]
    }
};

// Start quiz function
function startQuiz(subject) {
    console.log('Starting quiz for subject:', subject);
    
    if (!quizQuestions[subject]) {
        alert('Cuestionario no disponible aún. ¡Próximamente!');
        return;
    }
    
    currentQuiz = subject;
    currentQuestionIndex = 0;
    userAnswers = [];
    quizData = quizQuestions[subject];
    
    console.log('Quiz data loaded:', quizData);
    console.log('Total questions:', quizData.questions.length);
    
    // Show modal
    document.getElementById('quiz-modal').style.display = 'block';
    document.getElementById('quiz-title').textContent = quizData.title;
    
    // Reset quiz content
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    loadQuestion();
}

// Load current question
function loadQuestion() {
    const question = quizData.questions[currentQuestionIndex];
    const totalQuestions = quizData.questions.length;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('question-counter').textContent = `${currentQuestionIndex + 1} / ${totalQuestions}`;
    
    // Load question text
    document.getElementById('question-text').textContent = question.question;
    
    // Load options
    const optionsContainer = document.getElementById('question-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.onclick = () => selectOption(index);
        
        optionBtn.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span>${option}</span>
        `;
        
        optionsContainer.appendChild(optionBtn);
    });
}

// Select option
function selectOption(optionIndex) {
    console.log('Selecting option:', optionIndex, 'for question:', currentQuestionIndex);
    
    // Store answer immediately
    userAnswers[currentQuestionIndex] = optionIndex;
    console.log('Stored answer. Current userAnswers:', [...userAnswers]);
    
    // Visual feedback
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.remove('selected');
        if (idx === optionIndex) {
            btn.classList.add('selected');
        }
    });
    
    // Check if quiz is complete
    const isLastQuestion = currentQuestionIndex >= quizData.questions.length - 1;
    console.log('Is last question?', isLastQuestion, 'Current index:', currentQuestionIndex, 'Total questions:', quizData.questions.length);
    
    setTimeout(() => {
        if (isLastQuestion) {
            console.log('Finishing quiz with answers:', userAnswers);
            finishQuiz();
        } else {
            currentQuestionIndex++;
            console.log('Moving to next question:', currentQuestionIndex);
            loadQuestion();
        }
    }, 800);
}

// Calculate grade based on percentage
function calculateGrade(percentage) {
    if (percentage >= 90) {
        return {
            letter: 'A',
            description: 'Sobresaliente',
            numeric: 9.0 + (percentage - 90) * 0.1
        };
    } else if (percentage >= 80) {
        return {
            letter: 'B',
            description: 'Notable',
            numeric: 7.0 + (percentage - 80) * 0.2
        };
    } else if (percentage >= 60) {
        return {
            letter: 'C',
            description: 'Bien',
            numeric: 5.0 + (percentage - 60) * 0.1
        };
    } else if (percentage >= 40) {
        return {
            letter: 'D',
            description: 'Suficiente',
            numeric: 4.0 + (percentage - 40) * 0.05
        };
    } else {
        return {
            letter: 'F',
            description: 'Insuficiente',
            numeric: Math.max(0, percentage * 0.04)
        };
    }
}

// Finish quiz
function finishQuiz() {
    console.log('finishQuiz called');
    console.log('userAnswers:', userAnswers);
    console.log('quizData.questions:', quizData.questions);
    
    // Calculate score
    let correctAnswers = 0;
    quizData.questions.forEach((question, index) => {
        console.log(`Question ${index}: user answer ${userAnswers[index]}, correct answer ${question.correct}`);
        if (userAnswers[index] === question.correct) {
            correctAnswers++;
        }
    });
    
    console.log('Correct answers:', correctAnswers);
    
    const totalQuestions = quizData.questions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Percentage:', percentage);
    
    // Calculate grade
    const gradeInfo = calculateGrade(percentage);
    console.log('Grade info:', gradeInfo);
    
    // Show results
    // Hide questions section only
    document.querySelector('#quiz-container .quiz-header').style.display = 'none';
    document.querySelector('#quiz-container .quiz-content').style.display = 'none';
    // Display results
    document.getElementById('quiz-results').style.display = 'block';
    
    console.log('Results container shown');
    
    // Update score display
    document.getElementById('score-percentage').textContent = percentage + '%';
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('total-questions').textContent = totalQuestions;
    
    // Update grade display
    const gradeBadge = document.getElementById('grade-badge');
    const gradeLetter = document.getElementById('grade-letter');
    const gradeDescription = document.getElementById('grade-description');
    const numericGrade = document.getElementById('numeric-grade');
    
    gradeLetter.textContent = gradeInfo.letter;
    gradeDescription.textContent = gradeInfo.description;
    // Direct numeric grade as percentage divided by 10
    const simpleNumeric = (percentage / 10).toFixed(1);
    numericGrade.textContent = simpleNumeric + '/10';
    
    // Remove any existing grade classes
    gradeBadge.classList.remove('grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f');
    gradeBadge.classList.add('grade-' + gradeInfo.letter.toLowerCase());
    
    // Generate message based on score
    let message = '';
    let messageClass = '';
    
    if (percentage >= 90) {
        message = '¡Excelente! 🎉 Dominas muy bien este tema. ¡Sigue así!';
        messageClass = 'excellent';
    } else if (percentage >= 70) {
        message = '¡Muy bien! 👏 Tienes una buena comprensión del tema. Repasa las preguntas incorrectas.';
        messageClass = 'good';
    } else if (percentage >= 50) {
        message = 'Bien 📚 Tienes conocimientos básicos. Te recomendamos estudiar más este tema.';
        messageClass = 'fair';
    } else {
        message = 'Necesitas más práctica 💪 Te recomendamos revisar los apuntes y intentar de nuevo.';
        messageClass = 'needs-work';
    }
    
    document.getElementById('results-message').textContent = message;
    document.getElementById('results-message').className = `results-message ${messageClass}`;
}

// Restart quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    // Restore questions section visibility
    document.querySelector('#quiz-container .quiz-header').style.display = 'block';
    document.querySelector('#quiz-container .quiz-content').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    loadQuestion();
}

// Close quiz
function closeQuiz() {
    document.getElementById('quiz-modal').style.display = 'none';
}

// Note functions
function previewNotes(subject) {
    alert(`Vista previa de ${subject} estará disponible próximamente.`);
}

function buyNotes(subject) {
    alert(`Redirigiendo al sistema de pago para ${subject}...`);
}

function openGrapher() {
    alert('Graficador de funciones estará disponible próximamente.');
}

function downloadFormulas() {
    alert('Descarga de formularios estará disponible próximamente.');
}

function openExercises() {
    alert('Banco de ejercicios estará disponible próximamente.');
}

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
