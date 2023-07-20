export function setPlaceholderText() {
    const input = document.getElementById("searchBar__text");
    window.innerWidth < 400 ? (input.placeholder = "City, State, Country") : (input.placeholder = "City, State, Country, or ZIP Code");
}

export function addSpinner(element) {
    animateButton(element);
    // 1st arg: method, 2nd arg: ms, 3rd arg: argument to pass
    setTimeout(animateButton, 1000, element); 

}

// hide element and show spinning sync icon
function animateButton(element) {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("none");
}

export function displayError(headerMsg) {
    updateWeatherLocationHeader(headerMsg);
}

export function displayApiError(statusCode) {
    const properMsg = toProperCase(statusCode.message);
    updateWeatherLocationHeader(properMsg);
}

function toProperCase(text) {
    const words = text.split(" ");
    const properWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
    return properWords.join(" ");
}

function updateWeatherLocationHeader(headerMsg) {
    document.getElementById("currentForecast__location").innerText = headerMsg;
}
