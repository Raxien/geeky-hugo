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
    let checkAdsScript;
    if (document.querySelector('script[data-loaded="true"]')) {
        loadVisibleAds();
    } else {
        // Se lo script di Google Ads non è ancora caricato, aspetta
        checkAdsScript = setInterval(() => {
            if (document.querySelector('script[data-loaded="true"]')) {
                clearInterval(checkAdsScript);
                loadVisibleAds();
            }
        }, 100);
    }
}); 