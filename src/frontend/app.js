document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productUrlInput = document.getElementById('productUrl');
    const statusMessage = document.getElementById('statusMessage');
    const productsList = document.getElementById('productsList');
    const submitBtn = document.getElementById('submitBtn');

    // Cargar productos al iniciar
    loadProducts();

    // Escuchar el evento del formulario
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = productUrlInput.value.trim();

        if (!url) return;

        // Cambiar estado visual del botón
        submitBtn.disabled = true;
        submitBtn.innerText = 'Rastreando...';
        showMessage('Enviando URL al microservicio de scraping...', 'info');

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('¡Producto rastreado correctamente!', 'success');
                productUrlInput.value = '';
                loadProducts();
            } else {
                showMessage(data.error || 'Error al procesar el producto.', 'error');
            }
        } catch (error) {
            showMessage('Error de conexión con el servidor.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Añadir Producto';
        }
    });

    // Función para obtener los productos del servidor
    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();

            if (products.length === 0) {
                productsList.innerHTML = '<p class="empty-state">No hay productos en seguimiento aún.</p>';
                return;
            }

            productsList.innerHTML = products.map(product => `
                <div class="product-item">
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <a href="${product.url}" target="_blank" rel="noopener">Ver enlace original</a>
                    </div>
                    <div class="product-price">
                        ${product.current_price} ${product.currency}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            productsList.innerHTML = '<p class="empty-state">Error al cargar la lista de productos.</p>';
        }
    }

    function showMessage(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `message ${type}`;
    }
});