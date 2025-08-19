document.addEventListener('DOMContentLoaded', () => {
    console.log("Website loaded and ready!");

    // --- Shrinking Header on Scroll ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Floating Sprinkles ---
    const sprinkleColors = ['#ff85a2', '#78e0c2']; 
    
    // --- Control sprinkle properties here! ---
    const MIN_SPRINKLE_SPEED = 3; 
    const MAX_SPRINKLE_SPEED = 7; 
    const MIN_SPRINKLE_LENGTH = 15;
    const MAX_SPRINKLE_LENGTH = 25;
    
    // --- Sprinkle Mode Toggle ---
    // Set to 'true' for sprinkles to fall constantly.
    // Set to 'false' for sprinkles to only fall when you scroll.
    const CONSTANT_SPRINKLES = true;

    if (CONSTANT_SPRINKLES) {
        // If constant mode is on, create a new sprinkle every 200ms
        setInterval(createSprinkle, 200);
    } else {
        // Otherwise, only create sprinkles when the user scrolls
        let canCreateSprinkle = true; 
        window.addEventListener('scroll', () => {
            if (canCreateSprinkle) {
                createSprinkle();
                canCreateSprinkle = false;
                setTimeout(() => {
                    canCreateSprinkle = true;
                }, 150); 
            }
        });
    }

    function createSprinkle() {
        const sprinkle = document.createElement('div');
        sprinkle.classList.add('sprinkle');

        // --- Randomize each sprinkle's properties ---
        sprinkle.style.left = `${Math.random() * 100}vw`;
        sprinkle.style.backgroundColor = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
        
        const length = Math.random() * (MAX_SPRINKLE_LENGTH - MIN_SPRINKLE_LENGTH) + MIN_SPRINKLE_LENGTH;
        sprinkle.style.height = `${length}px`;

        const duration = Math.random() * (MAX_SPRINKLE_SPEED - MIN_SPRINKLE_SPEED) + MIN_SPRINKLE_SPEED;
        sprinkle.style.animationDuration = `${duration}s`;

        if (Math.random() > 0.5) {
            sprinkle.style.animationName = 'driftDown';
        } else {
            sprinkle.style.animationName = 'driftDownReverse';
        }

        document.body.appendChild(sprinkle);

        setTimeout(() => {
            sprinkle.remove();
        }, MAX_SPRINKLE_SPEED * 1000);
    }
});
