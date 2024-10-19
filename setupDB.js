const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database/db.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});


// Crear la tabla productos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    descripcion TEXT,
    departamento TEXT,
    precio REAL,
    imagen TEXT  -- Aquí almacenaremos la ruta o nombre de archivo de la imagen
  )`, (err) => {
    if (err) {
      console.error("Error creando la tabla productos:", err.message);
    } else {
      console.log("Tabla 'productos' creada exitosamente.");
    }
  });
});

// Cerrar la conexión a la base de datos
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Conexión cerrada.');
  }
});