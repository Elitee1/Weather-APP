const weatherForm = document.querySelector(".weatherForm"); 
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

const apiKey = "e118f6268f8712e85e87589b9f781330";

weatherForm.addEventListener("submit", async event => {
   
    event.preventDefault();
    const city = cityInput.value; 

    if(city){
        try{
            const weattherData = await getWeatherData(city);
            displayWeatherInfo(weattherData)
        }
        
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city")
    }

});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    const response = await fetch(apiUrl);
    console.log(response)

    if(!response.ok){
        throw new Error("Could not the weather data");
    }

    return await response.json();
}


function displayWeatherInfo(data){
    const {name:city, 
        main: {temp, humidity},
        weather: [{description, id}]} = data;

        card.textContent ="";
        card.style.display ="flex"

        const cityDisplay = document.createElement("h1")
        const tempDisplay = document.createElement("p")
        const humidityDisplay = document.createElement("p")
        const descDisplay = document.createElement("p")
        const weatherEmoji= document.createElement("p")

        cityDisplay.textContent = city;
        cityDisplay.classList.add("cityDisplay")
        card.appendChild(cityDisplay);

        tempDisplay.textContent = `${(temp -273.15).toFixed(1)}˚C`; 
        tempDisplay.classList.add("tempDislay");
        card.appendChild(tempDisplay);

        humidityDisplay.textContent = `Humidity: ${humidity}%`; 
        humidityDisplay.classList.add("humidityDisplay")
        card.appendChild(humidityDisplay)

        descDisplay.textContent = description; 
        descDisplay.classList.add("descDisplay");
        card.appendChild(descDisplay)

        weatherEmoji.textContent = getWeatherEmoji(id);
        weatherEmoji.classList.add("weatherEmoji")
        card.appendChild(weatherEmoji)



        

}

function getWeatherEmoji(weatherid){
    switch(true){
        case(weatherid >= 200 && weatherid <300):
        return "🌩️";
        case(weatherid >= 300 && weatherid <300):
        return "🌧️";
        case(weatherid >= 500 && weatherid <600):
        return "⛈️";
        case(weatherid >= 600 && weatherid <700):
        return "❄";
        case(weatherid >= 700 && weatherid <800):
        return "🌫️";
        case(weatherid === 800):
        return "☀";
        case(weatherid >= 801 && wetherid < 810):
        return "☁️";
        default:
            return "?";
        
    

    }

}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}