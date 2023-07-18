mapboxgl.accessToken = 'pk.eyJ1IjoibWpiYWUxMSIsImEiOiJjbGp3OGRuMHUwYmV0M2twZmJscWwxZHlpIn0.0SDusUkb8Bvmn_NkOseR3w';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6.3, // starting zoom
        center: [-120, 47] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let covidData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('covidData', {
            type: 'geojson',
            data: covidData
        });
    
        map.addLayer({
            'id': 'covidData-layer',
            'type': 'fill',
            'source': 'covidData',
            'paint': {
                'fill-color': [
                    'step',      // use step expression to provide fill color based on values
                    
                    ['get', 'fullyVaxPer10k'],  // get the density attribute from the data
                    
                    '#FFF4CC',   // use color #FFEDA0
                    4000,          // if density < 10
                    
                    '#FFED99',   // use color #FED976
                    4500,          // if 10 <= density < 20
                    
                    '#FFE066',   // use color #FEB24C
                    5000,          // if 20 <= density < 50
                    
                    '#FFD633',   // use color #FD8D3C
                    5500,         // if 50 <= density < 100
                    
                    '#C2FFAE',   // use color #FC4E2A
                    6000,         // if 100 <= density < 200
                    
                    '#9EFF80',   // use color #E31A1C
                    6500,         // if 200 <= density < 500
                    
                    '#66CC52',   // use color #BD0026
                    7000,        // if 500 <= density < 1000
                    
                    "#39A346"    // use color #800026 if 1000 <= density
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });

 
}

geojsonFetch();

const layers = [
    '0-3999',
    '4000-4499',
    '4500-4999',
    '5000-5499',
    '5500-5999',
    '6000-6499',
    '6500-6999',
    '7000 and more'
];
const colors = [
    '#FFF4CC',
    '#FFED99',
    '#FFE066',
    '#FFD633',
    '#C2FFAE',
    '#9EFF80',
    '#66CC52',
    "#39A346"
];

// create legend
const legend = document.getElementById('legend');
legend.innerHTML = "<b>Fully vaccinated people per 10k<br>(COVID-19)</b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

// information box does something according if its floating over a state or not
map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.fullyVaxPer10k}</strong> fully vaccinated people</em></p>` :
        `<p>Hover over a state!</p>`;
});
