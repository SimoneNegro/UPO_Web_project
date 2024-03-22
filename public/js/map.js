// map initialization
var map = L.map('map').setView([45.3275748,8.4245634,17], 17); // Imposta la posizione e lo zoom iniziale
    
// add map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add map position
L.marker([45.3275748,8.4245634,17]).addTo(map);

// add popup
L.marker([45.3275748,8.4245634,17]).addTo(map)
    .bindPopup('We are here!')
    .openPopup();