const WEATHER_API_KEY = '487d2758d844312f079bdc2e0f27c820';
const METEO_API_KEY = 'vyvlrzxbaqne5mp2fl1ztg8qyt9wgbqcma1m1kct';

export function setLocationObject(locationObj, coordsObj) {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.setUnit(unit);
    }
}

export function getHomeLocation() {
    // get home location from local storage
    return localStorage.getItem("defaultWeatherLocation");
}

export function cleanText(text) {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, ' ').trim();
    return entryText;
}

export async function getWeatherFromCoords(locationObj) {
    const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const unit = locationObj.getUnit();
    const url = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=all&timezone=UTC&language=en&units=metric&key=${METEO_API_KEY}`;
    try {
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return weatherJson;
    } catch (err) {
        console.log("error!");
        console.error(err);
    }
}

export async function getCoordsFromApi(entryText, units) {
    const regex = /^\d+$/g;
    const flag = regex.test(entryText) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedUrl = encodeURI(url);
    try {
        const dataStream = await fetch(encodedUrl);
        const jsonData = await dataStream.json();
        return jsonData;
    }
    catch {
        console.error(err.stack);
    }
}