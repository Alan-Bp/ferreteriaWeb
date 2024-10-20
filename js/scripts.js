// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"; // Importar la app
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"; // Importar la base de datos
let currentCount = 0; // Contador de productos cargados
const loadCount = 20; // Número de productos a cargar por vez
let allProducts = []; // Para almacenar todos los productos cargados
let filteredProducts = []; // Para almacenar los productos filtrados
const departmentLinks = document.querySelectorAll('.dropdown-content a');


const firebaseConfig = {
    apiKey: "AIzaSyBmTijJCeuv1tKKJcrwWGoC6VR3vMXIRKY",
    authDomain: "cloud-ferremweb.firebaseapp.com",
    projectId: "cloud-ferremweb",
    storageBucket: "cloud-ferremweb.appspot.com",
    messagingSenderId: "198765237780",
    appId: "1:198765237780:web:5a3db5b9417165726cf901",
    measurementId: "G-3DEL1LR592"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicializar la base de datos

// Puedes usar 'ref' para obtener la referencia a una ruta en tu base de datos
const productosRef = ref(database, '/');

// Obtener datos de la base de datos
get(productosRef).then((snapshot) => {
    if (snapshot.exists()) {
        const productos = snapshot.val();
        allProducts = Object.values(productos); // Almacenar todos los productos
        console.log(productos); // Aquí puedes procesar los datos de los productos
        loadProducts(); // Cargar productos al inicio
    } else {
        console.log("No hay datos disponibles");
    }
}).catch((error) => {
    console.error("Error al obtener los datos: ", error);
});

// Función para obtener la URL de la imagen
function getImageUrl(product) {
    // Obtener el nombre del archivo sin la parte inicial
    const imageName = product.imagen.replace('/imagenes/', '') + '.png'; // Añadir la extensión .png
    return `./imagenes/${imageName}`; // Retornar la ruta completa
}

// Función para crear una tarjeta de producto
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    // Crear el elemento de imagen
    const img = document.createElement('img');
    img.className = 'product-img';

    img.src = getImageUrl(product); // Asignar la URL de Firebase
    // Manejar errores de carga de imagen
    img.onerror = () => {
        img.src = './assets/logo.png'; // Imagen predeterminada
    };

    // Convertir precio a número y manejar errores
    const precio = parseFloat(product.precio);
    const precioFormateado = isNaN(precio) ? 'N/A' : `$${precio.toFixed(2)}`;

    // Agregar el resto del contenido del producto
    productCard.innerHTML += `
        <h3>${product.nombre}</h3>
        <p>${product.descripcion || 'Descripción no disponible.'}</p>
        <span>Precio: ${precioFormateado}</span>
    `;

    // Insertar la imagen antes del texto en la tarjeta
    productCard.insertBefore(img, productCard.firstChild);
    return productCard;
}

// Función para mostrar productos en la interfaz
function displayProducts(products) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; // Limpiar contenido anterior
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
        fragment.appendChild(createProductCard(product));
    });

    productosContainer.appendChild(fragment);
}

// Nueva función para filtrar productos
function filterProducts(query) {
    return allProducts.filter(product => {
        return product.nombre.toLowerCase().includes(query.toLowerCase()) ||
            product.descripcion.toLowerCase().includes(query.toLowerCase());
    });
}

// Función para mostrar sugerencias
function showSuggestions(query) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores

    const filteredProducts = filterProducts(query); // Obtener los productos filtrados
    filteredProducts.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = product.nombre;

        // Manejar clic en la sugerencia
        suggestionItem.addEventListener('click', () => {
            displayProducts([product]); // Mostrar el producto seleccionado
            document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); // Hacer scroll a la sección de catálogo
            suggestionsContainer.innerHTML = ''; // Limpiar sugerencias después de seleccionar
        });

        suggestionsContainer.appendChild(suggestionItem); // Agregar sugerencia al contenedor
    });
}

// Configuración del evento al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Cargar productos al inicio
    showSlide(slideIndex); // Mostrar el primer slide al cargar la página
});


// Función para cargar productos desde Firebase
function loadProducts() {
    // Cambié 'dbRef.once' a 'get(dbRef)' para utilizar la nueva API
    get(productosRef) // Cambié dbRef a productosRef
        .then(snapshot => {
            if (snapshot.exists()) {
                allProducts = snapshot.val();
                const productosArray = Object.values(allProducts); // Convertir objeto en array

                const productosContainer = document.getElementById('productos');
                const productsToLoad = productosArray.slice(currentCount, currentCount + loadCount);
                const fragment = document.createDocumentFragment();

                productsToLoad.forEach(product => {
                    fragment.appendChild(createProductCard(product)); // Agregar tarjeta de producto al fragmento
                });

                productosContainer.appendChild(fragment);
                currentCount += loadCount;

                // Ocultar el botón "Cargar más" si no hay más productos
                if (currentCount >= productosArray.length) {
                    document.getElementById('load-more').style.display = 'none';
                }
            } else {
                console.log("No hay productos disponibles.");
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos desde Firebase:', error);
        });
}

// Event listener para la barra de búsqueda
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value; // Obtener el valor del input
        showSuggestions(query); // Mostrar sugerencias según la búsqueda
    });
}

// Event listener para el botón "Mostrar más productos"
const loadMoreButton = document.getElementById('load-more');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', loadProducts);
}
// Event listener para el botón de búsqueda
const searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value; // Obtener el valor del input
        const filteredProducts = filterProducts(query); // Filtrar productos según la búsqueda
        displayProducts(filteredProducts); // Mostrar productos filtrados
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); // Hacer scroll a la sección de catálogo
    });
}

// Event listener para el teclado (presionar Enter)
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value; // Obtener el valor del input
        const filteredProducts = filterProducts(query); // Filtrar productos según la búsqueda
        displayProducts(filteredProducts); // Mostrar productos filtrados
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); // Hacer scroll a la sección de catálogo
    }
});

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

// Función para limpiar el nombre del departamento
function cleanDepartmentName(departamento) {
    // Si el departamento contiene el símbolo '|', obtenemos solo la última palabra
    if (departamento.includes('|')) {
        const parts = departamento.split('|');
        return parts[parts.length - 1].trim(); // Retorna la última parte y la limpia de espacios
    }
    return departamento.trim(); // Si no tiene '|', solo lo limpiamos de espacios
}

// Función para filtrar productos por departamento
function filtrarProductosPorDepartamento(departamento) {
    // Limpiamos el departamento que viene del enlace de la interfaz
    const departamentoLimpio = cleanDepartmentName(departamento);

    // Consulta a Firebase para obtener productos
    get(productosRef).then(snapshot => {
        if (snapshot.exists()) {
            const allProducts = snapshot.val();
            const productosArray = Object.values(allProducts);

            // Filtrar productos que coincidan con el departamento seleccionado (insensible a mayúsculas y minúsculas)
            const productosFiltrados = productosArray.filter(product => {
                if (product.departamento) {
                    const deptoProductoLimpio = cleanDepartmentName(product.departamento);
                    return deptoProductoLimpio.toLowerCase() === departamentoLimpio.toLowerCase();
                }
                return false;
            });

            if (productosFiltrados.length > 0) {
                // Mostrar los productos filtrados
                displayProducts(productosFiltrados);
            } else {
                // Si no hay productos coincidentes, limpiar la pantalla o mostrar mensaje
                const productosContainer = document.getElementById('productos');
                productosContainer.innerHTML = `<p>No se encontraron productos para el departamento ${departamentoLimpio}.</p>`;
            }

            // Hacer scroll a la sección de catálogo
            document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
        } else {
            console.log("No hay productos disponibles.");
        }
    }).catch(error => {
        console.error('Error al filtrar productos por departamento:', error);
    });
}

// Modificar los event listeners para que usen el nombre limpio
departmentLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que se recargue la página
        const departamento = link.getAttribute('data-departamento').trim(); // Obtener el nombre del departamento
        filtrarProductosPorDepartamento(departamento); // Llamar a la función para filtrar productos
    });
});
