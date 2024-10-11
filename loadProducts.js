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

    const insertQuery = `INSERT INTO productos (ItemCode, ItemName, Description, Price) VALUES (?, ?, ?, ?)`;
    const selectQuery = `SELECT ItemCode FROM productos WHERE ItemCode = ?`;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        let insercionesPendientes = productos.length;  // Para saber cuántas inserciones faltan

        productos.forEach((line, index) => {
            // Limpiamos espacios adicionales y luego dividimos
            const cleanedLine = line.trim().replace(/\s+/g, ' '); // Eliminar espacios extra
            const parts = cleanedLine.split('|'); // Ajustar el separador con \\

            if (parts.length !== 3) {
                console.log(`Línea inválida en la línea ${index + 1}: ${line}`);
                insercionesPendientes--; // Reducimos cuando encontramos una línea inválida
                return; // Saltar las líneas inválidas
            }

            const [ItemCode, ItemName, Price] = parts;

            // Verificar si el ItemCode ya existe
            db.get(selectQuery, [ItemCode.trim()], (err, row) => {
                if (err) {
                    console.error("Error verificando el producto:", err.message);
                    insercionesPendientes--;
                    return;
                }

                if (!row) { // Si el producto no existe, lo insertamos
                    db.run(insertQuery, [ItemCode.trim(), ItemName.trim(), "Descripción no disponible", parseFloat(Price)], (err) => {
                        if (err) {
                            console.error("Error insertando producto:", err.message);
                        } else {
                            console.log(`Producto ${ItemName} insertado.`);
                        }

                        insercionesPendientes--;
                        if (insercionesPendientes === 0) {
                            // Si todas las inserciones han terminado, cerramos la transacción y la base de datos
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
                    });
                } else {
                    console.log(`Producto con ItemCode ${ItemCode} ya existe, no se inserta.`);
                    insercionesPendientes--;
                    if (insercionesPendientes === 0) {
                        db.run("COMMIT", (err) => {
                            if (err) {
                                console.error("Error finalizando la transacción:", err.message);
                            }
                            db.close();
                        });
                    }
                }
            });
        });
    });
});
