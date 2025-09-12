
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

			if (!username) {
				alert("❌ Por favor ingresa tu nombre de usuario.");
				return;
			}

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

				const response = await fetch('/functions/sendEmail', {
					method: 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (response.ok && result.success) {
					alert("✅ Tu comprobante fue enviado correctamente. Revisaremos el pago y activaremos tu VIP.");
					form.reset();
				} else {
					console.error('Error:', result);
					alert("❌ Hubo un error al enviar el comprobante. Por favor intenta nuevamente o contacta al soporte.");
				}
			} catch (error) {
				console.error('Error de red:', error);
				alert("❌ Error de conexión. Verifica tu internet e intenta nuevamente.");
			} finally {
				submitButton.textContent = originalText;
				submitButton.disabled = false;
			}
		});
	}

});




