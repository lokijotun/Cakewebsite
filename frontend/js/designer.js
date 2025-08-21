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


// --- Form Submission Handler ---
if (cakeForm) {
    cakeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = cakeForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // --- 1. Collect form data (same as before) ---
        const flavors = Array.from(cakeForm.querySelectorAll('input[name="flavor"]:checked')).map(el => el.dataset.flavor);
        const frosting = Array.from(cakeForm.querySelectorAll('input[name="frosting"]:checked')).map(el => el.dataset.flavor);
        const customerEmail = document.getElementById('customerEmail').value;
        const customerContact = document.getElementById('customerContact').value;
        const description = document.getElementById('description').value;

        // --- 2. Convert images (same as before) ---
        const imageFiles = imageUpload.files;
        const imagePromises = Array.from(imageFiles).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    resolve({ name: file.name, mimeType: file.type, data: base64String });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        const images = await Promise.all(imagePromises);

        // --- 3. Bundle data (same as before) ---
        const formData = { flavors, frosting, customerEmail, customerContact, description, images };

        // --- 4. Send the data to your Google Apps Script ---
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjPvUpSgcQ_C8lIuwOmJ0j0hULholwyfQufsg-YGXfFjvlLMzUNwehZFBqzyHHOSkT/exec"; // Make sure this is your latest URL!

        // --- 5. Fire-and-forget the request ---
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // This sends the data without waiting for a response
            body: JSON.stringify(formData),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        });

        // --- 6. Immediately show success message ---
        const formDisclaimer = document.getElementById('form-disclaimer');
        setTimeout(() => {
            submitButton.textContent = 'Order Sent! Thank You!';
            formDisclaimer.textContent = "If you don't receive a confirmation email, please check your junk or spam folder. Otherwise, please contact us at the number below.";
        }, 1500); // 1.5 second delay to feel like it's "sending"
    });
}})