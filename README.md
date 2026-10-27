# Cine API

API REST para gestionar el catálogo de películas de una aplicación de cine. Está
construida con Node.js, Express y SQLite.

## Requisitos

- Node.js instalado
- npm

## Instalación

Desde la carpeta del proyecto:

```powershell
npm install
```

La aplicación crea automáticamente el archivo `cine.db`, las tablas necesarias y
datos de prueba en el primer arranque. Este archivo está excluido del control de
versiones.

## Ejecutar la API

```powershell
node .\server.js
```

La API estará disponible en:

```text
http://localhost:3000
```

## Endpoints

### Obtener todas las películas visibles

```http
GET /api/peliculas
```

Ejemplo:

```powershell
Invoke-WebRequest http://localhost:3000/api/peliculas
```

### Obtener una película por ID

```http
GET /api/peliculas/:id
```

Ejemplo:

```powershell
Invoke-WebRequest http://localhost:3000/api/peliculas/1
```

Devuelve `404` si la película no existe.

### Ocultar una película después de una compra

```http
PUT /api/peliculas/:id/ocultar
```

Ejemplo:

```powershell
Invoke-WebRequest -Method PUT http://localhost:3000/api/peliculas/1/ocultar
```

La película permanece en la base de datos, pero deja de aparecer en el listado
de películas visibles.

## Estructura

```text
.
├── package.json   # Dependencias y metadatos del proyecto
├── server.js      # Servidor Express, rutas y conexión SQLite
├── cine.db        # Base de datos local generada automáticamente
└── README.md      # Documentación del proyecto
```

## Dependencias principales

- `express`: servidor HTTP y definición de rutas.
- `cors`: habilita solicitudes desde aplicaciones frontend.
- `sqlite3`: conexión con la base de datos SQLite.

