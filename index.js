function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Low Style - MTA SA cargada correctamente');
});
