let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    // Cada imagen ocupa el 50%, así que multiplicamos por 50 en lugar de 100
    document.querySelector('.slides').style.transform = `translateX(${index * -50}%)`;
}

function nextSlide() {
    // Asegúrate de que solo haya dos slides para un ciclo continuo
    currentSlide = (currentSlide + 1) % (slides.length - 1); // Ajusta el ciclo
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
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
