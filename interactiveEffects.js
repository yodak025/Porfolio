/* =========================================
   EFECTOS INTERACTIVOS ADICIONALES
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todos los efectos
    initScrollEffects();
    initParallaxEffects();
    initHoverEffects();
    initScrollIndicator();
    initAnimationObserver();
    initSmoothScrolling();
    initParticleSystem();
    
    console.log('🚀 Portfolio animations loaded successfully!');
});

// Efecto de scroll suave y revelado de elementos
function initScrollEffects() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animationDelay = '0s';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Efectos parallax suaves
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate);
}

// Efectos de hover mejorados
function initHoverEffects() {
    // Efecto de seguimiento del mouse en cards
    const cards = document.querySelectorAll('.card, .section');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Efecto de ondas en botones
    const buttons = document.querySelectorAll('button, .btn, .project-btn, .skill-btn, .tech-selector-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Indicador de progreso de scroll
function initScrollIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercentage + '%';
    });
}

// Observer para animaciones en entrada
function initAnimationObserver() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Agregar delay escalonado para elementos hermanos
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Scroll suave mejorado para navegación
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Sistema de partículas flotantes
function initParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición inicial aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        particleContainer.appendChild(particle);
        
        // Remover la partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 20000);
    }
    
    // Crear partículas periódicamente
    setInterval(createParticle, 2000);
    
    // Crear algunas partículas iniciales
    for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 400);
    }
}

// Efectos de typing para texto
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--green)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    });
}

// Efectos de carga de página
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// Efectos especiales para los iconos
function enhanceIcons() {
    const icons = document.querySelectorAll('.icon');
    
    icons.forEach(icon => {
        icon.classList.add('icon-hover-effect');
        
        // Efecto de flotación aleatoria
        const floatAnimation = `float-${Math.floor(Math.random() * 3)}`;
        icon.style.animation = `${floatAnimation} 3s ease-in-out infinite`;
        icon.style.animationDelay = Math.random() * 2 + 's';
    });
}

// Efectos de texto wave
function initTextWaveEffect() {
    const waveTexts = document.querySelectorAll('.wave-text');
    
    waveTexts.forEach(text => {
        const letters = text.textContent.split('');
        text.textContent = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.className = 'text-wave';
            span.style.animationDelay = `${index * 0.1}s`;
            text.appendChild(span);
        });
    });
}

// Efecto de cursor personalizado mejorado
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Efectos especiales en hover
    const hoverElements = document.querySelectorAll('a, button, .card, .icon');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// CSS para efectos de ondas (ripple)
const rippleCSS = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(67, 154, 134, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.custom-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
}

.cursor-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--green);
    position: absolute;
    transform: translate(-50%, -50%);
}

.cursor-ring {
    width: 32px;
    height: 32px;
    border: 2px solid var(--orange);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
}

.custom-cursor.cursor-hover .cursor-ring {
    width: 48px;
    height: 48px;
    border-color: var(--green);
}

@keyframes float-0 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
}

@keyframes float-1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(-3deg); }
    66% { transform: translateY(-12px) rotate(3deg); }
}

@keyframes float-2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-6px) rotate(2deg); }
    75% { transform: translateY(-14px) rotate(-2deg); }
}
`;

// Agregar CSS dinámicamente
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Inicializar efectos adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(enhanceIcons, 500);
    setTimeout(initTextWaveEffect, 1000);
    // initCustomCursor(); // Descomentar si quieres el cursor personalizado
    // initPageLoader(); // Descomentar si quieres el loader de página
});
