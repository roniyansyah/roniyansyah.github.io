function toggleMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Toggle class untuk animasi hamburger menjadi silang (X)
    menuToggle.classList.toggle('active');
    
    // Logika buka tutup overlay menu
    if (mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        
        // Beri sedikit delay agar transisi pudar animasi (CSS) selesai dulu
        setTimeout(() => {
            if(!mobileMenu.classList.contains('show')) {
                mobileMenu.style.display = 'none';
            }
        }, 300);
        
        // Mengembalikan kemampuan gulir/scroll halaman utama
        document.body.style.overflow = 'auto';
    } else {
        mobileMenu.style.display = 'flex';
        
        // Menggunakan setTimeout sekian milidetik agar transisi opacity terbaca oleh browser
        setTimeout(() => {
            mobileMenu.classList.add('show');
        }, 10);
        
        // Mengunci scroll layar belakang agar user fokus pada menu
        document.body.style.overflow = 'hidden';
    }
}