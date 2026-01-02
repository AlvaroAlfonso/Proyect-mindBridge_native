
// URL de tu API
const API_URL = 'http://localhost:3000/api';

// Función para obtener un parámetro de la URL (el ID del artículo)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para mostrar los detalles del artículo
async function fetchAndRenderArticle() {
    // 1. Obtener el ID del artículo de la URL
    const articleId = getUrlParameter('id');
    const contentArea = document.getElementById('content-area');

    if (!articleId) {
        contentArea.innerHTML = '<p id="error-message">Error: No se encontró el ID del artículo en la URL.</p>';
        return;
    }

    try {
        // 2. Hacer la solicitud a la API usando el ID
        const response = await fetch(`${API_URL}/posts/${articleId}`);

        if (!response.ok) {
            if (response.status === 404) {
                contentArea.innerHTML = '<p id="error-message">Error 404: El artículo no se encontró.</p>';
            } else {
                contentArea.innerHTML = '<p id="error-message">Error: Hubo un problema al cargar el artículo.</p>';
            }
            return;
        }

        const article = await response.json();

        // 3. Rellenar los elementos HTML con los datos del artículo
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('author-name').textContent = article.author;
        document.getElementById('article-image').src = article.imageUrl || 'https://placehold.co/900x500/F0F4F8/607A9A?text=No+Image';
        document.getElementById('article-content').innerHTML = article.content.replace(/\n/g, '<br><br>');
        
    } catch (e) {
        console.error("Error al obtener el artículo:", e);
        contentArea.innerHTML = '<p id="error-message">Error de conexión: No se pudo conectar al servidor.</p>';
    }
}

// Llama a la función principal al cargar la página
fetchAndRenderArticle();
