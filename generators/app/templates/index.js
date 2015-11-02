/* globals Ractive, _, Markers, L */

(function() {
    var options = {};
    options.el = document.querySelector('#container');
    options.template = '#template';
    options.data = {
        events: true
    };

    _.extend(options.components, Ractive.components);
    _.extend(options.computed, {
    });

    var ractive = new Ractive(options);

    ractive.on('thing', function(evt) {
    });

    var centre = [ -33.785, 151.121 ];
    var map = L.map('map').setView(centre, 16);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © ' +
            '<a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ivanwills.cifvcpu18233zt5lyrpbtaau4',
        accessToken: 'pk.eyJ1IjoiaXZhbndpbGxzIiwiYSI6ImNpZnZjcHZzNTIyeTF1N2x4YmlveHgyYTMifQ.24HDwqrrCD8E_YHhCvF_kg'
    }).addTo(map);

    var markers;
    markers = new Markers(map, centre, ractive);
})();
