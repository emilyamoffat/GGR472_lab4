document.addEventListener('DOMContentLoaded', () => {
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
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-79.39, 43.65],
        zoom: 11
    });

    /*--------------------------------------------------------------------
    Step 2: VIEW GEOJSON POINT DATA ON MAP
    --------------------------------------------------------------------*/
    //HINT: Create an empty variable
    //      Use the fetch method to access the GeoJSON from your online repository
    //      Convert the response to JSON format and then store the response in your new variable
    map.on('load', () => {
        // Fetch the GeoJSON data
        fetch('https://raw.githubusercontent.com/emilyamoffat/GGR472_lab4/main/pedcyc_collision_06-21_v2.geojson')
            .then(response => response.json())
            .then(collision_data => {
                console.log('Collision data:', collision_data);

    /*--------------------------------------------------------------------
        Step 3: CREATE BOUNDING BOX AND HEXGRID
    --------------------------------------------------------------------*/
    //HINT: All code to create and view the hexgrid will go inside a map load event handler
    //      First create a bounding box around the collision point data
    //      Access and store the bounding box coordinates as an array variable
    //      Use bounding box coordinates as argument in the turf hexgrid function
    //      **Option: You may want to consider how to increase the size of your bbox to enable greater geog coverage of your hexgrid
    //                Consider return types from different turf functions and required argument types carefully here

                let bbox = turf.bbox(collision_data);
                console.log('Bounding box:', bbox);

                let hexgrid = turf.hexGrid(bbox, 0.5, { units: 'kilometers' });
                console.log('Hexgrid:', hexgrid);

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
                        'fill-color': [
                            'step',
                            ['get', 'collision_count'],
                            '#FFEDA0', // 0 collisions
                            1, '#FED976', // 1-10 collisions
                            10, '#FEB24C', //  11-20 collisions
                            20, '#FD8D3C', // 21-50 collisions
                            50, '#FC4E2A', // 51-100 collisions
                        ],
                        'fill-outline-color': 'rgba(0, 0, 0, 1)',
                        'fill-opacity': 0.6
                    }
                });

    /*--------------------------------------------------------------------
    Step 4: AGGREGATE COLLISIONS BY HEXGRID
    --------------------------------------------------------------------*/
    //HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
    //      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty
                hexgrid.features.forEach(hex => {
                    const pointsInHex = turf.pointsWithinPolygon(collision_data, hex);
                    hex.properties.collision_count = pointsInHex.features.length || 0;
                });

                map.getSource('hexgrid').setData(hexgrid);

                map.on('click', 'hexgrid', (e) => {
                    const count = e.features[0].properties.collision_count || 0;
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<strong>Collisions:</strong> ${count}`)
                        .addTo(map);
                });
            });
    });

    /*--------------------------------------------------------------------
    // Step 5: FINALIZE YOUR WEB MAP
    // --------------------------------------------------------------------*/
    //HINT: Think about the display of your data and usability of your web map.
    //      Update the addlayer paint properties for your hexgrid using:
    //        - an expression
    //        - The COUNT attribute
    //        - The maximum number of collisions found in a hexagon
    //      Add a legend and additional functionality including pop-up windows

    // Add event listener to toggle hexgrid layer
    document.getElementById('toggle-hexgrid').addEventListener('click', () => {
        const visibility = map.getLayoutProperty('hexgrid', 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty('hexgrid', 'visibility', 'none');
        } else {
            map.setLayoutProperty('hexgrid', 'visibility', 'visible');
        }
    });
});
