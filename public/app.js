'use strict';
const OPEN_WEATHER_BASE_URL= 'https://api.openweathermap.org/data/2.5/weather?q=' ;
const  API_KEY ='b8f8c2d097af436ae72b9746eaa82598';
//import *  as  L from  'leaflet';
const weatherMap = L.map('myMap').setView([22.395793, -29.391974], 2);
class City {
   constructor(name, coor,icon) {
   this._name = name;
   this._coor = coor;
   this._icon = icon;
   this._marker = L.marker(coor);
   this._marker.addTo(weatherMap);

   }
   get name(){
       return this._name;
}

    get coor(){
        return this._coor;
    }

    get icon(){
       return this._icon;
    }

    get marker(){
       return this._marker;
    }

    setIconMarker(icon){
       this.marker.setIcon(icon);

    }
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFuaWVsc2gyOCIsImEiOiJjanV2bHBrbHIwMnRxM3luNW9raTNwdTZ6In0.BmV0eVG2HigsTrP0EemcwA'
}).addTo(weatherMap);



const defMarker = new L.Icon.Default();
document.querySelector('#cityName').addEventListener('change',loadDetails);
const choosenIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]

});

const cityMap = new Map();
    cityMap.set('jerusalem', new City('jerusalem', [31.796,35.175]));
    cityMap.set('new york' , new City('new york',[40.697150,-73.979635]));
    cityMap.set('toronto', new City('toronto',[43.718006,-79.376246]));
    cityMap.set('miami' , new City('miami',[25.782440,-80.229459 ]));
    cityMap.set('madrid' , new City('madrid',[40.478058,-3.703435]));
    cityMap.set('paris' , new City('paris',[48.858884,2.346941]));
    cityMap.set('berlin' , new City('berlin',[52.507208,13.424755]));
    cityMap.set('barcelona' ,new City('barcelona',[41.390205,2.154007]));
    cityMap.set('moscow' , new City('moscow',[55.725054,37.628965]));

let lastSelectedCity = null;

function loadDetails(){
    const chosenCity =cityMap.get(document.querySelector('#cityName').value);
    if(chosenCity.name !=='init') {
        fetch(`${OPEN_WEATHER_BASE_URL}${chosenCity.name}&appid=${API_KEY}`).then((res) => res.json()).then((jsonObj) => {
            document.querySelector('#desc').innerHTML = jsonObj.weather[0].description;
            document.querySelector('#wind').innerHTML = `Speed of ${jsonObj.wind.speed} and degrees of ${jsonObj.wind.deg}`;
            document.querySelector('#temp').innerHTML = jsonObj.main.temp;
            document.querySelector('#humi').innerHTML = jsonObj.main.humidity + '%';
        });
        if (lastSelectedCity) {
            lastSelectedCity.setIconMarker(defMarker);
        }
        chosenCity.setIconMarker(choosenIcon);
        lastSelectedCity = chosenCity;
    }
}