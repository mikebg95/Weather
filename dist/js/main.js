import { setPlaceholderText, addSpinner, displayError, displayApiError } from "./domFunctions.js";
import { setLocationObject, getHomeLocation, cleanText, getCoordsFromApi, getWeatherFromCoords } from "./dataFunctions.js";

import CurrentLocation from "./CurrentLocation.js";

const currentLoc = new CurrentLocation();
const savedLoc = new CurrentLocation();

let count = 0;

function initApp() {
    const locationBtn = document.getElementById("getLocation");
    const homeBtn = document.getElementById("home");
    const saveBtn = document.getElementById("saveLocation");
    const unitBtn = document.getElementById("unit");
    const refreshBtn = document.getElementById("refresh");
    const locationEntry = document.getElementById("searchBar__form");

    locationBtn.addEventListener("click", function() {
        addSpinner(document.querySelector(".fa-map-marker-alt"));
        getWeather(); // retrieve weather for current location and display
    });
    homeBtn.addEventListener("click", function() {
        addSpinner(document.querySelector(".fa-home"));
        loadWeather(); // 
    });
    saveBtn.addEventListener("click", function() {
        addSpinner(document.querySelector(".fa-save"));
        saveLocation(); // save location weather in localstorage
    });
    unitBtn.addEventListener("click", function() {
        addSpinner(document.querySelector(".fa-chart-bar"));
        setUnitPreferences(); // change units from metric to imperial or vice versa
    });
    refreshBtn.addEventListener("click", function() {
        addSpinner(document.querySelector(".fa-sync-alt"));
        refreshWeather();
    });
    locationEntry.addEventListener("submit", function() {
        event.preventDefault();
        submitNewLocation();
    });

    // set up
    setPlaceholderText();

    // TODO: pause buttons & clicks etc until loaded
    loadWeather();
}

document.addEventListener("DOMContentLoaded", initApp);


// METHODS

// gets weather from current location
function getWeather(event) {
    if (!navigator.geolocation) geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

// if failed, display error
function geoError(errorObj) { 
    let message = errorObj.message ? errorObj.message : "Geolocation not supported.";
    console.log("geo-error: "+ message);
    displayError(message);
}

// if success, display weather
function geoSuccess(position) {
    // get object coordinates and create location object
    const myCoordsObj = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };

    // set local object
    setLocationObject(currentLoc, myCoordsObj);

    // update data and display
    updateDataAndDisplay(currentLoc);
}

// show weather 
function loadWeather(event) {
    // first look for saved location
    const savedLocation = getHomeLocation();

    // starting up and no saved location
    if (!savedLocation && !event) {
        console.log("no saved location...");
        return getWeather();
    }

    // clicked and no saved location
    else if (!savedLocation && event.type === "click") {
        displayError("No Home Location Saved");
    }

    // starting up and saved location
    else if (savedLocation && !event) {
        displayHomeLocationWeather(savedLocation);
    }

    // if there is a saved location and home btn is clicked
    else {
        displayHomeLocationWeather(savedLocation);
    }
}

function saveLocation(event) {
    // if location, save location
    if (currentLoc.getLat() && currentLoc.getLon()) {
        const location = {
            name: currentLoc.getName(),
            lat: currentLoc.getLat(),
            lon: currentLoc.getLon(),
            unit: currentLoc.getUnit()
        };

        // save in localstorage
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    }

    // if no location, give error
    else {
        displayError("No current location to save.");
    }
}

function setUnitPreferences() {
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
}

function refreshWeather() {
    updateDataAndDisplay(currentLoc);
}

async function submitNewLocation(event) {
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    if (!entryText.length) return;

    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());

    console.log(coordsData);

    if (coordsData) {
        if (coordsData.cod === 200) {
        // work with api data
        const myCoordsObj = {};
        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
    }
        // no api success
        else {
            displayApiError(coordsData);
        }
    }
    else {
        displayError("Connection Error");
    }
    
}

function displayHomeLocationWeather(home) {
    console.log("saved location: " + home);
    console.log("displaying home location weather... (TODO)");
    if (typeof home === "string") {
        const locationJson = JSON.parse(home);
        const myCoordsObj = {
            lat: locationJson.lat,
            lon: locationJson.lon,
            name: locationJson.name, 
            unit: locationJson.unit,
        };
        setLocationObject(currentLoc, myCoordsObj);

        // console.log(currentLoc);

    }

    const icon = document.getElementById("icon");
    const temp = document.querySelector(".temp");
    const desc = document.querySelector(".desc");
    const feels = document.querySelector(".feels");
    const maxTemp = document.querySelector(".maxTemp");
    const minTemp = document.querySelector(".minTemp");
    const humidity = document.querySelector(".humidity");
    const wind = document.querySelector(".wind");
}

async function updateDataAndDisplay(locationObj) {
    console.log("updateDataAndDisplay");
    const weatherJson = await getWeatherFromCoords(locationObj);
    console.log(weatherJson);
}