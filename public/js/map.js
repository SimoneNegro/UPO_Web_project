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
    .bindPopup('<a target="_blank" class="link" href="https://www.google.com/maps/place/Universit%C3%A0+del+Piemonte+Orientale/@45.3275748,8.4245634,17z/data=!3m1!4b1!4m6!3m5!1s0x47864c626c933e6d:0xc116d521421655da!8m2!3d45.3275748!4d8.4245634!16zL20vMGN0bWxw?entry=ttu">We are here!<a>')
    .openPopup();