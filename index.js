var date = new Date()
console.log(date)
var key = '9cfe7036b90b3a13af1a88f6bf534b32'
var searchInput = document.getElementById('search')
var searchBtn = document.getElementById('srchBtn')
var srchHistory = document.getElementById('history')
var forecastEl = document.getElementById('forecast')
console.log(forecastEl)
console.log(searchBtn)
var currentWeather = document.querySelector('.current-weather-display')
console.log(currentWeather)


// main function to run everything
function getApi(search){

    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${key}&units=imperial`
    console.log(requestUrl)
    var forecastRequest = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${key}&units=imperial`


// getting data from open weather map api
    fetch(requestUrl)
    .then(function(response){
        console.log(response)
        return response.json();

    })
    .then(function (data){
        console.log(data)
        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&appid=${key}&units=imperial`


        fetch(oneCall)
        .then(function(response){
            return response.json()
        })
        .then(function(oneCallData){
            console.log(oneCallData)
            // variable that carries the current weather and 5 day forecast data and put in html
            var displayWeatherText = 
                    `
                    <h1> ${data.name + ' - ' + date.toDateString()} </h1>
                    <img class='main-weather-icon' src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt='weather icon'>
                    <p> Current Temp: ${data.main.temp} °F </p>
                    <p> Feels Like: ${data.main.feels_like} °F </p>
                    <p> Humidity: ${data.main.humidity} % </p>
                    <p> High Temp: ${data.main.temp_max} °F</p>
                    <p> Low Temp: ${data.main.temp_min} °F</p>
                    <p> UV Index: ${oneCallData.current.uvi} </p>
                    `
                    currentWeather.setAttribute('style', 'border: 5px solid black')
                    currentWeather.innerHTML = displayWeatherText

                    renderWeatherDisplay()


                    forecastEl.innerHTML = ''

                    for(i=0; i < 5; i++){

                        let unix_timestamp = oneCallData.daily[i].dt
                        let dailyDate = new Date(unix_timestamp * 1000)
                        let newDailyDate = dailyDate.toLocaleDateString();

                        var newForecast = document.createElement('div')
                        newForecast.setAttribute('class', 'forecast-card')
                        newForecast.innerHTML = 
                        `<h2> ${newDailyDate}</h2>
                        <img class='main-weather-icon' src="https://openweathermap.org/img/w/${oneCallData.daily[i].weather[0].icon}.png" alt='weather icon'> 
                        <p> Temp: ${oneCallData.daily[i].temp.day} °F </p>
                        <p> Feels like: ${oneCallData.daily[i].temp.day} °F</p>
                        `
                        
                        forecastEl.append(newForecast)
                        renderWeatherDisplay();
    
                       
                
                    }

        })




    })

    printHistory();
}

// print the previous searches in html
function printHistory(){
    var history = document.createElement('p')
    history.id = 'srchText'
    history.textContent = searchInput.value
    srchHistory.appendChild(history)
}

// make it so the layout doesnt look to weird
function renderWeatherDisplay(){
    currentWeather.setAttribute('style', 'display: flex')
}

// event listener press search to load getApi
searchBtn.addEventListener('click', function(){
    getApi(searchInput.value)
})