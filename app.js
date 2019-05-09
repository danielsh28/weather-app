'use strict';
const OPEN_WEATHER_BASE_URL= 'https://api.openweathermap.org/data/2.5/weather?q=' ;
const  API_KEY ='b8f8c2d097af436ae72b9746eaa82598';
const weatherMap = L.map('myMap').setView([22.395793, -29.391974], 2);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFuaWVsc2gyOCIsImEiOiJjanV2bHBrbHIwMnRxM3luNW9raTNwdTZ6In0.BmV0eVG2HigsTrP0EemcwA'
}).addTo(weatherMap);

document.querySelector('#cityName').addEventListener('change',loadDetails);
const coorMap = {
    jerusalem: [31.796,35.175],
    newYork:[40.697150,-73.979635],
    toronto:[43.718006,-79.376246],
    miami:[25.782440,-80.229459 ],
    madrid:[40.478058,-3.703435],
    paris:[48.858884,2.346941],
    berlin:[52.507208,13.424755],
    barcelona:[41.390205,2.154007],
    moscow:[55.725054,37.628965]
};
const defMarker = new L.Icon.Default();
let cityMarkers =  new Map();
for(let coor in coorMap){
    cityMarkers.set(coor,L.marker(coorMap[coor]).addTo(weatherMap));
}
let lastSelectedCity = null;



function loadDetails(){
    const cityName =document.querySelector('#cityName').value;
    if(cityName !=='init') {
        const selectedOption = document.querySelector('#cityName').options[document.querySelector('#cityName').selectedIndex].id;
        const choosenIcon = L.icon({
            iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            iconSize:    [25, 41],
            iconAnchor:  [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize:  [41, 41]

        });
        fetch(`${OPEN_WEATHER_BASE_URL}${cityName}&appid=${API_KEY}`).then((res) => res.json()).then((jsonObj) => {
            document.querySelector('#desc').innerHTML = jsonObj.weather[0].description;
            document.querySelector('#wind').innerHTML = `Speed of ${jsonObj.wind.speed} and degrees of ${jsonObj.wind.deg}`;
            document.querySelector('#temp').innerHTML = jsonObj.main.temp;
            document.querySelector('#humi').innerHTML = jsonObj.main.humidity + '%';
        });
        if (lastSelectedCity) {
            cityMarkers.get(lastSelectedCity).setIcon(defMarker);
        }
        cityMarkers.get(selectedOption).setIcon(choosenIcon);
        lastSelectedCity = selectedOption;
    }
}