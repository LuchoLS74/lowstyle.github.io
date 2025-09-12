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

            // Mostrar estado de carga
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            try {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('alias', 'lowstyle.mta.mp');
                if (receipt) {
                    formData.append('receipt', receipt);
                }

                console.log('Enviando datos:', { username, hasReceipt: !!receipt });

                const response = await fetch('/sendEmail', {
                    method: 'POST',
                    body: formData
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', [...response.headers.entries()]);

                // Verificar si la respuesta es válida antes de parsear JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Server error: ${response.status} - ${errorText}`);
                }

                // Intentar parsear como JSON solo si hay contenido
                const contentType = response.headers.get('content-type');
                let result;
                
                if (contentType && contentType.includes('application/json')) {
                    const responseText = await response.text();
                    if (responseText.trim()) {
                        result = JSON.parse(responseText);
                    } else {
                        result = { success: true }; // Respuesta vacía = éxito
                    }
                } else {
                    result = { success: true }; // Respuesta no-JSON = éxito
                }

                console.log('Parsed result:', result);

                if (result.success !== false) {
                    alert("✅ Tu comprobante fue enviado correctamente. Revisaremos el pago y activaremos tu VIP.");
                    form.reset();
                } else {
                    console.error('Error en resultado:', result);
                    alert("❌ Hubo un error al procesar el envío: " + (result.error || 'Error desconocido'));
                }

            } catch (error) {
                console.error('Error completo:', error);
                alert("❌ Error al enviar: " + error.message + "\nPor favor contacta al administrador.");
            } finally {
                // Restaurar el botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});




