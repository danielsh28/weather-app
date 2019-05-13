'use strict';
//import * as L from 'leaflet';
const INITIAL_VIEW = [22.395793, -29.391974];
const MAP_ZOOM = 2;
const OPEN_WEATHER_BASE_URL= 'https://api.openweathermap.org/data/2.5/weather?q=' ;
const  API_KEY ='b8f8c2d097af436ae72b9746eaa82598';
const weatherMap = L.map('myMap').setView(INITIAL_VIEW, MAP_ZOOM);
/*weather details for cached city*/
class CachedDetails {
    constructor(desc, wind,temp,hum){
        this._desc = desc;
        this._wind=wind;
        this._temp = temp;
        this._hum = hum;
    }
    get desc(){
        return this._desc;
    }
    get wind(){
        return this._wind;
    }
    get temp(){
        return this._temp;
    }
    get hum(){
        return this._hum;
    }

}
/*class for city map representation*/
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
    get marker(){
        return this._marker;
    }

    setIconMarker(icon){
        this.marker.setIcon(icon);

    }

    get coor(){
        return this._coor;
    }
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGFuaWVsc2gyOCIsImEiOiJjanV2bHBrbHIwMnRxM3luNW9raTNwdTZ6In0.BmV0eVG2HigsTrP0EemcwA'
}).addTo(weatherMap);
const defMarker = new L.Icon.Default();
const choosenIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]

});
/* map saving city deatils for the map element and dom manipulation*/
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
const cacheMap = new Map();
let lastSelectedCity = null;
document.querySelector('#cityName').addEventListener('change',loadDetails);
cityMap.forEach(city=> city.marker.on('click',loadDetails.bind(city)));

function loadDetails(){
    let chosenCity =  this;
    if(chosenCity.constructor.name === 'HTMLSelectElement'){
        chosenCity=cityMap.get(document.querySelector('#cityName').value);

    }
    else{
        document.querySelector('#cityName').value=chosenCity.name;
    }
    if(chosenCity && chosenCity.name !=='init') {
        let cachedItem =cacheMap.get(chosenCity.name);
        /*if city is in already cached' take details from cach map, if not, fetch from api*/
        if(!cachedItem){
            fetch(`${OPEN_WEATHER_BASE_URL}${chosenCity.name}&appid=${API_KEY}`)
                .then((res) => res.json())
                .then((jsonObj) => {
                    const newCachedItem = new CachedDetails(jsonObj.weather[0].description,`Speed of ${jsonObj.wind.speed} 
                    and degrees of ${jsonObj.wind.deg}`,jsonObj.main.temp,jsonObj.main.humidity + '%');
                    cacheMap.set(chosenCity.name,newCachedItem);
                    cachedItem = newCachedItem;
                    renderDetails(cachedItem);
                });
        }
        else{
            renderDetails(cachedItem);
        }

        if (lastSelectedCity) {
            lastSelectedCity.setIconMarker(defMarker);
        }
        chosenCity.setIconMarker(choosenIcon);
        lastSelectedCity = chosenCity;
        weatherMap.setView(chosenCity.coor,7);
    }
}

function renderDetails(cachedItem){
    document.querySelector('#wind').innerHTML = cachedItem.wind;
    document.querySelector('#desc').innerHTML =cachedItem.desc;
    document.querySelector('#temp').innerHTML = cachedItem.temp;
    document.querySelector('#humi').innerHTML = cachedItem.hum;
}