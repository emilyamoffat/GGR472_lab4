/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlhbW9mZmF0IiwiYSI6ImNtNmI0d3puaTA0dG0yam84dzNiZTQ5NjIifQ.A1PSOyaJV6TF-lKcIFMHQA';

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 11 // starting zoom level
});

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
// Fetch the GeoJSON data
fetch('https://raw.githubusercontent.com/emilyamoffat/GGR472_lab4/blob/main/pedcyc_collision_06-21_v2.geojson')
https://github.com/
    .then(response => response.json())
    .then(collision_data => {
        console.log(collision_data);

        /*--------------------------------------------------------------------
        Step 3: CREATE BOUNDING BOX AND HEXGRID
        --------------------------------------------------------------------*/
        // Create a bounding box around the collision point data
        let bbox = turf.bbox(collision_data);
        let hexgrid = turf.hexGrid(bbox, 0.05, {units: 'kilometers'});  
        console.log(hexgrid);

        map.on('load', function() {
            map.addSource('hexgrid', {
                'type': 'geojson',
                'data': hexgrid
            });

            map.addLayer({
                'id': 'hexgrid',
                'type': 'fill',
                'source': 'hexgrid',
                'layout': {},
                'paint': {
                    'fill-color': 'rgba(0, 0, 0, 0)',
                    'fill-outline-color': 'rgba(0, 0, 0, 1)'
                }
            });
        });

        /*--------------------------------------------------------------------
        Step 4: AGGREGATE COLLISIONS BY HEXGRID
        --------------------------------------------------------------------*/
        // Use Turf collect function to collect all '_id' properties from the collision points data for each hexagon
        // View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty
    });

/*--------------------------------------------------------------------
Step 5: FINALIZE YOUR WEB MAP
--------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows


