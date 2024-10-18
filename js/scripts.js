// Variables para el carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// Función para mostrar un slide específico
function showSlide(index) {
    document.querySelector('.slides').style.transform = `translateX(${index * -100}%)`;
}

// Función para cambiar al siguiente slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Función para cambiar al slide anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Cambia de imagen cada 5 segundos
setInterval(nextSlide, 5000);
showSlide(currentSlide);

// Event listener para hacer scroll al inicio al hacer clic en el logo
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

// Variables para cargar productos
let currentCount = 0; // Contador de productos cargados
const loadCount = 20; // Número de productos a cargar por vez

// Función para cargar productos
function loadProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            const productosContainer = document.getElementById('productos');
            if (data && data.data && Array.isArray(data.data)) {
                const productsToLoad = data.data.slice(currentCount, currentCount + loadCount);
                productsToLoad.forEach(product => {
                    productosContainer.innerHTML += `
                        <div class="product-card">
                            <img src="./assets/${product.ItemCode}.png" alt="${product.ItemName}" class="product-img">
                            <h3>${product.ItemName}</h3>
                            <p>${product.Description || 'Descripción no disponible.'}</p>
                            <span>Precio: $${product.Price.toFixed(2)}</span>
                        </div>`;
                });
                currentCount += loadCount;

                // Ocultar el botón "Cargar más" si no hay más productos
                if (currentCount >= data.data.length) {
                    document.getElementById('load-more').style.display = 'none';
                }
            } else {
                console.error('Error cargando productos:', data);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud de productos:', error);
        });
}

// Event listener para el botón "Mostrar más productos"
document.getElementById('load-more').addEventListener('click', loadProducts);

// Cargar productos al inicio
window.addEventListener('DOMContentLoaded', loadProducts);
