const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// URL del microservicio de Python. En Docker usaremos el nombre del contenedor ('http://backend-python:5000')
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

// Middlewares
app.use(cors());
app.use(express.json());

// Servir la carpeta estática del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Base de datos temporal en memoria para almacenar los productos rastreados
const productsDatabase = [];

// Endpoint 1: Verificación de estado
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Node.js Backend' });
});

// Endpoint 2: Listar todos los productos rastreados
app.get('/api/products', (req, res) => {
    res.json(productsDatabase);
});

// Endpoint 3: Registrar un nuevo producto (Consume el microservicio en Python)
app.post('/api/products', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Debes proporcionar una URL válida.' });
    }

    try {
        // Petición interna de servidor a servidor hacia el microservicio Python
        const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/scrape`, { url });
        const scrapedData = pythonResponse.data;

        // Construcción del objeto del producto
        const newProduct = {
            id: Date.now().toString(),
            url: scrapedData.url,
            title: scrapedData.title,
            current_price: scrapedData.price,
            currency: scrapedData.currency,
            created_at: new Date().toISOString(),
            history: [
                { price: scrapedData.price, date: new Date().toISOString() }
            ]
        };

        productsDatabase.push(newProduct);

        res.status(201).json({
            message: 'Producto registrado con éxito',
            product: newProduct
        });

    } catch (error) {
        console.error('Error al conectar con Python:', error.message);
        res.status(502).json({
            error: 'No se pudo rastrear el producto. El servicio de scraping no responde.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
});