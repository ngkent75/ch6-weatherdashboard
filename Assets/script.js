// variable delcared
var appKey = 'a26ac396e4c0182dc353be1f247139e9'
var city = 'charlotte'
var unit = 'imperial'
var cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + appKey + '&units=' + unit;
var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + appKey + '&units=' + unit;
var lat = 35;
var lon = -80;
var uvURL

// fetches city weather information
fetch(cityURL)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    // variables
    var cityEl = document.querySelector('#city');
    var weatherEl = document.querySelector('#weather');
    var humidityEl = document.querySelector('#humidity');
    var windEl = document.querySelector('#wind');
    console.log(weatherEl);
    // change the text content to reflect accurate information and date
    cityEl.textContent = city.charAt(0).toUpperCase() + city.slice(1) + " " + moment().format('MM DD YYYY');
    weatherEl.textContent = 'Temperature: ' + parseInt(data.main.temp) + '\u00B0 F';
    humidityEl.textContent = 'Humidity: ' + parseInt(data.main.humidity) + '%';
    windEl.textContent = 'Wind Speed: ' + parseInt(data.wind.speed) + ' mph';
    // sets latitude and longitude for UV index
    lat = parseFloat(data.coord.lat);
    lon = parseFloat(data.coord.lon);
    // fetch request for UV index. Had to be nested due to the fetches being asynchronous and setting the variables after they are referenced for the URL
    uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + appKey;
    fetchuvURL();
});

// fetches info for UV index and changes content to reflect
function fetchuvURL() {
    fetch(uvURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var uvEl = document.querySelector('#uv')
        console.log(uvEl);
        uvEl.textContent = 'UV Index: ' + parseFloat(data.value)
        
    });
}

fetch(forecastURL)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(data);
    // variables
    for (i = 0; i <= 4; i++) {
        var dateEl = document.querySelector('#date' + [i]);
        var weatherEl = document.querySelector('#weather' + [i]);
        var humidityEl = document.querySelector('#humidity' + [i]);
        console.log(weatherEl);
        // change the text content to reflect accurate information and date
        dateEl.textContent = moment().add(i+1, 'd').format('MM DD YYYY');
        weatherEl.textContent = 'Temperature: ' + parseInt(data.list[i].main.temp) + '\u00B0 F';
        humidityEl.textContent = 'Humidity: ' + parseInt(data.list[i].main.humidity) + '%';
    }
});