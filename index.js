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

// Inicialización cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Low Style - MTA SA cargada correctamente');
});