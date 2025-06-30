const weatherForm = document.querySelector(".weatherForm"); 
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const forecastweather = document.querySelector(".forecastweather")

const apiKey = "e118f6268f8712e85e87589b9f781330";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            await displayWeatherInfo(weatherData);
        } catch(error){
            console.error(error);
            displayError(error.message || "An error occurred");
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}`;

    
    const response = await fetch(apiUrl);
    
    if(!response.ok){
        throw new Error("Could not get the weather data");
    }

    return await response.json();
    
}

async function displayWeatherInfo(data){
    console.log(data)

    const city = data.city.name; 
    const timezone= data.city.timezone; 
    const forecast = getForeCastOneHourAhead(data.list);

    

    const {
        main: {
            temp,
            humidity
        } ,
        weather: [{description, id}],
        dt, 
        
    } = forecast;
    
    

    
    const localTimestamp = dt;
    const localDate = new Date((dt + timezone) * 1000); 


    console.log(localDate)
    const formatedDate = localDate.toLocaleDateString("en-GB", {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
       
    });
    const formatedTime = localDate.toLocaleTimeString("en-GB", {
        hour:"2-digit",
        minute: "2-digit"
    })
    card.textContent = "";
    card.style.display = "flex";
    forecastweather.textContent = ""
    forecastweather.style.display ="flex"

    const dateTimeDisplay = document.createElement("p");
    dateTimeDisplay.textContent =  `${formatedDate}`;
    dateTimeDisplay.classList.add("weatherMessage");
    card.appendChild(dateTimeDisplay)

    const forecastDisplay = document.createElement("p")
    forecastDisplay.textContent = `${formatedTime} ${(forecast.main.temp - 273.15).toFixed(1)}°C`;
    forecastDisplay.classList.add("weatherMessage"); 
    forecastweather.appendChild(forecastDisplay)



    
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const weatherMessage = document.createElement("p");
    const clothesMessage = document.createElement("p");


    const weatherInfo = await getWeatherEmoji(id);

    cityDisplay.textContent = city;
    cityDisplay.classList.add("cityDisplay");
    card.appendChild(cityDisplay);

    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}˚C`;
    tempDisplay.classList.add("tempDisplay"); // Fixed typo here
    card.appendChild(tempDisplay);

    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");
    card.appendChild(humidityDisplay);

    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");
    card.appendChild(descDisplay);

    weatherEmoji.textContent = weatherInfo.emoji;
    weatherEmoji.classList.add("weatherEmoji");
    card.appendChild(weatherEmoji);

    weatherMessage.textContent = weatherInfo.message;
    weatherMessage.classList.add("weatherMessage");
    card.appendChild(weatherMessage);

    clothesMessage.textContent = weatherInfo.clothMessage;
    clothesMessage.classList.add("weatherMessage");
    card.appendChild(clothesMessage);

 


}

async function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return {emoji: "⛈️", message: "Thunderstorms, stay safe!",  clothMessage:"you better have a jacket and an unbrella"};
        case(weatherId >= 300 && weatherId < 400):
            return {emoji: "🌧️", message: "Light drizzle outside.",  clothMessage:"wear a slight waterproof jacket"};
        case(weatherId >= 500 && weatherId < 600):
            return {emoji: "🌧️", message: "Rainy weather.",  clothMessage:"wear a waterproof jacket"};
        case(weatherId >= 600 && weatherId < 700):
            return {emoji: "❄️", message: "Snowy conditions.",  clothMessage:"wear a jacket"};
        case(weatherId >= 700 && weatherId < 800):
            return {emoji: "🌫️", message: "Foggy weather.",  clothMessage: "wear normal clothes"};
        case(weatherId === 800):
            return {emoji: "☀️", message: "Clear skies!", clothMessage: "you better wear a sunglass" };
        case(weatherId > 800 && weatherId < 810):
            return {emoji: "☁️", message: "Cloudy skies.", clothMessage: "just wear normal clothes"};
        default:
            return {emoji: "❓", message: "Weather unknown.", clothMessage: "you better be careful"};
    }
}

function getForeCastOneHourAhead(list){
    const now = Date.now();
    const oneHourLater = now + 60*60*1000;
    return list.reduce((closest, current) => {
        const currentDiff = Math.abs(current.dt * 1000 - oneHourLater);
        const closestDiff = Math.abs(closest.dt * 1000 - oneHourLater);
        return currentDiff < closestDiff ? current : closest;
    })
    
}


function displayError(message){
    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}
