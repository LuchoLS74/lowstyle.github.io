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

// Función mejorada con múltiples APIs de respaldo
async function updatePlayerCount() {
    const playerCountElement = document.getElementById('player-count');
    
    if (!playerCountElement) {
        console.error('Elemento player-count no encontrado');
        return;
    }
    
    const serverIP = '45.235.98.194';
    const serverPort = 22004;
    
    // Lista de APIs para probar en orden
    const apis = [
        {
            name: 'MTASA-API.com',
            url: 'https://mtasa-api.com/servers',
            parser: (data) => {
                const server = data.find(s => s.ip === serverIP && s.port == serverPort);
                return server ? server.players : null;
            }
        },
        {
            name: 'MTASA-Query.com',
            url: `https://mtasa-query.com/api/players?ip=${serverIP}&port=${serverPort}`,
            parser: (data) => {
                return data.players ? data.players.length : null;
            }
        },
        {
            name: 'GameTracker API',
            url: `https://api.gametracker.com/server_info/${serverIP}:${serverPort}/`,
            parser: (data) => {
                return data.players ? parseInt(data.players) : null;
            }
        }
    ];
    
    // Probar cada API hasta que una funcione
    for (const api of apis) {
        try {
            console.log(`Probando ${api.name}...`);
            
            const response = await fetch(api.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Timeout de 10 segundos
                signal: AbortSignal.timeout(10000)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`${api.name} respuesta:`, data);
            
            const playerCount = api.parser(data);
            
            if (playerCount !== null && playerCount !== undefined) {
                playerCountElement.textContent = `Jugadores online: ${playerCount}`;
                playerCountElement.style.color = '#10b981';
                console.log(`✅ ${api.name} funcionó: ${playerCount} jugadores`);
                return; // Éxito, no probar más APIs
            }
            
        } catch (error) {
            console.warn(`❌ ${api.name} falló:`, error.message);
            continue; // Probar la siguiente API
        }
    }
    
    // Si todas las APIs fallan, mostrar mensaje genérico
    console.error('Todas las APIs fallaron');
    playerCountElement.textContent = 'Servidor activo - ¡Únete ahora!';
    playerCountElement.style.color = '#fbbf24'; // Amarillo para indicar problema con APIs
}

// Función para probar conexión directa al servidor (alternativa)
async function testDirectConnection() {
    try {
        // Intenta una conexión simple para verificar si el servidor responde
        const response = await fetch(`http://45.235.98.194:22004`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: AbortSignal.timeout(5000)
        });
        return true;
    } catch (error) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Low Style - MTA SA cargada correctamente');
    
    // Actualiza jugadores online al cargar
    updatePlayerCount();
    
    // Actualiza cada 60 segundos (no muy frecuente para no saturar las APIs)
    setInterval(updatePlayerCount, 60000);
    
    // También actualizar cuando la ventana vuelve a tener foco
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updatePlayerCount();
        }
    });
});
