const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'cine.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite.');
        inicializarTablas();
    }
});

function inicializarTablas() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS peliculas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            sinopsis TEXT,
            duracion TEXT,
            valoracion REAL,
            imagen_url TEXT,
            categoria_id INTEGER,
            visible INTEGER DEFAULT 1,
            FOREIGN KEY(categoria_id) REFERENCES categorias(id)
        )`);

        db.get("SELECT COUNT(*) AS count FROM categorias", (err, row) => {
            if (row.count === 0) {
                const stmtCat = db.prepare("INSERT INTO categorias (nombre) VALUES (?)");
                stmtCat.run("Acción");
                stmtCat.run("Sci-Fi");
                stmtCat.run("Animación");
                stmtCat.run("Terror");
                stmtCat.finalize();

                const stmtPel = db.prepare(`INSERT INTO peliculas 
                    (titulo, sinopsis, duracion, valoracion, imagen_url, categoria_id) 
                    VALUES (?, ?, ?, ?, ?, ?)`);
                
                // Películas insertadas
                stmtPel.run("The Avengers (2012)", "Nick Fury reúne a un equipo de superhéroes...", "2H 23M", 4.8, "avengers_poster.jpg", 1);
                stmtPel.run("Avengers: Age of Ultron", "Los Vengadores deben detener a Ultron...", "2H 21M", 4.6, "vengadores_ultron.jpg", 2);
                stmtPel.run("Spider-Man: Across the Spider-Verse", "Miles Morales se embarca en una aventura épica a través del multiverso.", "2H 20M", 4.9, "spiderman_poster.jpg", 3);
                stmtPel.run("El Conjuro", "Investigadores paranormales ayudan a una familia aterrorizada por una presencia oscura.", "1H 52M", 4.5, "conjuro_poster.jpg", 4);
                stmtPel.run("John Wick 4", "John Wick descubre un camino para derrotar a la Alta Mesa.", "2H 49M", 4.7, "johnwick_poster.jpg", 1);
                
                stmtPel.finalize();
                console.log('Nuevos datos de prueba insertados exitosamente.');
            }
        });
    });
}

// 1. Obtener todas las películas (Para el Home)
app.get('/api/peliculas', (req, res) => {
    const query = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM peliculas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.visible = 1
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Obtener una película por ID (Para la vista de Detalle)
app.get('/api/peliculas/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM peliculas p 
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ?
    `;
    db.get(query, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Película no encontrada" });
        res.json(row);
    });
});

// 3. Simular compra de película (Ocultarla)
app.put('/api/peliculas/:id/ocultar', (req, res) => {
    const { id } = req.params;
    const query = "UPDATE peliculas SET visible = 0 WHERE id = ?";
    db.run(query, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Película ocultada tras la compra", changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log("Servidor backend corriendo en http://localhost:" + PORT);
});