const weatherForm = document.querySelector(".weatherForm"); 
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

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
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    
    const response = await fetch(apiUrl);
    if(!response.ok){
        throw new Error("Could not get the weather data");
    }

    return await response.json();
}

async function displayWeatherInfo(data){
    const {
        name: city, 
        main: {temp, humidity},
        weather: [{description, id}]
    } = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const weatherMessage = document.createElement("p");

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
}

async function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return {emoji: "⛈️", message: "Thunderstorms, stay safe!"};
        case(weatherId >= 300 && weatherId < 400):
            return {emoji: "🌧️", message: "Light drizzle outside."};
        case(weatherId >= 500 && weatherId < 600):
            return {emoji: "🌧️", message: "Rainy weather."};
        case(weatherId >= 600 && weatherId < 700):
            return {emoji: "❄️", message: "Snowy conditions."};
        case(weatherId >= 700 && weatherId < 800):
            return {emoji: "🌫️", message: "Foggy weather."};
        case(weatherId === 800):
            return {emoji: "☀️", message: "Clear skies!"};
        case(weatherId > 800 && weatherId < 810):
            return {emoji: "☁️", message: "Cloudy skies."};
        default:
            return {emoji: "❓", message: "Weather unknown."};
    }
}

function displayError(message){
    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}
