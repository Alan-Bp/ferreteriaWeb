const express = require('express');
const cors = require('cors');  // Importa cors
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;  // Asegúrate de que el puerto sea el correcto

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Configurar base de datos SQLite
const db = new sqlite3.Database('./database/db.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Importar las rutas de productos
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Servir imágenes de la carpeta 'imagenes'
app.use('/imagenes', express.static('imagenes'));


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
