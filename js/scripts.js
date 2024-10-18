let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    // Cada imagen ocupa el 100%, así que multiplicamos por 100 en lugar de 50
    document.querySelector('.slides').style.transform = `translateX(${index * -100}%)`;
}

function nextSlide() {
    // Cambia de slide, ciclando entre todos
    currentSlide = (currentSlide + 1) % slides.length; // Cambiado a slides.length
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Cambia de imagen cada 5 segundos
setInterval(nextSlide, 5000);
showSlide(currentSlide);

// Añadir event listener para hacer scroll al inicio al hacer clic en el logo
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
