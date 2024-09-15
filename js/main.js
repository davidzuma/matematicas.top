// js/script.js
const words = ['Entiende', 'Aprende', 'Aprueba'];
let currentIndex = 0;

function animateText() {
    const textElement = document.getElementById('animatedText');
    textElement.style.opacity = 0;
    
    setTimeout(() => {
        textElement.textContent = words[currentIndex];
        textElement.style.opacity = 1;
        
        currentIndex = (currentIndex + 1) % words.length;
        
        setTimeout(animateText, 1500);
    }, 500);
}

animateText();
