// --- CONFIGURATION ---
const startDate = new Date("2024-01-01 00:00:00"); // GANTI TANGGAL JADIAN DISINI
const messageText = "Terima kasih sudah menjadi bagian dari hidupku. Setiap detik bersamamu adalah anugerah, namun aku tahu perjalanan kita masih panjang dan proses ini belum usai. Ini adalah perjalanan yang indah yang menuntut kita untuk tetap kuat, saling bersabar, dan pantang menyerah. Mari terus melangkah bersama, saling menguatkan menuju segala hal baik yang kita harapkan. Selamat ulang tahun! 🎉❤️";

// --- OPEN GIFT LOGIC ---
function openGift() {
    const giftImg = document.querySelector(".gift-gif");
    const music = document.getElementById("music");
    
    giftImg.classList.add("exploded");
    
    setTimeout(() => {
        document.getElementById("opening").style.display = "none";
        document.getElementById("mainContent").classList.remove("hidden");
        
        // Play Music
        music.play().catch(() => console.log("Autoplay blocked by browser"));
        
        startConfetti();
        startTypewriter();
        setInterval(updateTimer, 1000); // Start timer
        updateTimer();
    }, 800);
}

// --- DYNAMIC TIMER ---
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d.toString().padStart(2, '0');
    document.getElementById("hours").innerText = h.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
}

// --- TYPEWRITER ---
let charIndex = 0;
function startTypewriter() {
    if (charIndex < messageText.length) {
        document.getElementById("message").innerHTML += messageText.charAt(charIndex);
        charIndex++;
        setTimeout(startTypewriter, 50);
    }
}

// --- SLIDESHOW (6 PHOTOS) ---
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function nextSlide() {
    if (slides.length > 0) {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }
}
setInterval(nextSlide, 3000);

// --- FLOATING HEARTS ---
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 10 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
    
    document.getElementById("hearts").appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 500);

// --- CONFETTI EFFECT ---
function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
}