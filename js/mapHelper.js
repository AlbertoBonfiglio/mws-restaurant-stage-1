
const mapToken = 'pk.eyJ1IjoiYWxiZXJ0b2JvbmZpZ2xpbyIsImEiOiJjanVsamJocXMyN29xM3lwNHpkNWt3OHpoIn0.Iuu6SZ8YMlT_yhF_1ChkeA';

mapHelper = (center = [40.722216, -73.987501], zoom = 12 ) => {
    map = L.map('map', {
        center: center,
        zoom: zoom,
        scrollWheelZoom: false
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: mapToken,
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    })
    .addTo(map);

    return map;
}