// variables delcared
var arr = []
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#cityForm');
var appKey = 'a26ac396e4c0182dc353be1f247139e9';
var city;
var unit = 'imperial';
var cityURL;
var forecastURL;
var lat = 35;
var lon = -80;
var uvURL;
var symURL;
var symi
var symiURL

// Fires when form is submitted. Takes in city the user inputs and assigns it to the URL
var formSubmitHandler = function (event) {
    event.preventDefault();

    city = cityInputEl.value;
    storeHistory();
    init();
    cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + appKey + '&units=' + unit;
    forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + appKey + '&units=' + unit;
    fetchCity();
};

// fetches city weather information
function fetchCity() {
    fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // variables
            var cityEl = document.querySelector('#city');
            var weatherEl = document.querySelector('#weather');
            var humidityEl = document.querySelector('#humidity');
            var windEl = document.querySelector('#wind');
            // change the text content to reflect accurate information and date
            cityEl.textContent = city.charAt(0).toUpperCase() + city.slice(1) + " " + moment().format('MM DD YYYY');
            weatherEl.textContent = 'Temperature: ' + parseInt(data.main.temp) + '\u00B0 F';
            humidityEl.textContent = 'Humidity: ' + parseInt(data.main.humidity) + '%';
            windEl.textContent = 'Wind Speed: ' + parseInt(data.wind.speed) + ' mph';
            // sets latitude and longitude for UV index
            lat = parseFloat(data.coord.lat);
            lon = parseFloat(data.coord.lon);
            // fetch request for UV index. Had to be nested due to the fetches being asynchronous and setting the variables after they are referenced for the URL
            uvURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + appKey;
            fetchuvURL();
            sym = data.weather[0].icon
            symURL = ' https://openweathermap.org/img/wn/' + sym + '@2x.png'
            document.getElementById('wicon').setAttribute('src', symURL)
        });
}




// fetches info for UV index and changes content to reflect
function fetchuvURL() {
    fetch(uvURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uvEl = document.querySelector('#uv')
            uvEl.textContent = 'UV Index: ' + parseFloat(data.value)
            if (parseFloat(data.value) <= 3) {
                document.getElementById('uv').setAttribute('style', 'background-color: green')
            } else if (parseFloat(data.value) <= 6) {
                document.getElementById('uv').setAttribute('style', 'background-color: yellow')
            } else {
                document.getElementById('uv').setAttribute('style', 'background-color: red')
            }
            fetchForecast()
        });
}

function fetchForecast() {
    
    fetch(forecastURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // for loop to generate each of the days of the forcast
        var fiveDay = document.querySelector('#fiveDay');
        fiveDay.textContent = '5 Day Forecast'
        for (let i = 0; i <= 4; i++) {
            var dateEl = document.querySelector('#date' + [i]);
            var weatherEl = document.querySelector('#weather' + [i]);
            var humidityEl = document.querySelector('#humidity' + [i]);
            // change the text content to reflect accurate information and date
            dateEl.textContent = moment().add(i + 1, 'd').format('MM DD YYYY');
            weatherEl.textContent = 'Temperature: ' + parseInt(data.list[i].main.temp) + '\u00B0 F';
            humidityEl.textContent = 'Humidity: ' + parseInt(data.list[i].main.humidity) + '%';
            symi = data.list[i].weather[0].icon
            symiURL = ' https://openweathermap.org/img/wn/' + symi + '@2x.png'
            document.getElementById('wicon' + i).setAttribute('src', symiURL)
        }
    });
}
// initializer that gets the local storage and updates the search history
function init() {


    var storedHistory = JSON.parse(localStorage.getItem('history'))

    if (storedHistory !== null) {
        arr = storedHistory
    }

    while (document.body.children[0].children[0].children[1].children[1].firstChild) {
        document.body.children[0].children[0].children[1].children[1].removeChild(document.body.children[0].children[0].children[1].children[1].firstChild);
    }

    for (let i = 0; i < arr.length; i++) {
        var listItem = document.createElement('li')
        listItem.textContent = arr[i]
        document.body.children[0].children[0].children[1].children[1].appendChild(listItem)
    }
}


function storeHistory() {
    arr.push(city)
    localStorage.setItem('history', JSON.stringify(arr))
    return;
}


// Activates formSubmitHandler when submitted
userFormEl.addEventListener('submit', formSubmitHandler);

init();