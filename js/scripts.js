let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos

showSlide(currentSlide);

document.querySelector('.logo img').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Detecta el scroll para ajustar el padding dinámicamente
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        document.body.classList.add('scroll-down');
    } else {
        document.body.classList.remove('scroll-down');
    }
});