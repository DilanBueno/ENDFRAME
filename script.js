const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height, stars;

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5,
            opacity: Math.random()
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
        }

        // Pulse effect
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;
    });

    requestAnimationFrame(animate);
}

// Mouse parallax effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const smoothing = 0.1; // valor entre 0 e 1, menor = mais suave

function updateParallax() {
    // Interpolação linear para suavizar o movimento
    mouseX += (targetX - mouseX) * smoothing;
    mouseY += (targetY - mouseY) * smoothing;
    
    const nebula = document.querySelector('.nebula');
    if (nebula) {
        nebula.style.transform = `translate(${mouseX}px, ${mouseY}px) rotate(${Date.now() / 10000}deg)`;
    }

    // Portal Parallax
    const portal = document.querySelector('.hero-visual-bg');
    if (portal) {
        portal.style.transform = `translate(calc(-50% + ${mouseX * 1.5}px), calc(-50% + ${mouseY * 1.5}px))`;
    }

    // Title tilt effect
    const title = document.querySelector('.glitch-title');
    if (title) {
        title.style.transform = `perspective(1000px) rotateX(${-mouseY * 0.5}deg) rotateY(${mouseX * 0.5}deg)`;
    }
    
    requestAnimationFrame(updateParallax);
}

window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - width / 2) / 50;
    targetY = (e.clientY - height / 2) / 50;
});

window.addEventListener('resize', init);

init();
animate();
updateParallax();

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.glass-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.8s ease-out';
    observer.observe(card);
});

// ===== MOBILE MENU TOGGLE =====
 (function initMobileMenu() {
     const toggle = document.querySelector('.mobile-menu-toggle');
     const overlay = document.getElementById('mobileMenuOverlay');
     const closeBtn = document.querySelector('.mobile-menu-close');
     const menuItems = document.querySelectorAll('.mobile-menu-item');
     
     if (!toggle || !overlay) return;
     
     // Detectar se é dispositivo móvel
     const isMobile = window.innerWidth <= 768;
     if (!isMobile) return;
     
     let menuOpen = false;
     
     // Abrir/fechar menu
     toggle.addEventListener('click', (e) => {
         e.stopPropagation();
         toggleMenu();
     });
     
     // Fechar com botão X
     if (closeBtn) {
         closeBtn.addEventListener('click', (e) => {
             e.stopPropagation();
             closeMenu();
         });
     }
     
     function toggleMenu() {
         if (menuOpen) {
             closeMenu();
         } else {
             openMenu();
         }
     }
     
     function openMenu() {
         overlay.classList.add('active');
         toggle.classList.add('active');
         menuOpen = true;
         // Prevenir scroll do body
         document.body.style.overflow = 'hidden';
     }
     
     function closeMenu() {
         overlay.classList.remove('active');
         toggle.classList.remove('active');
         menuOpen = false;
         document.body.style.overflow = '';
     }
     
     // Fechar ao clicar em um link do menu
     menuItems.forEach(item => {
         item.addEventListener('click', () => {
             closeMenu();
         });
     });
     
     // Fechar ao clicar no overlay (fora do conteúdo)
     overlay.addEventListener('click', (e) => {
         if (e.target === overlay) {
             closeMenu();
         }
     });
     
     // Fechar com tecla ESC
     document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && menuOpen) {
             closeMenu();
         }
     });
     
     // Ajustar ao redimensionar (sair do mobile)
     window.addEventListener('resize', () => {
         if (window.innerWidth > 768 && menuOpen) {
             closeMenu();
         }
     });
 })();

// ===== CONTACT BUTTON SYSTEM (ATTENTION + MOBILE MENU) =====
(function initContactSystem() {
    const contactLink = document.querySelector('nav ul li:nth-child(3) a[href="#contact"]');
    const contactFloat = document.querySelector('.contact-float');
    const actionMenu = document.getElementById('contactActionMenu');
    const tooltip = document.querySelector('.contact-tooltip');
    
    if (!contactLink || !contactFloat) return;
    
    // Detectar se é dispositivo móvel
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // ===== FUNÇÃO DE ANIMAÇÃO DE ATENÇÃO =====
    function triggerAttention() {
        contactFloat.classList.remove('attention-call');
        void contactFloat.offsetWidth;
        contactFloat.classList.add('attention-call');
        
        setTimeout(() => {
            contactFloat.classList.remove('attention-call');
        }, 2500);
    }
    
    // Clique no link do menu "Contato" dispara animação
    contactLink.addEventListener('click', triggerAttention);
    
    // ===== MOBILE: MENU DE AÇÃO =====
    if (isMobile && actionMenu) {
        let menuOpen = false;
        
        // Abrir/fechar menu ao tocar no botão
        contactFloat.addEventListener('click', (e) => {
            e.preventDefault(); // Impede abrir email diretamente
            e.stopPropagation();
            
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fechar menu ao tocar fora
        document.addEventListener('click', (e) => {
            if (menuOpen && !actionMenu.contains(e.target) && !contactFloat.contains(e.target)) {
                closeMenu();
            }
        });
        
        function openMenu() {
            actionMenu.classList.add('active');
            menuOpen = true;
        }
        
        function closeMenu() {
            actionMenu.classList.remove('active');
            menuOpen = false;
        }
        
        // Ações dos botões do menu
        actionMenu.querySelectorAll('.menu-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                
                if (action === 'copy') {
                    copyEmail();
                } else if (action === 'open') {
                    window.location.href = 'mailto:dilanbueno1512@gmail.com';
                }
                
                closeMenu();
            });
        });
        
        function copyEmail() {
            const email = 'dilanbueno1512@gmail.com';
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(() => showToast('EMAIL COPIADO!'))
                    .catch(fallbackCopy);
            } else {
                fallbackCopy();
            }
        }
        
        function fallbackCopy() {
            const textArea = document.createElement('textarea');
            textArea.value = 'dilanbueno1512@gmail.com';
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('EMAIL COPIADO!');
        }
        
        function showToast(message) {
            const existingToast = document.querySelector('.contact-toast');
            if (existingToast) existingToast.remove();
            
            const toast = document.createElement('div');
            toast.className = 'contact-toast';
            toast.textContent = message;
            
            // Adicionar estilos dinamicamente se não existir
            if (!document.querySelector('#contact-toast-styles')) {
                const style = document.createElement('style');
                style.id = 'contact-toast-styles';
                style.textContent = `
                    .contact-toast {
                        position: fixed;
                        bottom: 200px;
                        right: 30px;
                        background: rgba(0, 0, 0, 0.95);
                        backdrop-filter: blur(20px);
                        border: 1px solid #0f0;
                        border-left: 3px solid #0f0;
                        color: #fff;
                        padding: 12px 24px;
                        font-family: 'Orbitron', sans-serif;
                        font-size: 0.8rem;
                        letter-spacing: 2px;
                        z-index: 10001;
                        animation: toast-fade-in-out 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    }
                    @keyframes toast-fade-in-out {
                        0% { opacity: 0; transform: translateY(20px); }
                        15% { opacity: 1; transform: translateY(0); }
                        85% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-20px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 2000);
        }
        
        // disparar animação de atenção quando a seção de contato aparecer
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        triggerAttention();
                    }
                });
            }, { threshold: 0.3 });
            
            sectionObserver.observe(contactSection);
        }
        
        return; // Não executar lógica de desktop
    }
    
    // ===== DESKTOP: TOOLTIP CLICÁVEL =====
    if (!isMobile && tooltip) {
        // Garantir que tooltip seja clicável
        tooltip.style.pointerEvents = 'auto';
        tooltip.style.cursor = 'pointer';
        
        // Copiar email ao clicar no tooltip
        tooltip.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const email = 'dilanbueno1512@gmail.com';
            
            try {
                await navigator.clipboard.writeText(email);
                const originalText = tooltip.querySelector('.tooltip-text').textContent;
                tooltip.querySelector('.tooltip-text').textContent = 'COPIADO!';
                tooltip.style.borderLeftColor = '#0f0';
                tooltip.style.color = '#0f0';
                
                setTimeout(() => {
                    tooltip.querySelector('.tooltip-text').textContent = originalText;
                    tooltip.style.borderLeftColor = '';
                    tooltip.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Erro ao copiar:', err);
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = tooltip.querySelector('.tooltip-text').textContent;
                tooltip.querySelector('.tooltip-text').textContent = 'COPIADO!';
                setTimeout(() => {
                    tooltip.querySelector('.tooltip-text').textContent = originalText;
                }, 2000);
            }
        });
    }
})();





