const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database/db.sqlite');

// Leer el archivo .txt
fs.readFile('./preciosferrem.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error leyendo el archivo:', err.message);
        return;
    }

    const productos = data.split('\n'); // Divide el archivo por líneas

    const insertQuery = `INSERT INTO productos (id, nombre, descripcion, departamento, precio, imagen) VALUES (?, ?, ?, ?, ?, ?)`;
    const selectQuery = `SELECT id FROM productos WHERE id = ?`;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        let insercionesPendientes = productos.length;

        productos.forEach((line, index) => {
            const parts = line.split('|');

            if (parts.length !== 6) { // Comprobar que todos los campos existan
                console.log(`Línea inválida en la línea ${index + 1}: ${line}`);
                procesarTransaccion();
                return;
            }

            const [id, nombre, descripcion, departamento, precio] = parts;
            const imagenNombre = nombre.trim().toLowerCase().replace(/\s+/g, '_'); // Convierte el nombre a minúsculas y reemplaza espacios por guiones bajos
            const rutaImagen = `./imagenes/${imagenNombre}.png`; // Cambié aquí para usar el nombre en vez del ID

            // Verificar si el producto ya existe
            db.get(selectQuery, [id.trim()], (err, row) => {
                if (err) {
                    console.error("Error verificando el producto:", err.message);
                    procesarTransaccion();
                    return;
                }

                if (!row) { // Si el producto no existe, lo insertamos
                    db.run(insertQuery, [id.trim(), nombre.trim(), descripcion.trim() || "Descripción no disponible", departamento.trim(), parseFloat(precio), rutaImagen], (err) => {
                        if (err) {
                            console.error(`Error insertando producto ${nombre}:`, err.message);
                        } else {
                            console.log(`Producto ${nombre} insertado.`);
                        }
                        procesarTransaccion();
                    });
                } else {
                    console.log(`Producto con id ${id} ya existe, no se inserta.`);
                    procesarTransaccion();
                }
            });
        });

        // Función para procesar la transacción y cerrar la base de datos cuando termine
        function procesarTransaccion() {
            insercionesPendientes--;
            if (insercionesPendientes === 0) {
                db.run("COMMIT", (err) => {
                    if (err) {
                        console.error("Error finalizando la transacción:", err.message);
                    } else {
                        console.log("Transacción completada.");
                    }
                    db.close((err) => {
                        if (err) {
                            console.error('Error al cerrar la base de datos:', err.message);
                        } else {
                            console.log('Conexión a la base de datos cerrada.');
                        }
                    });
                });
            }
        }
    });
});