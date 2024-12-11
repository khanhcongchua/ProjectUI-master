import { addDataForWeather7days, addDataForWeatherToday, getWeather7days, getWeatherToday } from "./firebase.js";

// const apiKey = "c76c27beb2f949449b36fcc83a532629";
const apiKey = "4b3efa19093f4717a7f3d9f08bb0578d";
const url7days = `https://api.weatherbit.io/v2.0/forecast/daily?city_id=Can%20Tho&city=Can%20Tho&postal_code=%2B84&country=Vi%E1%BB%87t%20Nam&key=${apiKey}`

const urlToday = `https://api.weatherbit.io/v2.0/current?city_id=Can%20Tho&city=Can%20Tho&postal_code=%2B84&country=Vi%E1%BB%87t%20Nam&key=${apiKey}`

async function handleApi7Days(url7days, weather7Days, weatherCurrent) {
    await fetch(url7days)
        .then(res => res.json())
        .then(data => {
            weather7Days(data)
        })

    fetch(urlToday)
        .then(res => res.json())
        .then(data => {
            weatherCurrent(data)
        })
}

let highTemp = 0;
let lowTemp = 0;

function dataWeather(data) {
    const icon = data.data[0].weather.icon
    const weatherTitle = data.data[0].weather.description;

    const solarRad = data.data[0].solar_rad;

    const temp = data.data[0].temp;
    const humidity = data.data[0].rh;

    addDataForWeatherToday(highTemp, lowTemp, temp, icon, humidity, solarRad, weatherTitle);
}

function renderWeatherToday(data) {
    const weatherHtml = `
                    <h6 class="mb-4">Thời Tiết Hôm Nay</h6>
                    <div class="general-weather-infor">
                        <div class="col-icon">
                            <div class="weather-icon">
                                <img height ="55" src="img/high-temperature.png" />
                                <h3>${data.temp}°C</h3>
                            </div>
                            <div class="weather-icon">
                                <img height ="55" src="img/thermometer.png" />
                                <h3>${data.maxTemp}°C</h3>
                            </div>
                        </div>
                        <div class="col-icon">
                            <div class="weather-icon">
                                <img height ="55" src="img/humidity-sensor.png" />
                                <h3>${data.humidity}%</h3>
                            </div>
                            <div class="weather-icon">
                                <img height ="55" src="img/low-temperature.png" />
                                <h3>${data.minTemp}°C</h3>
                            </div>
                        </div>
                    </div>
                    <div class="weather-temp-today">
                        <img height="150" width="150" alt="Weather API Day Thunderstorm with light rain" style=""                     
                         src="https://cdn.weatherbit.io/static/img/icons/${data.icon}.png">
                        <h1>${data.titleOfWeather}</h1>
                    </div>`

    const viewWeather = document.querySelector('.weather-inf');
    viewWeather.innerHTML = weatherHtml;
}

let highTemp7Days = [];
let lowTemp7Days = [];
let iconWeather = [];
let temp = [];
let datetime = [];

function predictWeather7days(data) {

    highTemp = data.data[0].app_max_temp;
    lowTemp = data.data[0].app_min_temp;

    for (let i = 0; i < 7; i++) {
        const date = data.data[i].datetime;
        // const day = new Date(date).getDay();
        datetime.push(date);

        highTemp7Days.push(data.data[i].app_max_temp);
        lowTemp7Days.push(data.data[i].app_min_temp);

        const icon = data.data[i].weather.icon;
        iconWeather.push(icon);

        const t = data.data[i].temp;
        temp.push(t);
    }
    addDataForWeather7days(highTemp7Days, lowTemp7Days, iconWeather, temp, datetime);
}

function renderPredictWeather7days(data) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const template = document.querySelector('.weather7days .row .row');

    for (let i = 0; i < 7; i++) {
        const date = data.date[i];
        const day = new Date(date).getDay();

        const icon = data.icon[i];
        const temp = data.temp[i];
        const render = `
        <div class="col" style="margin-bottom:20px">
            <div class="bg-white rounded p-3">
                <h6>${days[day]}</h6>
                <img height="50" width="50" alt="Weather API Day Thunderstorm with light rain" style=""                     
                         src="https://cdn.weatherbit.io/static/img/icons/${icon}.png">
                <p>${temp}°C</p>
            </div>
        </div>
        `
        template.innerHTML += render;
    }
}




const date = new Date();
const today = new Date(date.getTime());
//Define some timeline to update api
const SixAm = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1, 13, 46, 0); //6am
const NineAm = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1, 9, 0, 0); //9am
const noon = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 12, 0, 0); //12am
const TwoPm = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1, 14, 0, 0); //2pm
const FourPm = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1, 16, 0, 0); //4pm
const evening = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1, 18, 0, 0); //6pm


// console.log(today.toLocaleTimeString() + mourning.toLocaleTimeString());
// console.log(evening.toLocaleTimeString());
// console.log(today.getTime());
// console.log(evening.getTime() === today.getTime());

//call api following time that is defined
if (
    today.getTime() === SixAm.getTime() ||
    today.getTime() === NineAm.getTime() ||
    today.getTime() === noon.getTime() ||
    today.getTime() === TwoPm.getTime() ||
    today.getTime() === FourPm.getTime() ||
    today.getTime() === evening.getTime()
) {
    console.log('call api');
    await handleApi7Days(url7days, predictWeather7days, dataWeather);

} else {
    //call function to render weather

    const weatherToday = await getWeatherToday();
    renderWeatherToday(weatherToday);



    const weather7Days = await getWeather7days();
    renderPredictWeather7days(weather7Days);

}

