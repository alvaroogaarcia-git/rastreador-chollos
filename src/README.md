# Rastreador de Chollos y Monitor de Precios en Tiempo Real

Proyecto desarrollado con arquitectura de microservicios usando Node.js, Python (FastAPI) y Docker.

---

## 0) Software que se necesita instalar
Para ejecutar el proyecto de forma recomendada utilizando contenedores:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (versión 20.10 o superior)

Si se desea ejecutar en entorno local sin Docker:
* Node.js (v18 o superior)
* Python (3.10 o superior)

---

## 1) Servicios que hay que arrancar
El proyecto cuenta con una arquitectura de microservicios contenerizada mediante Docker Compose.

Para poner en marcha todos los servicios automáticamente:
```bash
docker-compose up --build -d