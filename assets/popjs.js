mapboxgl.accessToken = 'pk.eyJ1IjoibWpiYWUxMSIsImEiOiJjbGp3OGRuMHUwYmV0M2twZmJscWwxZHlpIn0.0SDusUkb8Bvmn_NkOseR3w';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/state_data.geojson');
    let stateData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('stateData', {
            type: 'geojson',
            data: stateData
        });
    
        map.addLayer({
            'id': 'stateData-layer',
            'type': 'fill',
            'source': 'stateData',
            'paint': {
                'fill-color': [
                    'step',      // use step expression to provide fill color based on values
                    
                    ['get', 'density'],  // get the density attribute from the data
                    
                    '#FFEDA0',   // use color #FFEDA0
                    10,          // if density < 10
                    
                    '#FED976',   // use color #FED976
                    20,          // if 10 <= density < 20
                    
                    '#FEB24C',   // use color #FEB24C
                    50,          // if 20 <= density < 50
                    
                    '#FD8D3C',   // use color #FD8D3C
                    100,         // if 50 <= density < 100
                    
                    '#FC4E2A',   // use color #FC4E2A
                    200,         // if 100 <= density < 200
                    
                    '#E31A1C',   // use color #E31A1C
                    500,         // if 200 <= density < 500
                    
                    '#BD0026',   // use color #BD0026
                    1000,        // if 500 <= density < 1000
                    
                    "#800026"    // use color #800026 if 1000 <= density
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });

 
}

geojsonFetch();

const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '200-499',
    '500-999',
    '1000 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];

// create legend
const legend = document.getElementById('legend');
legend.innerHTML = "<b>Population Density<br>(people/sq.mi.)</b><br><br>";

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
        layers: ['stateData-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.name}</h3><p><strong><em>${state[0].properties.density}</strong> people per square mile</em></p>` :
        `<p>Hover over a state!</p>`;
});
