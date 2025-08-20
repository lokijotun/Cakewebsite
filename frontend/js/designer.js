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
    const MIN_SPRINKLE_SPEED = 3; 
    const MAX_SPRINKLE_SPEED = 7; 
    const MIN_SPRINKLE_LENGTH = 15;
    const MAX_SPRINKLE_LENGTH = 25;
    const CONSTANT_SPRINKLES = true;

    if (CONSTANT_SPRINKLES) {
        setInterval(createSprinkle, 200);
    } else {
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


    // --- Cake Designer Form Logic ---
    const cakeForm = document.getElementById('cake-form');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    

    // Image Preview Handler
    if (imageUpload) {
        imageUpload.addEventListener('change', () => {
            imagePreviewContainer.innerHTML = ''; 
            const files = imageUpload.files;
            for (const file of files) {
                if (!file.type.startsWith('image/')){ continue }
                const img = document.createElement('img');
                img.classList.add('img-preview');
                const reader = new FileReader();
                reader.onload = (e) => { img.src = e.target.result; }
                reader.readAsDataURL(file);
                imagePreviewContainer.appendChild(img);
            }
        });
    }

    // Form Submission Handler
    if (cakeForm) {
        cakeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const submitButton = cakeForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            const formData = new FormData(cakeForm);
            console.log("Form data to be sent:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            setTimeout(() => {
                submitButton.textContent = 'Order Sent! Thank You!';
            }, 1500);
        });
    }
});
