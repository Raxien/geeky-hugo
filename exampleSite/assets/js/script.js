// Passive event listeners
jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    'use strict';
    this.addEventListener('touchstart', handle, {
      passive: !ns.includes('noPreventDefault')
    });
  }
};

jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    'use strict';
    this.addEventListener('touchmove', handle, {
      passive: !ns.includes('noPreventDefault')
    });
  }
};

// Preloader js
$(window).on('load', function () {
  'use strict';
  $('.preloader').fadeOut(0);
});

// on ready state
$(document).ready(function () {
  'use strict';

  // search-toggle
  $('.toggle-search').on('click', function () {
    var targetId = $(this).data('target');
    var $searchBar;
    if (targetId) {
      $searchBar = $(targetId);
      $searchBar.toggleClass('open');
    }

    setTimeout(() => {
      document.getElementById("search-query").focus();
    }, "100")

  });

  // tab
  $('.tab-content').find('.tab-pane').each(function (idx, item) {
    var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
      title = $(this).attr('title');
    navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
  });

  $('.code-tabs ul.nav-tabs').each(function () {
    $(this).find("li:first").addClass('active');
  })

  $('.code-tabs .tab-content').each(function () {
    $(this).find("div:first").addClass('active');
  });

  $('.nav-tabs a').click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest('.code-tabs'),
      tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
    tabPanel.find('.active').removeClass('active');
    tab.addClass('active');
    tabPane.addClass('active');
  });

  // Accordions
  $('.collapse').on('shown.bs.collapse', function () {
    $(this).parent().find('.fas fa-plus').removeClass('fas fa-plus').addClass('fas fa-minus');
  }).on('hidden.bs.collapse', function () {
    $(this).parent().find('.fas fa-minus').removeClass('fas fa-minus').addClass('fas fa-plus');
  });

}); 

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.guides-slider');
  
  // Se lo slider non esiste, esci dalla funzione
  if (!slider) return;
  
  const wrapper = slider.querySelector('.guides-wrapper');
  const slides = wrapper.querySelectorAll('.guide-slide');
  const prevButton = slider.querySelector('.nav-button.prev');
  const nextButton = slider.querySelector('.nav-button.next');
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let autoSlideInterval;

  // Carica le immagini
  function loadImages() {
    const images = wrapper.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  // Funzione per spostare le slide
  function moveSlide(direction) {
    if (direction === 'next') {
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Gestione touch per mobile
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { // Soglia minima per lo swipe
      if (diff > 0) {
        moveSlide('next');
      } else {
        moveSlide('prev');
      }
    }
  }

  // Inizializza l'autoplay
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      moveSlide('next');
    }, 5000);
  }

  // Event listeners
  prevButton.addEventListener('click', () => moveSlide('prev'));
  nextButton.addEventListener('click', () => moveSlide('next'));

  slider.addEventListener('touchstart', handleTouchStart);
  slider.addEventListener('touchmove', handleTouchMove);
  slider.addEventListener('touchend', handleTouchEnd);

  // Inizializzazione
  loadImages();
  startAutoSlide();

  // Pausa autoplay quando il mouse è sopra lo slider
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });

  slider.addEventListener('mouseleave', () => {
    startAutoSlide();
  });
});


  // Load more posts
  const loadMoreButton = document.getElementById('loadMore');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async function() {
      const nextUrl = this.dataset.nextUrl;
      if (!nextUrl) return;

      this.disabled = true;
      this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      this.style.backgroundColor = '#15817f';

      try {
        const response = await fetch(nextUrl);
        const html = await response.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;

        const newPosts = temp.querySelector('.row.mx-0.g-5');
        const currentPosts = document.querySelector('.row.mx-0.g-5');

        if (newPosts && currentPosts) {
          currentPosts.innerHTML += newPosts.innerHTML;
        }

        const newNextUrl = temp.querySelector('#loadMore')?.dataset.nextUrl;
        if (newNextUrl) {
          this.dataset.nextUrl = newNextUrl;
        } else {
          this.remove();
        }
      } catch (error) {
        console.error('Errore nel caricamento dei post:', error);
        this.innerHTML = 'Errore nel caricamento';
      } finally {
        this.disabled = false;
        this.innerHTML = 'Mostra altro';
        this.style.backgroundColor = '#15817f';
      }
    });
  }

//=================== expanses script start ===================
const rpcUrl = "https://vandipetyapi.onrender.com"
const color = [ 'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(229, 122, 250, 1)',
                'rgba(32, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(102, 178, 255, 1)',
                'rgba(153, 153, 255, 1)',
                'rgba(204, 255, 204, 1)',
                'rgba(255, 153, 153, 1)'
]

async function fecthExpenseData() {
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpeseAnno`);
        const data = await response.json();
        processExpenseData(data.json);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthChartCategoryData() {
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpesePerCategoria`);
        const data = await response.json();
        setChartCategory(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthChartMonthlyData() {
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpesePerMese`);
        const data = await response.json();
        setChartMonthly(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

async function fecthGridData() {
    try {
        const response = await fetch(`${rpcUrl}/sw/getSpese`);
        const data = await response.json();
        setGrid(data);
        return data;
    } catch (error) {
        console.error('Error fetching SW data:', error);
    }
}

function processExpenseData(data) {
    updateUIElements({
        totalCost: data.totalCost,
        totalCostWithoutFerry: data.totalCostWithoutFerry,
        ferryCosts: data.ferryCosts,
        yearlyTotals: data.yearlyTotals,
        dailyCost: data.dailyCost,
        dailyCostWithoutFerry: data.dailyCostWithoutFerry,
        diffDays: data.tripDay,
    });
}

function updateUIElements({ totalCost, totalCostWithoutFerry, ferryCosts, yearlyTotals, dailyCost, dailyCostWithoutFerry, diffDays }) {
    // Aggiorna solo se siamo nella pagina delle spese
    if (document.getElementById('travelingSumCost')) {
        document.getElementById('travelingSumCost').innerText = `${totalCostWithoutFerry.toFixed(2)} €`;
        document.getElementById('dailyCost').innerText = `${dailyCostWithoutFerry.toFixed(2)} €`;
        document.getElementById('travelingSumCostFerry1').innerText = ferryCosts.ferry1.toFixed(2);
        document.getElementById('travelingSumCostFerry2').innerText = ferryCosts.ferry2.toFixed(2);
        document.getElementById('dailyCostFerry').innerText = `${dailyCost.toFixed(2)} € al giorno`;
        document.getElementById('yearlyCostFerry').innerText = `${totalCost.toFixed(2)} €`;

        const yearlyContainer = document.getElementById('yearlyCost');
        yearlyContainer.innerHTML = '';
        
        Object.entries(yearlyTotals).forEach(([year, amount]) => {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'col-md-3 mb-3';
            yearDiv.innerHTML = `
                <h4 class="h5 mb-2">${year}</h4>
                <h3 class="mb-5 h5">${amount.toFixed(2)} €</h3>
            `;
            yearlyContainer.appendChild(yearDiv);
        });

        document.getElementById('travelingDay').innerText = diffDays;
    }
}

function setChartCategory(data) {
    const ctx = document.getElementById('catergory')?.getContext('2d');
    if (!ctx) return;

    const _labels = Object.keys(data.json);
    const _data = Object.values(data.json);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: _labels,
            datasets: [{
                label: 'Euro',
                data: _data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        }
    });
}

function setChartMonthly(data) {
    const ctx2 = document.getElementById('monthly')?.getContext('2d');
    if (!ctx2) return;

    const _labels2 = Object.keys(data.json);
    const _data2 = Object.values(data.json);

    new Chart(ctx2, {
        type: 'bar',
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        data: {
            labels: _labels2.reverse(),
            datasets: [{
                label: 'Euro',
                data: _data2.reverse(),
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        }
    });
}

function setGrid(data) {
    const result = [];
    let i = 0;
    while(i < data.json.length) {
        let res = data.json[i];
        let cost = parseFloat(res.cost);
        cost = Math.round((cost + Number.EPSILON) * 100) / 100;
        result.push([res.category.name, res.description, cost, new Date(res.date).toLocaleString()]);
        i++;
    }

    const gridElement = document.getElementById("tblSpese");
    if (gridElement) {
        new gridjs.Grid({
            columns: ["Categoria", "Descrizione", "Spesa", "Data"],
            data: result,
            sort: true,
            pagination: {
                limit: 20
            }
        }).render(gridElement);
    }
}

// Funzione di inizializzazione per la pagina delle spese
function initExpensesPage() {
    if (!document.getElementById('catergory')) return;

    // Rimuovi iframe pubblicitari
    setInterval(() => {
        document.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src');
            if (src && src.match(/(ads-iframe)|(disqusads)/gi)) {
                iframe.remove();
            }
        });
    }, 300);

    // Carica i dati
    document.addEventListener('DOMContentLoaded', async () => {
        await fecthExpenseData();
        await fecthChartMonthlyData();
        await fecthChartCategoryData();
        await fecthGridData();
    });
}

// Inizializza la pagina delle spese se siamo nella pagina corretta
initExpensesPage();
//=================== expanses script end ===================

//=================== press script start ===================
function createPressListItem(data) {
    const info = data.info ? data.info.replace('#', data.data) : '';
    return `<li><strong><a href="${data.url}">${data.title}</a></strong>${info ? ` (${info})` : ''}</li>`;
}

function sortByDate(a, b) {
    return new Date(a.data).getTime() - new Date(b.data).getTime();
}

async function buildPressList() {
    try {
        const loader = document.getElementById('loader');
        const pressElement = document.getElementById('press');
        if (!loader || !pressElement) return;

        const response = await fetch(`${rpcUrl}/data/press`);
        const data = await response.json();
        const pressItems = data.json;
        
        pressItems.sort(sortByDate);

        pressItems.forEach(item => {
            const year = item.data.split('/')[2];
            
            if (!document.getElementById(year)) {
                const yearHeading = document.createElement('h5');
                yearHeading.textContent = year;
                pressElement.appendChild(yearHeading);
                
                const yearList = document.createElement('ul');
                yearList.id = year;
                pressElement.appendChild(yearList);
            }

            const yearList = document.getElementById(year);
            yearList.insertAdjacentHTML('beforeend', createPressListItem(item));
        });

        loader.style.display = 'none';
    } catch (error) {
        console.error('Error loading press data:', error);
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
}

// Funzione di inizializzazione per la pagina press
function initPressPage() {
    if (!document.getElementById('press')) return;
    document.addEventListener('DOMContentLoaded', buildPressList);
}

// Inizializza la pagina press se siamo nella pagina corretta
initPressPage();
//=================== press script end ===================

//=================== van script start ===================
function setInsuranceData(assicuazione, bollo) {
    const assicurazioneElement = document.getElementById('assicuazione');
    const bolloElement = document.getElementById('bollo');
    if (assicurazioneElement) assicurazioneElement.innerText = `${assicuazione} €`;
    if (bolloElement) bolloElement.innerText = `${bollo} €`;
}

function setKmData(actualKm) {
    const kmElement = document.getElementById('travelingKm');
    if (kmElement) kmElement.innerText = actualKm;
}

function setVanCost(initialCost, accessoryCost) {
    const totalAccessoryCost = Object.values(accessoryCost).reduce((sum, cost) => sum + cost, 0);

    const initialCostElement = document.getElementById('initialCost');
    const accessoryCostElement = document.getElementById('accessoryCost');
    const totalVanCostElement = document.getElementById('totalVanCost');
    const tblAccessoryElement = document.getElementById('tblAccessory');

    if (initialCostElement) initialCostElement.innerText = `${initialCost} €`;
    if (accessoryCostElement) accessoryCostElement.innerText = `${totalAccessoryCost} €`;
    if (totalVanCostElement) totalVanCostElement.innerText = `${initialCost + totalAccessoryCost} €`;

    if (tblAccessoryElement) {
        new gridjs.Grid({
            columns: ["Accessorio", "Costo"],
            data: Object.entries(accessoryCost),
            sort: true,
            pagination: { limit: 20 }
        }).render(tblAccessoryElement);
    }
}

async function getTripData() {
    try {
        const response = await fetch(`${rpcUrl}/data/trip`);
        const data = await response.json();
        setTripData(data);
        return data;
    } catch (error) {
        console.error('Error fetching trip data:', error);
    }
}

// Funzione di inizializzazione per la pagina van
function initVanPage() {
    if (!document.getElementById('travelingKm')) return;

    // Rimuovi iframe pubblicitari
    setInterval(() => {
        document.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src');
            if (src && src.match(/(ads-iframe)|(disqusads)/gi)) {
                iframe.remove();
            }
        });
    }, 300);

    // Carica i dati
    document.addEventListener('DOMContentLoaded', getTripData);
}

// Inizializza la pagina van se siamo nella pagina corretta
initVanPage();
//=================== van script end ===================

//=================== trip script start ===================
function updateTripElements({ travelingKm, visitedCountry, travelingDay, travelingStartDay }) {
    if (!document.getElementById('map')) return;

    const elements = {
        travelingKm: document.getElementById('travelingKm'),
        visitedCountry: document.getElementById('visitedCountry'),
        travelingDay: document.getElementById('travelingDay'),
        travelingStartDay: document.getElementById('travelingStartDay')
    };

    if (travelingKm && elements.travelingKm) elements.travelingKm.innerText = travelingKm;
    if (visitedCountry && elements.visitedCountry) elements.visitedCountry.innerText = visitedCountry;
    if (travelingDay && elements.travelingDay) elements.travelingDay.innerText = travelingDay;
    if (travelingStartDay && elements.travelingStartDay) elements.travelingStartDay.innerText = travelingStartDay;
}

function setTripData(data) {
    const res = data.json;
    
    // Se siamo nella pagina trip, aggiorna tutti gli elementi
    if (document.getElementById('map')) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        const date1 = new Date(res.startingDate);
        const date2 = new Date(`${mm}/${dd}/${yyyy}`);
        const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

        const [day, month, year] = res.startingDate.split('/');
        const fixedDate = `${month}/${day}/${year}`;

        updateTripElements({
            travelingKm: res.actualKm,
            visitedCountry: res.visitedCountry.length,
            travelingDay: diffDays,
            travelingStartDay: fixedDate
        });
    }

    // Se siamo nella pagina van, aggiorna i costi e i km
    if (document.getElementById('initialCost')) {
        setVanCost(res.costVan, res.costAccessory);
        setInsuranceData(res.assicurazione, res.bollo);
        document.getElementById('travelingKm').innerText = res.actualKm;
    }
}

function setMap(mapJson) {
    const lat = 11.25273288631866;
    const long = 45.26401290964107;

    mapboxgl.accessToken = 'pk.eyJ1IjoicmF4aWVuIiwiYSI6ImNscHA1cDBkNjExMjQybW1zdDdwN2tydmYifQ.dWypGWy2wcMCPjDv5yKGsQ';

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v10",
        zoom: 5,
        bearing: 20,
        pitch: 60,
        maxZoom: 13,
        minZoom: 4,
        center: [lat, long]
    });

    map.scrollZoom.disable();
    map.touchZoomRotate.enable();
    map.addControl(new mapboxgl.NavigationControl());

    const mapBoxFeatures = mapJson.pin
        .filter(item => item.latlong && item.latlong !== "" && 
            (!item.date || new Date(item.date) <= new Date()))
        .map(item => {
            const latlong = item.latlong.replace(' ', '').split(',').map(parseFloat);
            return {
                type: 'Feature',
                properties: {
                    description: `<article class="feature feature-1" style="margin-bottom: 0px;">
                        <a href="https://youtu.be/${item.vendorid}" class="block" target="_blank" rel="nofollow noopener noreferrer">
                            <img alt="Image" src="https://img.youtube.com/vi/${item.vendorid}/maxresdefault.jpg" />
                        </a>
                        <div class="feature__body boxed boxed--border bg--secondary" style="margin-bottom: 0px;">
                            <h6>${item.title}</h6>
                            <p>📍 Scopri gli itinerari <a href="/search/?s=${item.blog}"><span>${item.blog}</span></a></p>
                        </div>
                    </article>`
                },
                geometry: {
                    type: "Point",
                    coordinates: [latlong[1], latlong[0]]
                }
            };
        });

    function addRouteLayer(id, routeData, color, title) {
        const coordinates = routeData.map(item => {
            const [lat, long] = item[0].replace(' ', '').split(',').map(parseFloat);
            return [lat, long];
        });

        map.addSource(id, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates
                }
            }
        });

        map.addLayer({
            id,
            type: 'line',
            source: id,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': color,
                'line-width': 4
            }
        });

        const legend = document.getElementById('legend');
        const newLegendItem = document.createElement('div');
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        newLegendItem.appendChild(span);
        newLegendItem.appendChild(document.createTextNode(title));
        legend.appendChild(newLegendItem);
    }

    map.on("load", function () {
        map.loadImage("https://res.cloudinary.com/ilgattodicitturin/image/upload/v1701600586/asset/red_marker_small_cgzn6u.png", 
            function (error, image) {
                if (error) throw error;

                addRouteLayer('route1', mapJson.route[0], '#FFC000', 'Road to Dakar');
                addRouteLayer('route2', mapJson.route[1], '#d98396', 'Tour dei Balcani');
                addRouteLayer('route3', mapJson.route[2], '#91CCF1', 'Direzione Giappone');

                map.addImage("custom-marker", image);

                map.addLayer({
                    id: "places",
                    type: "symbol",
                    source: {
                        type: "geojson",
                        data: {
                            type: 'FeatureCollection',
                            features: mapBoxFeatures
                        }
                    },
                    layout: {
                        "icon-image": "custom-marker",
                        'text-allow-overlap': true,
                        'icon-allow-overlap': true,
                    }
                });

                const legend = document.getElementById('legend');
                legend.style.display = 'block';
            });
    });

    map.on('click', 'places', function (e) {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    map.on('mouseenter', 'places', () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', 'places', () => map.getCanvas().style.cursor = '');
}

async function getMapData() {
    try {
        const response = await fetch(`${rpcUrl}/data/map`);
        const data = await response.json();
        setMap(data.json);
        return data;
    } catch (error) {
        console.error('Error fetching map data:', error);
    }
}

// Funzione di inizializzazione per la pagina trip
function initTripPage() {
    if (!document.getElementById('map')) return;

    // Rimuovi iframe pubblicitari
    setInterval(() => {
        document.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src');
            if (src && src.match(/(ads-iframe)|(disqusads)/gi)) {
                iframe.remove();
            }
        });
    }, 300);

    // Carica i dati
    document.addEventListener('DOMContentLoaded', async () => {
        const device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        await Promise.all([getTripData(), getMapData()])
            .catch(error => console.error('Error initializing data:', error));
    });
}

// Inizializza la pagina trip se siamo nella pagina corretta
initTripPage();
//=================== trip script end ===================

//=================== contact script start ===================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 1000);
    }, 3000);
}

function toggleButtonLoading(isLoading) {
    const button = document.getElementById('submitButton');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner-border');
    
    if (isLoading) {
        button.disabled = true;
        buttonText.classList.add('d-none');
        spinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        buttonText.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
}

function sendMail(event) {
    event.preventDefault();
    
    toggleButtonLoading(true);
    
    const data = {
        "from": document.getElementById("email").value,
        "isSponsor": 0,
        "subject": document.getElementById("subject").value,
        "text": document.getElementById("message").value
    }
    
    fetch(rpcUrl + "/mail/sendMail?" + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        showToast('Abbiamo ricevuto la tua email.');
        document.getElementById("email").value = '';
        document.getElementById("subject").value = '';
        document.getElementById("message").value = '';
        toggleButtonLoading(false);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Non siamo riusciti a ricevere la tua email :( riprova più tardi.');
        toggleButtonLoading(false);
    });
}

// Funzione di inizializzazione per la pagina contact
function initContactPage() {
    if (!document.getElementById('contactForm')) return;

    document.getElementById("contactForm").addEventListener('submit', sendMail);
}

// Inizializza la pagina contact se siamo nella pagina corretta
initContactPage();
//=================== contact script end ===================

//=================== travel-book script start ===================
async function getTravelBookParam(p) {
    try {
        const response = await fetch(rpcUrl + "/data/travel-book", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const res = data.json;
        
        const btnAction = document.getElementById("btnAction");
        if (btnAction) {
            btnAction.href = res[p];
        }

        return data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Funzione di inizializzazione per la pagina travel-book
function initTravelBookPage() {
    if (!document.getElementById('btnAction')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const c = urlParams.get("acquire");
    const p = urlParams.get("title");

    if (c === "yes") {
        getTravelBookParam(p);
    } else {
        window.location.replace("/404");
    }
}

// Inizializza la pagina travel-book se siamo nella pagina corretta
initTravelBookPage();
//=================== travel-book script end ===================

//=================== transiberian script start ===================
const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';
const apiKey = '5b3ce3597851110001cf6248628c476c60c94a21922aa9d289a26249';
const gmapsUrl = 'https://www.google.com/maps/dir/';

let totalKm = 0;
let cities = [];
let lastCity = null;
let choicesInstance = null;

function initTransiberianPage() {
    if (!document.getElementById('city')) return;

    const select = document.getElementById('city');
    choicesInstance = new Choices(select, {
        searchEnabled: true,
        searchChoices: true,
        itemSelectText: 'Premi per selezionare',
        placeholderValue: 'Seleziona una città',
        searchPlaceholderValue: 'Cerca una città...',
        noResultsText: 'Nessuna città trovata',
        shouldSort: true,
    });

    // Set initial visa days
    setVisaDays();
    getData();
}

async function getData() {
    try {
        const response = await fetch(`${rpcUrl}/data/ru_it`);
        const data = await response.json();
        const cityOptions = data.json.map(city => ({
            value: `${city.lat},${city.lng}`,
            label: city.city
        }));
        choicesInstance.setChoices(cityOptions, 'value', 'label', true);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function setVisaDays() {
    const visaType = document.getElementById('visaType');
    const daysInput = document.getElementById('days');
    daysInput.value = visaType.value;
    document.getElementById('days').innerText = visaType.value;
    calculateTotalKm();
    calculateMinimumDays();
}

function addCity() {
    if (!choicesInstance) return;
    const selectedOption = choicesInstance.getValue();
    if (!selectedOption) return;

    // Controlla se la città è l'ultima inserita
    if (cities.length > 0 && cities[cities.length - 1].name === selectedOption.label) {
        alert('Non puoi inserire la stessa città due volte di seguito!');
        return;
    }

    const newCity = {
        name: selectedOption.label,
        coords: selectedOption.value.split(',').map(Number)
    };

    cities.push(newCity);
    lastCity = newCity;

    if (cities.length === 1) {
        addRowToTable(newCity.name, 0);
        updateButtonsState();
    } else {
        document.getElementById('loader').style.display = 'flex';
        
        const prevCity = cities[cities.length - 2];
        calculateDistance(prevCity.coords, newCity.coords)
            .then(distance => {
                document.getElementById('loader').style.display = 'none';
                
                if (distance >= 0) {
                    addRowToTable(newCity.name, distance);
                    totalKm += distance;
                    updateTotalKm();
                    updateButtonsState();
                } else {
                    recalculateDistances();
                }
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                console.error('Errore nel calcolo della distanza:', error);
            });
    }

    choicesInstance.setChoiceByValue('');
}

async function calculateDistance(origin, destination) {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    try {
        const response = await fetch(
            `${url}?api_key=${apiKey}&start=${origin[1]},${origin[0]}&end=${destination[1]},${destination[0]}`
        );

        const data = await response.json();
        
        if (data.error && data.error.code === 2004) {
            alert("La distanza tra le città è troppo grande. Inserisci una città intermedia.");
            cities.pop();
            return -1;
        }
        
        if (data.features && data.features[0].properties.segments) {
            const distanceInKm = data.features[0].properties.segments[0].distance / 1000;
            return Math.round(distanceInKm);
        }
        throw new Error('Errore nel calcolo della distanza');
    } catch (error) {
        console.error('Errore:', error);
        return 0;
    }
}

function addRowToTable(city, distance) {
    const table = document.getElementById('cityTable');
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    cell1.innerHTML = city;
    cell2.innerHTML = distance.toFixed(0);
    cell3.innerHTML = calculateHoursForDistance(distance);
    cell4.innerHTML = '<button class="btn btn-delete2" style="z-index: auto;" onclick="deleteRow(this)">Rimuovi</button>';
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const index = row.rowIndex - 1;

    // Mostra il loader prima di iniziare le operazioni
    document.getElementById('loader').style.display = 'flex';

    cities.splice(index, 1);

    for (let i = 1; i < cities.length; i++) {
        if (cities[i].name === cities[i-1].name) {
            cities.splice(i, 1);
            i--;
        }
    }

    if (cities.length > 0) {
        lastCity = cities[cities.length - 1];
    } else {
        lastCity = null;
    }

    row.parentNode.removeChild(row);
    
    // Ricalcola le distanze e nascondi il loader quando finito
    recalculateDistances().finally(() => {
        document.getElementById('loader').style.display = 'none';
    });
    
    updateButtonsState();
}

async function recalculateDistances() {
    totalKm = 0;
    const table = document.getElementById('cityTable');
    table.innerHTML = '';

    try {
        for (let i = 0; i < cities.length; i++) {
            if (i === 0) {
                addRowToTable(cities[i].name, 0);
            } else {
                const distance = await calculateDistance(cities[i - 1].coords, cities[i].coords);
                addRowToTable(cities[i].name, distance);
                totalKm += distance;
            }
        }

        updateTotalKm();
        calculateMinimumDays();
    } catch (error) {
        console.error('Errore nel ricalcolo delle distanze:', error);
    }
}

function updateTotalKm() {
    calculateTotalKm();
}

function calculateHoursForDistance(distance) {
    const speed = document.getElementById('averageSpeed').value;
    if (speed > 0 && distance > 0) {
        const hours = Math.ceil(distance / speed);
        return hours;
    }
    return '0';
}

function calculateHours() {
    const table = document.getElementById('cityTable');
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const distance = parseFloat(rows[i].cells[1].innerHTML);
        rows[i].cells[2].innerHTML = calculateHoursForDistance(distance);
    }
    
    calculateMinimumDays();
}

function calculateTotalKm() {
    const roundTrip = document.getElementById('roundTrip').checked;
    let displayTotalKm = totalKm;
    
    if (roundTrip) {
        displayTotalKm = totalKm * 2;
    }
    
    document.getElementById('totalKm').innerText = displayTotalKm.toFixed(0);
    
    const days = parseInt(document.getElementById('days').innerText);
    if (days > 0) {
        const average = displayTotalKm / days;
        document.getElementById('averageKm').innerText = average.toFixed(0);
    } else {
        document.getElementById('averageKm').innerText = '0';
    }
    
    calculateMinimumDays();
}

function calculateMinimumDays() {
    let totalHours = 0;
    const table = document.getElementById('cityTable');
    const rows = table.rows;
    
    for (let i = 1; i < rows.length; i++) {
        const hours = parseInt(rows[i].cells[2].innerHTML);
        totalHours += hours;
    }
    
    const roundTrip = document.getElementById('roundTrip').checked;
    if (roundTrip) {
        totalHours *= 2;
    }
    
    const minimumDays = Math.ceil(totalHours / 8);
    
    const averageDayElement = document.getElementById('averageDay');
    averageDayElement.innerText = minimumDays > 0 ? minimumDays : '0';
    
    const visaDays = parseInt(document.getElementById('days').innerText);
    
    if (minimumDays > visaDays) {
        averageDayElement.style.color = '#dc3545';
    } else {
        averageDayElement.style.color = '';
    }
}

function openGoogleMaps() {
    let mapUrl = gmapsUrl;
    
    for (let i = 0; i < cities.length; i++) {
        mapUrl += encodeURIComponent(cities[i].name) + "/";
    }
    
    mapUrl = mapUrl.slice(0, -1);
    window.open(mapUrl, '_blank');
}

function updateButtonsState() {
    const googleMapsBtn = document.getElementById('viewOnGoogleMaps');
    const excelBtn = document.getElementById('exportToExcel');
    
    if (cities.length >= 2) {
        if (googleMapsBtn) googleMapsBtn.disabled = false;
        if (excelBtn) excelBtn.disabled = false;
    } else {
        if (googleMapsBtn) googleMapsBtn.disabled = true;
        if (excelBtn) excelBtn.disabled = true;
    }
}

// Inizializza la pagina transiberiana se siamo nella pagina corretta
document.addEventListener('DOMContentLoaded', initTransiberianPage);
//=================== transiberian script end ===================

//=================== translate script start ===================
async function translateContent() {
  const articleContent = document.querySelector('.content.drop-cap');
  const translateBtn = document.querySelector('button[onclick="translateContent()"]');
  
  if (!articleContent) {
    console.error('Elemento .content.drop-cap non trovato');
    return;
  }
  
  const isTranslated = articleContent.classList.contains('translated');
  
  if (!isTranslated) {
    // Mostra il loader
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Trad...</span><span class="text-primary d-none d-md-inline-block">Translating...</span>';
    translateBtn.disabled = true;
    
    // Salva il contenuto originale
    articleContent.setAttribute('data-original-content', articleContent.innerHTML);
    
    // Traduci il contenuto preservando la struttura HTML
    const elements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, figcaption');
    // Aggiungiamo anche il titolo dell'articolo
    const title = document.querySelector('h3.mb-4');
    if (title) {
      elements.push(title);
    }
    
    // Funzione per tradurre un singolo nodo
    async function translateNode(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        // Preserva gli spazi prima e dopo
        const leadingSpace = node.textContent.match(/^\s+/)?.[0] || '';
        const trailingSpace = node.textContent.match(/\s+$/)?.[0] || '';
        const text = node.textContent.trim();
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          let translatedText = data[0].map(item => item[0]).join('');
          
          // Ripristina gli spazi
          translatedText = leadingSpace + translatedText + trailingSpace;
          
          // Preserva la capitalizzazione originale
          if (text[0] !== text[0].toUpperCase()) {
            translatedText = translatedText.charAt(0).toLowerCase() + translatedText.slice(1);
          }
          
          node.textContent = translatedText;
        } catch (error) {
          console.error('Errore nella traduzione:', error);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Se è un elemento, processa i suoi figli
        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
          await translateNode(child);
        }
      }
    }
    
    // Traduci tutti gli elementi
    for (const element of elements) {
      if (element.textContent.trim() !== '') {
        // Crea una copia temporanea dell'elemento
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        
        // Traduci il contenuto
        await translateNode(tempDiv);
        
        // Aggiorna l'elemento originale mantenendo la struttura HTML
        element.innerHTML = tempDiv.innerHTML;
      }
    }
    
    articleContent.classList.add('translated');
    translateBtn.disabled = false;
    translateBtn.innerHTML = '<i class="fas fa-language me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Orig.</span><span class="text-primary d-none d-md-inline-block">View original</span>';
  } else {
    // Mostra il loader
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Ripr...</span><span class="text-primary d-none d-md-inline-block">Restoring...</span>';
    translateBtn.disabled = true;
    
    // Ripristina il contenuto originale
    articleContent.innerHTML = articleContent.getAttribute('data-original-content');
    articleContent.classList.remove('translated');
    
    translateBtn.disabled = false;
    translateBtn.innerHTML = '<i class="fas fa-language me-2 text-primary"></i><span class="text-primary d-inline-block d-md-none">Trad.</span><span class="text-primary d-none d-md-inline-block">Translate to English</span>';
  }
}
//=================== translate script end ===================

//=================== newsletter script start ===================
function handleSubscribe(event) {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  const encodedEmail = encodeURIComponent(email);
  window.open(`https://vandipety.substack.com/subscribe?just_signed_up=true&skip_redirect_check=true&utm_medium=web&utm_source=embed&freeSignupEmail=${encodedEmail}`, '_blank');
}
//=================== newsletter script end ===================

//=================== blog footer script start ===================
function shareOnSocial(platform) {
    const title = document.querySelector('h1')?.textContent || document.title;
    const url = window.location.href;
    const platforms = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(title)}%20-%20${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    };
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copiato negli appunti!');
        });
        return false;
    }
    
    window.open(platforms[platform], '_blank');
    return false;
}

let modalid = '#satispay';
function openModal() {
    const modal = document.querySelector(modalid);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector(modalid);
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}
//=================== blog footer script end ===================

//=================== lazy loading iframe script start ===================
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        observer.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('iframe[data-src]').forEach(iframe => {
    observer.observe(iframe);
  });
});
//=================== lazy loading iframe script end ===================

//=================== youtube video script start ===================
// Funzione per ottenere l'anteprima del primo video pubblico di una playlist
async function getFirstPublicVideoThumbnail(playlistId, apiKey, facade) {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
    const data = await response.json();
    
    if (data.items) {
      const publicVideo = data.items.find(item => item.status && item.status.privacyStatus === 'public');
      
      if (publicVideo) {
        const videoId = publicVideo.snippet.resourceId.videoId;
        const thumbnailUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;
        const fallbackUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        const img = new Image();
        img.onload = function() {
          if (facade) {
            facade.style.backgroundImage = `url('${thumbnailUrl}')`;
          }
        };
        img.onerror = function() {
          if (facade) {
            facade.style.backgroundImage = `url('${fallbackUrl}')`;
          }
        };
        img.src = thumbnailUrl;
      } else {
        console.log('Nessun video pubblico trovato nella playlist');
      }
    }
  } catch (error) {
    console.error('Errore nel caricamento dell\'anteprima:', error);
  }
}

// Funzione per gestire il click sul video
function handleVideoClick(facade, iframeContainer, iframe, videoId, isPlaylist) {
  facade.style.opacity = '0';
  facade.style.transition = 'opacity 0.3s ease-in-out';
  
  iframeContainer.style.opacity = '1';
  iframeContainer.style.pointerEvents = 'auto';
  
  if (isPlaylist) {
    iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${videoId}&autoplay=1`;
  } else {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  }
  
  setTimeout(() => {
    facade.style.display = 'none';
  }, 300);
}

// Inizializzazione dei video YouTube
document.addEventListener('DOMContentLoaded', function() {
  // Gestione dei video singoli
  const youtubeFacades = document.querySelectorAll('.youtube-facade[data-video-id]');
  
  youtubeFacades.forEach(facade => {
    if (!facade) return;
    
    const videoId = facade.dataset.videoId;
    const isPlaylist = facade.dataset.isPlaylist === 'true';
    const apiKey = facade.dataset.apiKey;
    const uniqueId = facade.id.split('-')[2];
    
    const iframe = document.getElementById(`iframe-${uniqueId}`);
    const iframeContainer = document.getElementById(`youtube-iframe-${uniqueId}`);
    
    if (!iframe || !iframeContainer) return;
    
    if (isPlaylist) {
      getFirstPublicVideoThumbnail(videoId, apiKey, facade);
    }
    
    facade.addEventListener('click', function(e) {
      e.preventDefault();
      handleVideoClick(facade, iframeContainer, iframe, videoId, isPlaylist);
    });
  });

  // Gestione del widget YouTube
  const youtubeWidget = document.querySelector('.widget.newsletter-widget .youtube-facade');
  const youtubeWidgetIframe = document.querySelector('.widget.newsletter-widget .youtube-iframe iframe');
  const youtubeWidgetIframeContainer = document.querySelector('.widget.newsletter-widget .youtube-iframe');
  
  if (youtubeWidget && youtubeWidgetIframe && youtubeWidgetIframeContainer) {
    const playlistId = 'PLHaclq_J5PZ_gu1kNkYx-mEQPchUK3Wzh';
    const apiKey = 'AIzaSyB-m8BmXqPNdNSyTanaww8Uv51TzXKzsqU';
    
    getFirstPublicVideoThumbnail(playlistId, apiKey, youtubeWidget);
    
    youtubeWidget.addEventListener('click', function(e) {
      e.preventDefault();
      handleVideoClick(youtubeWidget, youtubeWidgetIframeContainer, youtubeWidgetIframe, playlistId, true);
    });
  }
});
//=================== youtube video script end ===================

  