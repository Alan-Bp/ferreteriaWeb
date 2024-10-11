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

    const insertQuery = `INSERT INTO productos (ItemCode, ItemName, Price) VALUES (?, ?, ?)`;
    const selectQuery = `SELECT ItemCode FROM productos WHERE ItemCode = ?`;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        productos.forEach((line) => {
            const [ItemCode, ItemName, Price] = line.split('-'); // Ajustar según el separador de tu archivo
            
            // Verificar si el ItemCode ya existe
            db.get(selectQuery, [ItemCode], (err, row) => {
                if (err) {
                    console.error("Error verificando el producto:", err.message);
                    return;
                }

                if (!row) { // Si el producto no existe, lo insertamos
                    db.run(insertQuery, [ItemCode, ItemName, Price], (err) => {
                        if (err) {
                            console.error("Error insertando producto:", err.message);
                        } else {
                            console.log(`Producto ${ItemName} insertado.`);
                        }
                    });
                } else {
                    console.log(`Producto con ItemCode ${ItemCode} ya existe, no se inserta.`);
                }
            });
        });

        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error finalizando la transacción:", err.message);
            } else {
                console.log("Transacción completada.");
            }
        });
    });

    // Cerrar la base de datos después de todas las inserciones
    db.close();
});
