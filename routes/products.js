const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/db.sqlite');

// Ruta para obtener productos con paginación
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || 70000;  // Número de productos por carga
    const offset = parseInt(req.query.offset) || 0; // Posición inicial

    const sql = 'SELECT * FROM productos LIMIT ? OFFSET ?';
    
    db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = router;
