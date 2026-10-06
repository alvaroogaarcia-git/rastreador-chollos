# 🏷️ Rastreador de Chollos — Monitor de Precios en Tiempo Real

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Scraper-Python%20%2F%20FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-SPA%20%2F%20TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

Plataforma web distribuida orientada a la monitorización de productos e-commerce, extracción automatizada de precios mediante *web scraping* y análisis del historial de variaciones para la detección de ofertas.

---

## 📐 Arquitectura del Sistema

El proyecto está diseñado bajo una **arquitectura de microservicios políglota**, separando la lógica de la interfaz web/API Gateway del motor intensivo de procesamiento y extracción de datos.

### Flujo de Datos del Sistema

![Flujo de Arquitectura](https://raw.githubusercontent.com/alvaroogaarcia-git/rastreador-chollos/main/docs/architecture-flow.png)

```text
[ Cliente Web (SPA) ]
        │
        │ HTTP / JSON (Puerto 3000)
        ▼
[ API Gateway (Node.js + Express) ]
        │
        │ Red Interna Docker (http://backend-python:5000/scrape)
        ▼
[ Engine Scraper (Python + FastAPI + BeautifulSoup) ]
        │
        │ Petición HTTP GET
        ▼
[ Tienda Online Objetivo (Books to Scrape / E-commerce) ]
```

### Componentes de la Arquitectura

1. **Frontend (SPA):** Interfaz gráfica responsive en HTML5, Vanilla JavaScript y Tailwind CSS. Diseñada bajo un estilo de panel de control SaaS corporativo.
2. **API Gateway (Node.js / Express):** Servidor principal encargado de servir los archivos estáticos de la SPA, validar peticiones de entrada y orquestar las llamadas hacia la red interna de microservicios.
3. **Engine Scraper (Python / FastAPI):** Microservicio especializado en descargar de forma asíncrona el HTML de las páginas objetivo, analizar el DOM mediante `BeautifulSoup4` y extraer títulos, precios y divisas.
4. **Orquestador (Docker Compose):** Aísla cada entorno en contenedores ligeros y define una red interna privada para la comunicación inter-servicio.

---

## 📁 Estructura del Proyecto

```text
rastreador-chollos/
├── docker-compose.yml           # Orquestación de contenedores y redes
├── README.md                    # Documentación principal del proyecto
├── presentation/
│   └── presentacion.pptx        # Diapositivas para la defensa del proyecto
└── src/
    ├── backend-node/            # Microservicio API Gateway (Node.js)
    │   ├── Dockerfile
    │   ├── index.js
    │   └── package.json
    ├── backend-python/          # Microservicio Web Scraper (Python)
    │   ├── Dockerfile
    │   ├── main.py
    │   └── requirements.txt
    └── frontend/                # Interfaz de Usuario (SPA)
        └── index.html
```

---

## 🛠 Tecnologías Utilizadas

| Capa | Tecnología | Función |
| :--- | :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, JS (Fetch API) | Interfaz asíncrona en una sola página (SPA) |
| **API Gateway** | Node.js, Express.js | Orquestación, enrutamiento y servicio estático |
| **Scraper** | Python, FastAPI, BeautifulSoup4 | Extracción automatizada y parseo de HTML |
| **Contenedores** | Docker, Docker Compose | Containerización y aislamiento de microservicios |
| **Despliegue** | GitHub Codespaces / Local | Entorno de ejecución en nube y desarrollo remoto |

---

## 🔌 Especificación de la API REST

### 1. Endpoint en API Gateway (Node.js)

* **Ruta:** `POST /api/products`
* **Descripción:** Recibe la URL a rastrear y solicita la extracción de datos al microservicio de Python.
* **Request Body:**
  ```json
  {
    "url": "[http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html](http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html)"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "id": "1728211200000",
    "title": "A Light in the Attic",
    "url": "[http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html](http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html)",
    "current_price": "51.77",
    "currency": "£",
    "history": [
      {
        "date": "06/10/2026",
        "price": "51.77 £"
      }
    ]
  }
  ```

### 2. Endpoint Interno de Scraping (Python)

* **Ruta:** `POST /scrape`
* **Descripción:** Petición interna ejecutada desde Node.js hacia el contenedor de Python.
* **Request Body:**
  ```json
  {
    "url": "[http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html](http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html)"
  }
  ```

---

## 🚀 Despliegue y Ejecución

### Requisitos Previos

* Tener instalado **Docker** y **Docker Compose** (o ejecutar directamente en **GitHub Codespaces**).

### Instrucciones de Arranque

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/alvaroogaarcia-git/rastreador-chollos.git](https://github.com/alvaroogaarcia-git/rastreador-chollos.git)
   cd rastreador-chollos/src
   ```

2. **Levantar la infraestructura con Docker Compose:**
   ```bash
   docker compose up --build
   ```

3. **Acceder a la aplicación:**
   * **Interfaz Web (Node.js):** `http://localhost:3000`
   * **Microservicio Python (Salud/Scraper):** `http://localhost:5000`

---

## 🧪 Guía de Pruebas (Demo)

Para validar la extracción de datos en tiempo real sin bloqueos por cortafuegos o captchas, se recomienda utilizar productos del portal de prueba oficial *Books to Scrape*:

1. Copia la URL del siguiente producto de prueba:
   ```text
   [http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html](http://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html)
   ```
2. Pégala en el campo **"Añadir producto a seguimiento"** del panel web.
3. Haz clic en **Registrar producto**.
4. Comprueba cómo el microservicio en Python raspa el título (*A Light in the Attic*) y el precio (*£51.77*), registrándolo dinámicamente en la interfaz.
5. Haz clic en el botón **Actualizar** para forzar una nueva relectura del precio bajo demanda.

---

## 💡 Lecciones Aprendidas y Trabajo Futuro

* **Cabeceras HTTP y Prevención de Bloqueos:** Se configuraron cabeceras `User-Agent` personalizadas en el cliente de Python para simular navegadores reales y evitar bloqueos HTTP `403 Forbidden` durante el raspado.
* **Orquestación de Rutas en Docker:** Se configuró el contexto de construcción en la raíz `src/` para permitir que el contenedor Node.js copie y sirva los recursos del directorio `frontend/`.
* **Líneas de Trabajo Futuro:**
  * Implementación de un programador de tareas (*Cron Job*) mediante `node-cron` o `Celery` para automatizar relecturas nocturnas de precios.
  * Persistencia de datos en base de datos PostgreSQL/MongoDB.
  * Sistema de notificaciones por email o Telegram al detectar bajadas de precio objetivo.

---

## 👤 Autor

* **Álvaro García** — *Desarrollo integral y arquitectura* — [@alvaroogaarcia-git](https://github.com/alvaroogaarcia-git)