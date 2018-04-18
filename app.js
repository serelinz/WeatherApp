(function () {
    'use strict';
    var displayDegreeSymbol = $("#degreeSymbol");
    var displayHumidity = $("#humidity");
    
    var displayWinds = $("#winds");
    var displayPressure = $("#pressure");
    var displaySunrise = $("#sunrise");
    var displaySunset = $("#sunset");
    var button = $("#unit");
    var backgroundPicture = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/clear.jpg"; // set default background picture.
   
   
    var cityName = "";
    var regionName = "";
    var countryName = "";
    var locationString = "";
    var latitude = "";
    var longitude = "";
    var latlon = "";


    var countryUnits = "metric";                                        // set default measurement system to metric.
    var temperature = "";
    var windSpeed = "";
    var windDirection = "";
    var humidity = "";
    var pressure = "";
    var pressureSymbol = "kPa";                                         // set default pressure units.
    
    var currentWeather = "";
    var tempSymbol = "C";                                               // set default temperature units.
    var windSymbol = 'km/h';                                            // set default wind speed units.
    var iconURL = "";

    /* function locationByIP() sets user's location information based upon the user's IP address
     * using the webservice at https://ipinfo.io/ */
     function currentLocation() {
 
        if (google.loader.ClientLocation) {
            var latitude = google.loader.ClientLocation.latitude;
            var longitude = google.loader.ClientLocation.longitude;
            var cityName = google.loader.ClientLocation.address.city;
            var countryName = google.loader.ClientLocation.address.country;
            var regionName = google.loader.ClientLocation.address.region;
            console.log('The current city is' + cityName + regionName + countryName + latitude + longitude);
            $("#city").html(cityName);
            $("#country").html(regionName + ", " + countryName); 
            $("#latlon").html('Longitude:' +longitude+ ',  Latitude:' + latitude);
            var url = 'https://fcc-weather-api.glitch.me//api/current?&lat='+latitude+'&lon='+longitude+'&preventCache=' + new Date();
            var weatherRequest = new XMLHttpRequest();
                weatherRequest.onreadystatechange = function () {
                    if (weatherRequest.readyState === 4 && weatherRequest.status === 200) {
                        var object = JSON.parse(weatherRequest.responseText);
                        processResponse(object); 
                        setCountryUnits(object);                   
                    }
                };
                weatherRequest.open("GET", url, true);                          // true sets asynchronous mode.
                weatherRequest.send(); 
                
        } else {  
            $("#location").html('Google was not able to detect your location'); 
        }
         
        // getWeather(); 
    
    }
     
    
    
  

    function setCountryUnits(obj) {
        if (obj.sys.country === 'US' || obj.sys.country === 'LY'|| obj.sys.country === 'NM') {        
            countryUnits = 'fahrenheit';
            console.log('current country unites is '+countryUnits)
        }else{
            countryUnits = 'celsius';
            console.log('current country unites is '+countryUnits)

        }
    }

    function processResponse(obj) {
        console.log(obj,"test2");
        temperature = Math.round(obj.main.temp);
        console.log(temperature);

        if (countryUnits === 'metric') {                                // checks if metric country.
            windSpeed = Math.round(obj.wind.speed * 18 / 5);            // convert meter/sec to km/hour. (metric)
            pressure = Math.round(obj.main.pressure) / 10;              // convert to kPa from hPa. (metric)
        }
        else {                                                          // else use imperial units.
            windSpeed = Math.round(obj.wind.speed);
            pressure = Math.round(obj.main.pressure);
        }
        windDirection = degreeToCardinal(obj.wind.deg);      // convert from degrees to cardinal wind direction.
        currentWeather = obj.weather[0].description;
        humidity = obj.main.humidity;
       
        iconURL = 'https://cors.5apps.com/?uri=http://openweathermap.org/img/w/' + obj.weather[0].icon + '.png';  // fetch correct weather icon.    
        weatherPicture();  
        displayData();
                          
    }

    /* function displayRefresh() updates the DOM using latest weather data. */
    function displayData() {
        $("#temperature").html('Current temperature is ' +temperature+'&deg; '+tempSymbol);
        $("#conditions").html(currentWeather);
        $("#winds").html('Winds '+windDirection + " " + windSpeed + " " + windSymbol);
        var newElement = document.createElement('img');                 // new DOM element for weather icon.
        // newElement.src = iconURL;
        // newElement.setAttribute("id", "icons");
        // $("#icon").append(newElement);
        var image = backgroundPicture;
        $("#main").css("background-image", "url(image)");
        $("#main").css("background-size", "100% auto");
    }
    

    /* function toggleUnits() allows user to flip between imperial and metric units of measure. */
    function toggleUnits() {
        if (countryUnits === 'fahrenheit') {                           // check if currently set to imperial or metric.
            tempSymbol = 'F';
            windSymbol = 'miles/hour';
            countryUnits = 'celsius';
            pressureSymbol = 'mb';
            $("#unit").html = 'Use Metric Units';
            temperature = Math.round((temperature * 9 / 5) + 32);       // convert temperature to 'fahrenheit'.
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed / 1.609344);               // convert wind speed to 'miles/hr'.
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure * 10;                                   // convert pressure to 'mb'.
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
        else {
            tempSymbol = 'C';
            countryUnits = 'metric';
            windSymbol = 'km/hour';
            pressureSymbol = 'kPa';
            $("#unit").html = 'Use Imperial Units';
            temperature = Math.round((temperature - 32) * 5 / 9);       // convert temperature to 'celsius'.
            displayTemperature.innerHTML = temperature;
            displayDegreeSymbol.innerHTML = " &deg;" + tempSymbol;
            windSpeed = Math.round(windSpeed * 1.609344);               // convert wind speed to 'Km/h'.
            displayWinds.innerHTML = "Winds " + windDirection + " " + windSpeed + " " + windSymbol;
            pressure = pressure / 10;                                   // convert pressure to'KPa'.
            displayPressure.innerHTML = "Barometric Pressure: " + pressure + " " + pressureSymbol;
        }
    }



    /* function degreeToCardinal() is passed a direction in degrees, and returns a cardinal direction. */
    function degreeToCardinal(degree) {
        if (degree > 337.5 && degree < 22.5) {
            return "N";
        } else if (degree > 22.5 && degree < 67.5) {
            return "NE";
        } else if (degree > 67.5 && degree < 112.5) {
            return "E";
        } else if (degree > 112.5 && degree < 157.5) {
            return "SE";
        } else if (degree > 157.5 && degree < 202.5) {
            return "S";
        } else if (degree > 202.5 && degree < 247.5) {
            return "SW";
        } else if (degree > 247.5 && degree < 292.5) {
            return "W";
        } else if (degree > 292.5 && degree < 337.5) {
            return "NW";
        }
    }

    /* function weatherPicture() sets the background picture to match the current local weather conditions. */
    function weatherPicture() {
        switch (true) {
            case /\bclear\b/i.test(currentWeather):                     // match uses regular expression.
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/clear.jpg';
                break;
            case /\bovercast\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/overcast.jpg';
                break;
            case /\bclouds\b/i.test(currentWeather):
                backgroundPicture = 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bbe0bd1ecfaaa91394e0c9effb8b0415&auto=format&fit=crop&w=1350&q=80';
                break;
            case /\brain\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg';
                break;
            case /\bdrizzle\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg';
                break;
            case /\bthunderstorm\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/thunderstorm.jpg';
                break;
            case /\bsnow\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/snow.jpg';
                break;
            case /\bmist\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mist.jpg';
                break;
            case /\bfog\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mist.jpg';
                break;
        }
    }

    $("#unit").onclick = function () {             // add event listener to 'change units' button.
        toggleUnits();                                                  // on button click toggle units of measurement.
    };
    currentLocation();                                                     // main entry point for program execution.
})();