const routes = {
    'inicio': 'home',
    'faq': 'faq',
    'reglas': 'rules',
    'ventas': 'sales'
};

function showSection(sectionId, pushHistory = true) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');

        const path = Object.keys(routes).find(key => routes[key] === sectionId) || sectionId;

        if (pushHistory) {
            history.pushState({ section: sectionId }, '', '/' + path);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('mobile-nav').classList.add('hidden');
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.classList.toggle('hidden');
}

function toggleFAQ(answerId) {
    const answer = document.getElementById(answerId);
    if (answer.classList.contains('open')) {
        answer.classList.remove('open');
    } else {
        document.querySelectorAll('#faq .detail').forEach(det => det.classList.remove('open'));
        answer.classList.add('open');
    }
}

function toggleSaleDetail(detailId) {
    const detail = document.getElementById(detailId);
    if (detail.classList.contains('open')) {
        detail.classList.remove('open');
    } else {
        document.querySelectorAll('#sales .detail').forEach(det => det.classList.remove('open'));
        detail.classList.add('open');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Página de Low Style - MTA SA cargada correctamente');

    let path = window.location.pathname.replace('/', '') || 'inicio';
    const sectionId = routes[path] || 'home';
    showSection(sectionId, false);

    window.addEventListener('popstate', function (event) {
        const section = event.state?.section || 'home';
        if (document.getElementById(section)) {
            showSection(section, false);
        }
    });

    const form = document.getElementById('vip-form');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const receipt = document.getElementById('receipt').files[0];

            // Validación básica
            if (!username) {
                alert("❌ Por favor ingresa tu nombre de usuario.");
                return;
            }

            // Validación de archivo (opcional pero recomendado)
            if (receipt && receipt.size > 10 * 1024 * 1024) { // 10MB máximo
                alert("❌ El archivo es demasiado grande. Máximo 10MB.");
                return;
            }

            // Mostrar estado de carga
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '📤 Enviando...';
            submitButton.disabled = true;

            try {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('alias', 'lowstyle.mta.mp');
                if (receipt) {
                    formData.append('receipt', receipt);
                }

                console.log('Enviando datos:', { 
                    username, 
                    hasReceipt: !!receipt,
                    receiptSize: receipt ? receipt.size : 0 
                });

                // IMPORTANTE: Usar la ruta correcta para Functions
                const response = await fetch('/sendEmail', {
                    method: 'POST',
                    body: formData
                });

                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    
                    let errorMessage = `Server error: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.error || errorMessage;
                    } catch (e) {
                        // No es JSON válido, usar texto como está
                    }
                    
                    throw new Error(errorMessage);
                }

                // Parsear respuesta JSON
                const result = await response.json();
                console.log('Respuesta exitosa:', result);

                if (result.success) {
                    alert("✅ ¡Perfecto! Tu comprobante fue enviado correctamente.\n\nRevisaremos el pago y activaremos tu VIP lo antes posible.");
                    form.reset(); // Limpiar formulario
                } else {
                    throw new Error(result.error || 'Error desconocido');
                }

            } catch (error) {
                console.error('Error completo:', error);
                
                let userMessage = "❌ Hubo un error al enviar el comprobante.";
                
                if (error.message.includes('Failed to fetch')) {
                    userMessage += "\n\n🌐 Problema de conexión. Verifica tu internet e intenta nuevamente.";
                } else if (error.message.includes('Configuración')) {
                    userMessage += "\n\n⚙️ Error de configuración del servidor. Contacta al administrador.";
                } else {
                    userMessage += `\n\n📝 Detalle: ${error.message}`;
                }
                
                alert(userMessage);
            } finally {
                // Restaurar el botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});



