// uvnu.nl - Het laatste nieuws over het weer!
// Website: https://uvnu.nl

let autocomplete;
let geocoding;

function initAutocomplete() {
    // Inits autocomplete.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
            types: ["(regions)"],
            fields: ["geometry", "name", "formatted_address"]
        });

    // Listen for the event fired when the user selects a prediction and retrieve.
    autocomplete.addListener("place_changed", onPlaceChanged);
}

function initGeocoding() {
    // Gets the current location coordinates.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
    }

    // Inits geocoding.
    geocoding = new google.maps.Geocoder();
}

function onPlaceChanged() {
    // Gets the autocomplete place function.
    var place = autocomplete.getPlace();

    // If the user did not select a prediction, reset the input field.
    if (!place.geometry) {
        document.getElementById("autocomplete").placeholder = "Enter a place";
    } else {
        // Sets the input field to the chosen place.
        document.getElementById("autocomplete").innerHTML = place.name;
        // Sets the formatted address value as id.
        document.getElementById("place_name").innerHTML = place.formatted_address

        // Calls the function to set the remaining ids.
        getWeatherDataFromPlace(place.geometry.location.lat(), place.geometry.location.lng())
    }
}

function positionSuccess(position) {
    // Gets the 'lat' and 'lon' values.
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    // Sets the id to empty string.
    document.getElementById("autocomplete").innerHTML = "";
    // Sets the 'lat' and 'lon' for the id.
    document.getElementById("place_name").innerHTML = lat + " " + lng

    // Calls the function to set the remaining ids.
    getWeatherDataFromPlace(lat, lng)
}

function positionError() {
    // If the location-access gets declined, run this alert.
    alert("U heeft de locatie-toegang geweigerd. Om dit te herstellen kunt u naar uw browser instellingen gaan en de pagina herladen.");
}

function getWeatherDataFromPlace(place_lat, place_lon) {
    // Gets the 'openweathermap.org' api.
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + place_lat + "&lon=" + place_lon + "&lang=nl&units=metric&exclude=minutely,hourly,daily,alerts&appid=968bd789172dad4d534f022caa28db3e")
        .then(function (resp) { return resp.json() })
        .then(function (data) {
            // Runs the functions to get the needed values for each id.
            getDateTime()
            convertTimestamp(data["current"]["sunrise"], "sunrise")
            convertTimestamp(data["current"]["sunset"], "sunset")
            degreeToDirection(data["current"]["wind_deg"])
            getWeatherDescriptionIcon(data["current"]["weather"]["0"]["icon"])
            getTemperatureIcon(data["current"]["temp"])

            // Sets the correct values for each id.
            document.getElementById("weather_description").innerHTML = (data["current"]["weather"]["0"]["description"]).charAt(0).toUpperCase() + (data["current"]["weather"]["0"]["description"]).slice(1);
            document.getElementById("temperature").innerHTML = (data["current"]["temp"]) + ("°C");
            document.getElementById("feels_like").innerHTML = (data["current"]["feels_like"]) + ("°C");
            document.getElementById("uv").innerHTML = data["current"]["uvi"];
            document.getElementById("clouds").innerHTML = (data["current"]["clouds"]) + ("%");
            document.getElementById("wind_speed").innerHTML = (data["current"]["wind_speed"]) + (" km/h");
            document.getElementById("wind_gust").innerHTML = (data["current"]["wind_gust"]) + (" km/h");
            document.getElementById("humidity").innerHTML = (data["current"]["humidity"]) + ("%");
            document.getElementById("dew_point").innerHTML = (data["current"]["dew_point"]) + ("°C");
            document.getElementById("pressure").innerHTML = (data["current"]["pressure"]) + (" hPa");
            document.getElementById("visibility").innerHTML = (data["current"]["visibility"]) + (" km");
            document.getElementById("timezone").innerHTML = data["timezone"];
            document.getElementById("timezone_offset").innerHTML = data["timezone_offset"];
        })
        .catch(function () {
            // Catches any errors.
        });
}

function getDateTime() {
    // Gets the current date and time.
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();

    // Adds an '0' before each value if the length is equal to one.
    if(month.toString().length === 1) {
        month = '0'+month;
    }
    if(day.toString().length === 1) {
        day = '0'+day;
    }
    if(hour.toString().length === 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length === 1) {
        minute = '0'+minute;
    }

    // Sets the date result.
    document.getElementById("date").innerHTML = day + '/' + month + '/' + year
    // Sets the time result.
    document.getElementById("time").innerHTML = hour + ':' + minute;
}

function convertTimestamp(timestamp, id) {
    // Create a new JavaScript Date object based on the timestamp.

    // Multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp * 1000);
    // The hours part from the timestamp.
    var hours = date.getHours();
    // The minutes part from the timestamp.
    var minutes = "0" + date.getMinutes();

    // Display the time in hour:minute format and sets the result.
    document.getElementById(id).innerHTML = hours + ':' + minutes.substr(-2);
}

function degreeToDirection(windDegree) {
    // Calculates the current wind degree to direction.
    var val = Math.floor((windDegree / 22.5) + 0.5);
    // Array of wind degrees.
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    // Sets the wind direction result.
    document.getElementById("wind_degree").innerHTML = (arr[(val % 16)]) + (" - ") + (windDegree) + ("°");
}

function getWeatherDescriptionIcon(icon) {
    // Sets the correct font awesome icon based on the given 'icon' argument value.
    if (icon === "01d") {
        weatherDescriptionIcon = "fas fa-sun"
    } else if (icon === "01n") {
        weatherDescriptionIcon = "fas fa-moon"
    } else if (icon === "02d") {
        weatherDescriptionIcon = "fas fa-cloud-sun"
    } else if (icon === "02n") {
        weatherDescriptionIcon = "fas fa-cloud-moon"
    } else if (icon === "03d") {
        weatherDescriptionIcon = "fas fa-cloud"
    } else if (icon === "03n") {
        weatherDescriptionIcon = "fas fa-cloud"
    } else if (icon === "04d") {
        weatherDescriptionIcon = "fas fa-clouds"
    } else if (icon === "04n") {
        weatherDescriptionIcon = "fas fa-clouds"
    } else if (icon === "09d") {
        weatherDescriptionIcon = "fas fa-cloud-showers"
    } else if (icon === "09n") {
        weatherDescriptionIcon = "fas fa-cloud-showers"
    } else if (icon === "10d") {
        weatherDescriptionIcon = "fas fa-cloud-sun-rain"
    } else if (icon === "10n") {
        weatherDescriptionIcon = "fas fa-cloud-moon-rain"
    } else if (icon === "11d") {
        weatherDescriptionIcon = "fas fa-thunderstorm"
    } else if (icon === "11n") {
        weatherDescriptionIcon = "fas fa-thunderstorm"
    } else if (icon === "13d") {
        weatherDescriptionIcon = "fas fa-snowflake"
    } else if (icon === "13n") {
        weatherDescriptionIcon = "fas fa-snowflake"
    } else if (icon === "50d") {
        weatherDescriptionIcon = "fas fa-fog"
    } else if (icon === "50n") {
        weatherDescriptionIcon = "fas fa-fog"
    }

    // Sets the weather description icon result.
    document.getElementById("weather_description-icon").className = weatherDescriptionIcon
}

function getTemperatureIcon(temperature) {
    // Sets the correct font awesome icon based on the given 'temperature' argument value.
    if (temperature >= 31) {
        temperatureIcon = "fas fa-temperature-hot"
    } else if (temperature >= 21 && temperature <= 30) {
        temperatureIcon = "fas fa-thermometer-three-quarters"
    } else if (temperature >= 11 && temperature <= 20) {
        temperatureIcon = "fas fa-thermometer-half"
    } else if (temperature <= 10) {
        temperatureIcon = "fas fa-temperature-frigid"
    }

    // Sets the temperature icon result.
    document.getElementById("temperature-icon").className = temperatureIcon
}