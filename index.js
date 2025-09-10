function showSection(sectionId) {
    // Oculta todas las secciones
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    // Muestra la sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    
    // Vuelve al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Cierra el menú móvil si está abierto
    document.getElementById('mobile-nav').classList.add('hidden');
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.classList.toggle('hidden');
}

function toggleFAQ(answerId) {
    const answer = document.getElementById(answerId);
    
    if (answer.classList.contains('open')) {
        // Si ya está abierta, la cierra
        answer.classList.remove('open');
    } else {
        // Cierra todas las respuestas FAQ primero
        document.querySelectorAll('#faq .detail').forEach(det => det.classList.remove('open'));
        
        // Abre la respuesta seleccionada
        answer.classList.add('open');
    }
}

function toggleSaleDetail(detailId) {
    const detail = document.getElementById(detailId);
    
    if (detail.classList.contains('open')) {
        // Si ya está abierto, lo cierra
        detail.classList.remove('open');
    } else {
        // Cierra otros detalles de venta primero
        document.querySelectorAll('#sales .detail').forEach(det => det.classList.remove('open'));
        
        // Abre el detalle seleccionado
        detail.classList.add('open');
    }
}

async function updatePlayerCount() {
    const playerCountElement = document.getElementById('player-count');
    
    if (!playerCountElement) {
        console.error('Elemento player-count no encontrado');
        return;
    }
    
    try {
        console.log('Intentando obtener datos del servidor...');
        
        // Intenta la API original primero
        const response = await fetch('https://mtasa-query.com/api/players?ip=45.235.98.194&port=22004');
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Verifica si los datos tienen la estructura esperada
        if (data && typeof data.players !== 'undefined') {
            const playerCount = Array.isArray(data.players) ? data.players.length : data.players;
            playerCountElement.textContent = `Jugadores online: ${playerCount}`;
            console.log(`Jugadores online actualizados: ${playerCount}`);
        } else {
            // Si la estructura es diferente, intenta otras propiedades comunes
            const possibleCount = data.playercount || data.online || data.current_players || 0;
            playerCountElement.textContent = `Jugadores online: ${possibleCount}`;
            console.log('Estructura de datos diferente, usando:', possibleCount);
        }
        
    } catch (error) {
        console.error('Error al obtener los datos del servidor:', error);
        
        // Intenta una API alternativa o muestra un mensaje genérico
        try {
            // API alternativa (puedes cambiar esta URL por una que funcione)
            const altResponse = await fetch(`https://api.minetools.eu/query/${encodeURIComponent('45.235.98.194')}/${encodeURIComponent('22004')}`);
            if (altResponse.ok) {
                const altData = await altResponse.json();
                const playerCount = altData.players ? altData.players.online || altData.players.length : 0;
                playerCountElement.textContent = `Jugadores online: ${playerCount}`;
                return;
            }
        } catch (altError) {
            console.error('API alternativa también falló:', altError);
        }
        
        // Si todo falla, muestra un mensaje de error amigable
        playerCountElement.textContent = 'Servidor activo - ¡Únete ahora!';
        playerCountElement.style.color = '#10b981'; // Verde para indicar que el servidor está activo
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Low Style - MTA SA cargada correctamente');
    
    // Actualiza jugadores online al cargar
    updatePlayerCount();
    
    // Actualiza cada 30 segundos
    setInterval(updatePlayerCount, 30000);
});
