let currentCount = 0; // Contador de productos cargados
const loadCount = 20; // Número de productos a cargar por vez

// Función para cargar productos
function loadProducts() {
    fetch('http://localhost:3000/api/products') // Cambia esta URL por la de tu API
        .then(response => response.json())
        .then(data => {
            const productosContainer = document.getElementById('productos');
            if (data && data.data && Array.isArray(data.data)) {
                const productsToLoad = data.data.slice(currentCount, currentCount + loadCount);
                const fragment = document.createDocumentFragment();

                productsToLoad.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';

                    // Crear el elemento de imagen con verificación
                    const img = document.createElement('img');
                    img.className = 'product-img';

                    // Obtener la URL de la imagen desde Firebase Storage
                    const imgRef = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/imagenes%2F${product.nombre.toLowerCase().replace(/\s+/g, '_')}.png?alt=media`;

                    img.src = imgRef; // Asignar la URL de Firebase

                    // Si la imagen no se carga, usa la predeterminada (logo de Ferrem)
                    img.onerror = () => {
                        img.src = './assets/logo.png'; // Imagen predeterminada
                    };

                    // Agregar el resto del contenido del producto
                    productCard.innerHTML += `
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion || 'Descripción no disponible.'}</p>
                        <span>Precio: $${product.precio.toFixed(2)}</span>
                    `;

                    // Insertar la imagen antes del texto en la tarjeta
                    productCard.insertBefore(img, productCard.firstChild);

                    fragment.appendChild(productCard);
                });

                productosContainer.appendChild(fragment);
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

// Configuración del evento al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Cargar productos al inicio
    showSlide(slideIndex); // Mostrar el primer slide al cargar la página
});

// Event listener para el botón "Mostrar más productos"
const loadMoreButton = document.getElementById('load-more');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadProducts);
}

// Funciones para el carrusel
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length; // Usar slideIndex
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length; // Usar slideIndex
    showSlide(slideIndex);
}

// Cambia de imagen cada 5 segundos
setInterval(nextSlide, 5000);
showSlide(slideIndex);

// Añadir event listener para hacer scroll al inicio al hacer clic en el logo
document.querySelector('.logo img').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Inicializar Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCe9ZTmURGvpXTSiojgFPW5fXm2UcAocRs",
  authDomain: "ferrem-web.firebaseapp.com",
  projectId: "ferrem-web",
  storageBucket: "ferrem-web.appspot.com",
  messagingSenderId: "404367969906",
  appId: "1:404367969906:web:86eb3e2fb6ebd4da2dbceb",
  measurementId: "G-2T48Z2VLZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
