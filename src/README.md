# 🏷️ Rastreador de Chollos — Monitor de Precios en Tiempo Real

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Scraper-Python%20%2F%20FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)

Plataforma web distribuida basada en arquitectura de microservicios orientada a la monitorización de productos e-commerce, extracción automatizada de precios mediante *web scraping* y seguimiento de histórico de variaciones.

---

## 0) Software Necesario

Para la ejecución y despliegue del proyecto en cualquier entorno (Windows, macOS, Linux o GitHub Codespaces), se requiere el siguiente software instalado:

* **Docker Desktop** (v20.10 o superior) / **Docker Engine**
* **Docker Compose** (v2.0 o superior)
* **Git** (para la clonación del repositorio)
* **Navegador Web Moderno** (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari)
* *(Opcional)* **Node.js** (v18+) y **Python** (v3.10+) únicamente si se desea desarrollo/depuración local sin contenedores.

---

## 1) Servicios a Arrancar

La aplicación se compone de dos microservicios aislados en contenedores independientes que se comunican dentro de una red privada de Docker:

1. **`backend-node` (API Gateway & Servidor Web):**
   * **Función:** Recibe las peticiones del cliente, sirve la interfaz estática (SPA) y actúa de proxy/gateway orquestando las peticiones de scraping.
   * **Puerto expuesto:** `3000`
2. **`backend-python` (Motor de Web Scraping):**
   * **Función:** Realiza la extracción automatizada de datos (título, precio, moneda) parseando el HTML de las webs objetivo.
   * **Puerto expuesto:** `5000` (Red interna Docker: `http://backend-python:5000`)

---

## 2) Dependencias del Proyecto

### Dependencias del API Gateway (`src/backend-node/package.json`)
* `express` (v4.18.2): Framework web para la creación de rutas HTTP y servidor estático.
* `axios` (v1.6.2): Cliente HTTP para la comunicación inter-servicio con el microservicio en Python.
* `cors` (v2.8.5): Gestión de políticas de acceso cruzado entre dominios.

### Dependencias del Scraper (`src/backend-python/requirements.txt`)
* `fastapi` (v0.104.1): Framework asíncrono de alto rendimiento para construir la API REST.
* `uvicorn` (v0.24.0): Servidor ASGI para la ejecución de FastAPI.
* `beautifulsoup4` (v4.12.2): Librería para el parseo y extracción de elementos del DOM HTML.
* `requests` (v2.31.0): Cliente de peticiones HTTP para descargar páginas web.
* `lxml` (v4.9.3): Parser ultra-rápido para procesamiento de HTML/XML.

---

## 3) Cómo Arrancar la Parte Servidora

El arranque del servidor y la orquestación de todos los microservicios se realiza mediante **Docker Compose**:

1. **Clonar el repositorio de GitHub:**
   ```bash
   git clone [https://github.com/alvaroogaarcia-git/rastreador-chollos.git](https://github.com/alvaroogaarcia-git/rastreador-chollos.git)
   cd rastreador-chollos
   ```

2. **Acceder a la carpeta fuente:**
   ```bash
   cd src
   ```

3. **Construir y arrancar los contenedores:**
   ```bash
   docker compose up --build
   ```

   *Este comando descargará las imágenes base, instalará todas las dependencias definidas y levantará los servicios en segundo plano o en consola.*

---

## 4) Cómo Acceder a la Parte Cliente

Una vez ejecutado el comando `docker compose up --build`:

### Acceso Local (PC / Servidor Propio)
Abre tu navegador web y navega a la siguiente dirección:
* **URL del Cliente:** `http://localhost:3000`

### Acceso desde GitHub Codespaces
1. En la barra inferior del entorno de Codespaces, haz clic en la pestaña **Ports** (Puertos).
2. Ubica la fila del **Puerto 3000** (`backend-node`).
3. Haz clic en el icono del globo terráqueo (**Open in Browser**) o abre el enlace asignado.

---

## 📐 Arquitectura y Flujo de Datos

```text
[ Cliente Web (SPA / Navegador) ]
               │
               │ HTTP POST /api/products (Puerto 3000)
               ▼
[ API Gateway (Node.js + Express) ]
               │
               │ HTTP POST /scrape (Red Docker: http://backend-python:5000)
               ▼
[ Engine Scraper (Python + FastAPI + BeautifulSoup) ]
               │
               │ Petición HTTP GET
               ▼
[ Web Objetivo (e-commerce / Books to Scrape) ]
```

---

## 🧪 Guía de Pruebas Rápidas (Demo)

Para probar la extracción de datos sin riesgo de bloqueos por cortafuegos o captchas:

1. Copia la URL de este producto de pruebas:
   ```text
   [http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html](http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html)
   ```
2. Pégala en el campo **"Añadir producto a seguimiento"** dentro de la interfaz web.
3. Pulsa el botón **Registrar producto**.
4. La aplicación mostrará la tarjeta con el título (*A Light in the Attic*) y precio (*£51.77*) parseados en tiempo real.
5. Pulsa el botón **Actualizar** en la tarjeta para forzar una relectura del precio bajo demanda.

---

## 👤 Autor

* **Álvaro García** — [@alvaroogaarcia-git](https://github.com/alvaroogaarcia-git)