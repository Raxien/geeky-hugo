// Ottimizzazione dei banner pubblicitari
document.addEventListener('DOMContentLoaded', function() {
    // Funzione per caricare i banner quando sono visibili
    function loadVisibleAds() {
        const ads = document.querySelectorAll('ins.adsbygoogle');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ad = entry.target;
                    if (!ad.getAttribute('data-ad-status')) {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                        observer.unobserve(ad);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        ads.forEach(ad => {
            observer.observe(ad);
        });
    }

    // Carica i banner quando il documento è pronto
    if (document.querySelector('script[data-loaded="true"]')) {
        loadVisibleAds();
    } else {
        // Lo script di Google Ads viene caricato in modo differito (vedi head.html): invece di
        // fare polling, aspettiamo l'evento emesso al suo caricamento
        window.addEventListener('adsbygoogle-ready', loadVisibleAds, { once: true });
    }
}); 