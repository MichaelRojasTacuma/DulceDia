// ===== VARIABLES GLOBALES =====
let musicaActiva = false;
const musica = document.getElementById("musica");
const musicToggle = document.getElementById("musicToggle");

// ===== CONTROL DE MÚSICA =====
function toggleMusica() {
    if (musicaActiva) {
        musica.pause();
        musicToggle.classList.add('muted');
        musicaActiva = false;
    } else {
        musica.play().catch(error => {
            console.log("Error al reproducir música:", error);
        });
        musicToggle.classList.remove('muted');
        musicaActiva = true;
    }
}

musicToggle.addEventListener('click', toggleMusica);

// ===== FUNCIÓN PARA CAMBIAR PANTALLAS =====
function cambiarPantalla(pantallaActualId, pantallaSiguienteId) {
    const pantallaActual = document.getElementById(pantallaActualId);
    const pantallaSiguiente = document.getElementById(pantallaSiguienteId);
    
    // Animación de salida
    pantallaActual.style.animation = 'fadeOutDown 0.6s ease-out';
    
    setTimeout(() => {
        pantallaActual.classList.remove('activo');
        pantallaSiguiente.classList.add('activo');
        
        // Scroll suave al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset animación
        pantallaActual.style.animation = '';
    }, 600);
}

// Animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }
`;
document.head.appendChild(style);

// ===== PANTALLA INICIAL =====
document.getElementById("btnIniciar").addEventListener('click', () => {
    cambiarPantalla('inicio', 'sorpresas');
    
    // Iniciar música automáticamente
    if (!musicaActiva) {
        musica.play().then(() => {
            musicaActiva = true;
            musicToggle.classList.remove('muted');
        }).catch(error => {
            console.log("No se pudo reproducir automáticamente:", error);
        });
    }
    
    // Animar las cartas con delay
    setTimeout(() => {
        const cartas = document.querySelectorAll('.carta-container');
        cartas.forEach((carta, index) => {
            setTimeout(() => {
                carta.style.opacity = '0';
                carta.style.transform = 'translateY(20px)';
                carta.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    carta.style.opacity = '1';
                    carta.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        });
    }, 300);
});

// ===== CARTAS SORPRESA =====
function revelarMensaje(num) {
    const cartaContainer = document.querySelector(`.carta-container:nth-child(${num})`);
    const carta = cartaContainer.querySelector('.carta');
    
    // Toggle clase revelada
    cartaContainer.classList.toggle('revelada');
    
    // Agregar efecto de confeti
    if (cartaContainer.classList.contains('revelada')) {
        crearConfeti(cartaContainer);
    }
}

// Función para crear efecto de confeti
function crearConfeti(elemento) {
    const colores = ['#ff1744', '#f50057', '#ff4081', '#ffc0cb'];
    const rect = elemento.getBoundingClientRect();
    
    for (let i = 0; i < 15; i++) {
        const confeti = document.createElement('div');
        confeti.style.position = 'fixed';
        confeti.style.left = rect.left + rect.width / 2 + 'px';
        confeti.style.top = rect.top + rect.height / 2 + 'px';
        confeti.style.width = '10px';
        confeti.style.height = '10px';
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.borderRadius = '50%';
        confeti.style.pointerEvents = 'none';
        confeti.style.zIndex = '9999';
        
        document.body.appendChild(confeti);
        
        const angulo = (Math.PI * 2 * i) / 15;
        const velocidad = 100 + Math.random() * 100;
        const vx = Math.cos(angulo) * velocidad;
        const vy = Math.sin(angulo) * velocidad;
        
        let posX = rect.left + rect.width / 2;
        let posY = rect.top + rect.height / 2;
        let opacity = 1;
        
        const animar = () => {
            posX += vx * 0.016;
            posY += vy * 0.016 + 2; // gravedad
            opacity -= 0.02;
            
            confeti.style.left = posX + 'px';
            confeti.style.top = posY + 'px';
            confeti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animar);
            } else {
                confeti.remove();
            }
        };
        
        requestAnimationFrame(animar);
    }
}

// ===== BOTÓN AL MINI-JUEGO =====
document.getElementById("btnJuego").addEventListener('click', () => {
    cambiarPantalla('sorpresas', 'juego');
});

// ===== MINI-JUEGO =====
let clicsCorazon = 0;

document.getElementById("btnCorazon").addEventListener('click', function() {
    clicsCorazon++;
    
    // Efecto de pulso en el corazón
    const corazon = this.querySelector('.corazon-interactivo');
    corazon.style.animation = 'none';
    setTimeout(() => {
        corazon.style.animation = '';
    }, 10);
    
    // Crear corazones flotantes
    crearCorazonesFlotantes(this);
    
    // Después de 3 clics, mostrar mensaje
    if (clicsCorazon >= 3) {
        this.style.pointerEvents = 'none';
        this.style.opacity = '0.5';
        
        setTimeout(() => {
            const mensajeJuego = document.getElementById("mensajeJuego");
            mensajeJuego.classList.add('mostrar');
            
            // Mostrar botón después del mensaje
            setTimeout(() => {
                document.getElementById("btnFinal").classList.remove('oculto');
            }, 3000);
        }, 500);
    }
});

// Función para crear corazones flotantes
function crearCorazonesFlotantes(elemento) {
    const rect = elemento.getBoundingClientRect();
    const emojis = ['💗', '💖', '💕', '💘'];
    
    for (let i = 0; i < 5; i++) {
        const corazon = document.createElement('div');
        corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        corazon.style.position = 'fixed';
        corazon.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100 + 'px';
        corazon.style.top = rect.top + rect.height / 2 + 'px';
        corazon.style.fontSize = '30px';
        corazon.style.pointerEvents = 'none';
        corazon.style.zIndex = '9999';
        corazon.style.opacity = '1';
        
        document.body.appendChild(corazon);
        
        let posY = rect.top + rect.height / 2;
        let opacity = 1;
        
        const animar = () => {
            posY -= 2;
            opacity -= 0.02;
            
            corazon.style.top = posY + 'px';
            corazon.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animar);
            } else {
                corazon.remove();
            }
        };
        
        requestAnimationFrame(animar);
    }
}

document.getElementById("btnFinal").addEventListener('click', () => {
    cambiarPantalla('juego', 'tarjeta');
});

// ===== TARJETA ANIMADA =====
const tarjetaInner = document.querySelector('.tarjeta-inner');
let tarjetaVolteada = false;

tarjetaInner.addEventListener('click', function() {
    tarjetaVolteada = !tarjetaVolteada;
    
    if (tarjetaVolteada) {
        this.classList.add('volteada');
        
        // Efecto de brillo
        crearBrillo(this);
    } else {
        this.classList.remove('volteada');
    }
});

// Función para crear efecto de brillo
function crearBrillo(elemento) {
    const rect = elemento.getBoundingClientRect();
    
    for (let i = 0; i < 20; i++) {
        const brillo = document.createElement('div');
        brillo.style.position = 'fixed';
        brillo.style.left = rect.left + Math.random() * rect.width + 'px';
        brillo.style.top = rect.top + Math.random() * rect.height + 'px';
        brillo.style.width = '4px';
        brillo.style.height = '4px';
        brillo.style.backgroundColor = '#fff';
        brillo.style.borderRadius = '50%';
        brillo.style.pointerEvents = 'none';
        brillo.style.zIndex = '9999';
        brillo.style.boxShadow = '0 0 10px #fff';
        
        document.body.appendChild(brillo);
        
        let opacity = 1;
        let scale = 1;
        
        const animar = () => {
            opacity -= 0.03;
            scale += 0.1;
            
            brillo.style.opacity = opacity;
            brillo.style.transform = `scale(${scale})`;
            
            if (opacity > 0) {
                requestAnimationFrame(animar);
            } else {
                brillo.remove();
            }
        };
        
        requestAnimationFrame(animar);
    }
}

document.getElementById("btnDedicatoria").addEventListener('click', () => {
    cambiarPantalla('tarjeta', 'final');
    
    // Activar fuegos artificiales
    setTimeout(() => {
        activarFuegosArtificiales();
    }, 500);
});

// ===== FUEGOS ARTIFICIALES =====
function activarFuegosArtificiales() {
    const fuegos = document.querySelectorAll('.fuego');
    fuegos.forEach(fuego => {
        fuego.style.animation = 'none';
        setTimeout(() => {
            fuego.style.animation = '';
        }, 10);
    });
}

// ===== EFECTOS DE HOVER EN BOTONES =====
const botones = document.querySelectorAll('.btn');
botones.forEach(boton => {
    boton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    boton.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== DETECCIÓN DE DISPOSITIVO MÓVIL =====
function esMobil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Ajustes para móviles
if (esMobil()) {
    // Reducir partículas en móvil para mejor rendimiento
    const particulas = document.querySelectorAll('.particula');
    particulas.forEach((particula, index) => {
        if (index > 5) {
            particula.style.display = 'none';
        }
    });
}

// ===== PREVENIR ZOOM EN DOBLE TAP (iOS) =====
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== PARALLAX SUAVE EN SCROLL =====
if (!esMobil()) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const particulas = document.querySelectorAll('.particula');
        
        particulas.forEach((particula, index) => {
            const velocidad = (index % 3 + 1) * 0.5;
            particula.style.transform = `translateY(${scrolled * velocidad}px)`;
        });
    });
}

// ===== ANIMACIÓN AL CARGAR =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== GUARDADO DE PROGRESO (OPCIONAL) =====
function guardarProgreso(pantalla) {
    localStorage.setItem('sanValentinProgreso', pantalla);
}

function cargarProgreso() {
    const progreso = localStorage.getItem('sanValentinProgreso');
    if (progreso && progreso !== 'inicio') {
        // Puedes descomentar esto si quieres que continúe donde lo dejó
        // cambiarPantalla('inicio', progreso);
    }
}

// cargarProgreso(); // Descomentar si quieres usar esta función

// ===== ANIMACIÓN DE ENTRADA PARA ELEMENTOS =====
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observar elementos que deben animarse al entrar en vista
document.querySelectorAll('.mensaje-linea, .carta-container').forEach(el => {
    observador.observe(el);
});

// ===== MENSAJE DE CONSOLA (Easter Egg) =====
console.log('%c💗 Hecho con amor para ti 💗', 'color: #ff1744; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(255,23,68,0.3);');
console.log('%c¡Feliz San Valentín! 🌹', 'color: #f50057; font-size: 16px;');