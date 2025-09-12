function showSection(sectionId, pushHistory = true) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');

        if (pushHistory) {
            history.pushState({ section: sectionId }, '', '/' + sectionId);
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

    const path = window.location.pathname.replace('/', '') || 'home';
    if (document.getElementById(path)) {
        showSection(path, false);
    } else {
        showSection('home', false);
    }

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
            const username = document.getElementById('username').value;

            await fetch('/functions/sendEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            window.location.href = "https://mpago.la/25AzDYn";
        });
    }
});



