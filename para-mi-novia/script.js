document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Splash Screen ---
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            // Quitarlo del DOM poco después para que no estorbe
            setTimeout(() => splashScreen.style.display = 'none', 800);
        }, 3000); // 3 Segundos de carga
    }

    const loveBtn = document.getElementById('loveBtn');
    const reasonsSection = document.getElementById('reasonsSection');
    const heartsContainer = document.getElementById('hearts-container');
    const cards = document.querySelectorAll('.reason-card');
    const messageContainer = document.querySelector('.message-container');

    // --- Lógica del Contador de Tiempo ---
    // Fecha de inicio: Septiembre 2024 (Se asume 1 de septiembre de 2024, ajusta el día si es necesario: Año, Mes(0-11), Día)
    const startDate = new Date(2024, 8, 1); // Llevan 1 año y 5 meses, por lo que empezó en Septiembre de 2024.

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        // Cálculos matemáticos de tiempo
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Actualizar el HTML
        document.getElementById('years').innerText = years;
        document.getElementById('months').innerText = months;
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
        document.getElementById('minutes').innerText = minutes;
        document.getElementById('seconds').innerText = seconds;
    }

    // Inicializar y actualizar cada segundo
    updateTimer();
    setInterval(updateTimer, 1000);

    // Create a few ambient hearts in the background frequently
    setInterval(() => {
        if (Math.random() > 0.2) { // 80% chance to spawn every interval
            createAmbientHeart();
            // Spawn a second one 30% of the time for extra density
            if (Math.random() > 0.7) createAmbientHeart();
        }
    }, 400); // Check every 400ms instead of 1500ms

    loveBtn.addEventListener('click', () => {
        // Change button state
        const btnText = loveBtn.querySelector('span:first-child');
        const btnIcon = loveBtn.querySelector('.icon');

        btnText.textContent = '¡Te amo con locura!';
        btnIcon.textContent = '✨';
        loveBtn.style.transform = 'scale(1.05)';
        loveBtn.style.boxShadow = '0 0 50px rgba(255, 107, 135, 0.5)';

        // Show the reasons section with a small delay for dramatic effect
        setTimeout(() => {
            reasonsSection.classList.remove('hidden');
            reasonsSection.style.display = 'block';

            // Trigger reflow
            void reasonsSection.offsetWidth;

            reasonsSection.style.opacity = '1';

            // Scroll down smoothly
            setTimeout(() => {
                reasonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            // Animate cards sequentially
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 400 + (index * 200));
            });

            // Animate final message
            setTimeout(() => {
                messageContainer.classList.add('visible');
            }, 400 + (cards.length * 200) + 300);

        }, 400);

        // Heart explosion effect
        heartExplosion();
    });

    function heartExplosion() {
        const explosionCount = 60;
        const btnRect = loveBtn.getBoundingClientRect();

        for (let i = 0; i < explosionCount; i++) {
            // Stagger the creation for a burst effect
            setTimeout(() => {
                const x = btnRect.left + (btnRect.width / 2);
                const y = btnRect.top + (btnRect.height / 2);
                createParticleHeart(x, y);
            }, Math.random() * 400);
        }
    }

    function createParticleHeart(startX, startY) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        const emojis = ['❤️', '💖', '✨', '💕', '🥰', '🫶🏼'];
        heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

        heartsContainer.appendChild(heart);

        // Randomize
        const size = Math.random() * 1.5 + 0.8;
        const duration = Math.random() * 2000 + 1500;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 250 + 50;

        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - (Math.random() * 200 + 100); // bias upward
        const rot = Math.random() * 360 - 180;

        // Use Web Animations API
        const animation = heart.animate([
            { transform: `translate(${startX}px, ${startY}px) scale(0) rotate(0deg)`, opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { opacity: 0.8, offset: 0.7 },
            { transform: `translate(${startX + tx}px, ${startY + ty}px) scale(${size}) rotate(${rot}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'forwards'
        });

        animation.onfinish = () => heart.remove();
    }

    function createAmbientHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        const emojis = ['❤️', '💖', '✨', '💕', '🫶🏼', '🌸', '😘'];
        heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

        heartsContainer.appendChild(heart);

        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;

        const size = Math.random() * 1 + 0.5;
        const duration = Math.random() * 5000 + 5000;
        const tx = startX + (Math.random() * 200 - 100);
        const ty = -100;
        const rot = Math.random() * 360;

        const animation = heart.animate([
            { transform: `translate(${startX}px, ${startY}px) scale(0)`, opacity: 0 },
            { opacity: 0.6, offset: 0.2 },
            { opacity: 0.6, offset: 0.8 },
            { transform: `translate(${tx}px, ${ty}px) scale(${size}) rotate(${rot}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear',
            fill: 'forwards'
        });

        animation.onfinish = () => heart.remove();
    }

    // --- Lógica del Modal del Video ---
    const videoBtn = document.getElementById('openVideoBtn');
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeVideo');
    const video = document.getElementById('specialVideo');
    const heartOverlay = document.getElementById('heartOverlay');

    if (videoBtn && modal && closeBtn && video && heartOverlay) {
        // Abrir modal y reproducir
        videoBtn.addEventListener('click', () => {
            // 1. Mostrar el overlay del corazón gigante
            heartOverlay.classList.remove('hidden');

            // 2. Esperar 2 segundos para la animación del corazón, luego ocultarlo y mostrar video
            setTimeout(() => {
                heartOverlay.classList.add('hidden');
                modal.classList.remove('hidden');
                video.play();
            }, 2000); // 2000 ms = 2 segundos
        });

        const hideModal = () => {
            modal.classList.add('hidden');
            video.pause();
            // Opcional: regresar el video al inicio
            // video.currentTime = 0; 
        };

        // Cerrar con el botón X
        closeBtn.addEventListener('click', hideModal);

        // Cerrar al hacer clic fuera del contenido del video
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    // --- Lógica de la Galería Polaroid (Drag to Scroll) ---
    const polaroidTrack = document.querySelector('.polaroid-gallery');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (polaroidTrack) {
        polaroidTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            polaroidTrack.style.cursor = 'grabbing';
            startX = e.pageX - polaroidTrack.offsetLeft;
            scrollLeft = polaroidTrack.scrollLeft;
        });

        polaroidTrack.addEventListener('mouseleave', () => {
            isDown = false;
            polaroidTrack.style.cursor = 'auto';
        });

        polaroidTrack.addEventListener('mouseup', () => {
            isDown = false;
            polaroidTrack.style.cursor = 'auto';
        });

        polaroidTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - polaroidTrack.offsetLeft;
            const walk = (x - startX) * 2; // Velocidad de scroll
            polaroidTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // --- Lógica del Canvas "Raspadito" ---
    const canvas = document.getElementById('scratchCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        // Rellenar el canvas con un color de "cubierta"
        ctx.fillStyle = '#c9184a'; // Mismo primary color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Añadir algo de texto indicativo encima del "raspadito"
        ctx.font = '20px Montserrat';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('¡Ráspame!', canvas.width / 2, canvas.height / 2);

        // Propiedades del "borrador"
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        function getMousePos(canvas, evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (evt.clientX || evt.touches[0].clientX) - rect.left,
                y: (evt.clientY || evt.touches[0].clientY) - rect.top
            };
        }

        function startPosition(e) {
            isDrawing = true;
            draw(e);
        }

        function endPosition() {
            isDrawing = false;
            ctx.beginPath();
        }

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault(); // Evitar scroll al raspar en móviles

            const pos = getMousePos(canvas, e);

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        // Eventos para Mouse
        canvas.addEventListener('mousedown', startPosition);
        canvas.addEventListener('mouseup', endPosition);
        canvas.addEventListener('mousemove', draw);
        // Eventos para Touch (Móviles)
        canvas.addEventListener('touchstart', startPosition, { passive: false });
        canvas.addEventListener('touchend', endPosition);
        canvas.addEventListener('touchmove', draw, { passive: false });
    }
});
