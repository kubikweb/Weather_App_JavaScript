// SCSS
import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation.js"
import LocationIP from "./classes/IPLocation.js"
import "./styles/main.scss";


const form = $(".find-city");
const cloneHide = $(".clone.hide");
const search = $("#search");
const container = $("#app .module").eq(0);

container.hide();
cloneHide.hide();

function firstCity (){
    const cos = new LocationIP();
    cos.getIP(function(result){
        const weather = new Weather(result.latitude, result.longitude);
        weather.getWeather(function(result2) {
            getWeatherData(result2, result.city);
            createWeather(check);
            cloneCity();
            removeCity();



        });
    });
}

$(document).ready(function() {
    hideSearching();
    firstCity();
});




function hideSearching(){
    const add = $("header .container .btn");
    add.on("click", function(){
        container.css({display: "block"});
    });

    const closeSearch = container.find("button");
    closeSearch.on("click", function(){
        const parentDiv = $(this).parent("div");
        parentDiv.slideUp();
        parentDiv.find("form > button").attr("disabled", false).removeClass("loading");
    });
}


function createWeather (check){
    const tempe = $(".clone  .temperature");
    tempe.text(check.temp.toFixed(1) + "\u2103");
    const cityClass = $(".clone .city span");
    cityClass.text(check.city);
    const imgIcon = $(".clone .weather__icon").find("img");
    imgIcon.attr("src", "./images/icons/" + check.icon + ".svg");
    const infoIcon = $(".clone .info");
    infoIcon.text(check.info);
    const pressur = $(".clone .pressure");
    pressur.text(check.pressure + " hPa");
    const change = $(".clone .change");
    if (check.pressure < 1000){
        change.attr("src", "./images/icons/arrow-down.svg");
    } else {
        change.attr("src", "./images/icons/arrow-up.svg");
    }
    const wind = $(".clone .wind");
    const km = (check.windSpeed * 1.609344).toFixed(2);
    wind.text(km + " km/h");
    const humid = $(".clone .humidity");
    humid.text((check.humidity*100).toFixed(0) + " %");
    const zoneT = $(".clone .time_zone");
    zoneT.text(check.zone);

    const [, tomorr, dayAfter, twoDays] = check.daily;
    const days = ['NIEDZIELA', 'PONIEDZIAŁEK', 'WTOREK', 'ŚRODA', 'CZWARTEK', 'PIĄTEK', 'SOBOTA'];
    const dayNameTomorr = days[new Date(tomorr.time*1000).getDay()];
    const dayNameDayAfter = days[new Date(dayAfter.time*1000).getDay()];
    const dayNameTwoDays = days[new Date(twoDays.time*1000).getDay()];

    const tomorrow = $(".clone .daily .tomorrow");
    const dayAfterTom = $(".clone .daily .dayAfter");
    const twoDaysAfter = $(".clone .daily .twoDays");

    const arrSelector = [tomorrow, dayAfterTom, twoDaysAfter];
    const arrNameDate = [dayNameTomorr, dayNameDayAfter, dayNameTwoDays];
    const arrData = [tomorr, dayAfter, twoDays];

    arrSelector.forEach(function(item, index){
        item.find(".dayName").text(arrNameDate[index]);
        item.find(".info").text(arrData[index].summary);
        item.find("img").attr("src", "./images/icons/" + arrData[index].icon + ".svg");
        item.find(".temperature").text(arrData[index].temperatureHigh.toFixed(1) + "\u2103");
    });

}




function createNewCity(check){
    createWeather(check);
    cloneCity();
    hideSearching();

}


function cloneCity (){
    const toClone = $(".clone");
    toClone.clone().show().addClass("new").removeClass("clone hide").insertAfter(container);
}

function getWeatherData(result2, cityVal){
    check.city = cityVal;
    check.temp = result2.currently.apparentTemperature;
    check.icon = result2.currently.icon;
    check.info = result2.currently.summary;
    check.time = result2.currently.time;
    check.pressure = result2.currently.pressure;
    check.windSpeed = result2.currently.windSpeed;
    check.humidity = result2.currently.humidity;
    check.zone = result2.timezone;
    check.daily = result2.daily.data;
}


function removeCity(){
    const closeIcon = $(".btn--close");
    closeIcon.on("click", function(){
        const parent = $(this).parent(".new");
        parent.slideUp(function(){
            $(this).remove();
        });
    })
}

const check = {
    city: "check",
    temp: "temp",
    icon: "icon",
    info: "info",
    pressure: "pressure",
    windSpeed: "windSpeed",
    humidity: "humidity",
    zone: "zone",
    daily: "daily"
};


form.on("submit", function(e){
    e.preventDefault();
    const idSearch = search.val();
    if (idSearch.length <= 0){
        alert("Wpisz nazwę miasta");
        search.val("");
    } else {
        const button = $(this).find("button");
        button.attr("disabled", true).addClass("loading");
        const location = new GeoLocation(idSearch);
        location.getData(function(result, name) {
            const weather = new Weather(result.lat, result.lng);
            weather.getWeather(function(result2) {
                check.city = name.name;
                check.temp = result2.currently.apparentTemperature;
                check.icon = result2.currently.icon;
                check.info = result2.currently.summary;
                check.time = result2.currently.time;
                check.pressure = result2.currently.pressure;
                check.windSpeed = result2.currently.windSpeed;
                check.humidity = result2.currently.humidity;
                check.zone = result2.timezone;
                check.daily = result2.daily.data;
                createNewCity(check);
                button.attr("disabled", false).removeClass("loading");
                search.val("");
                container.hide();
                removeCity();
            });
        });
    }
});


const media = window.matchMedia("(max-width: 500px)");
const weatherInfo = $(".currently .weather__info");
const weatherIcon = $(".currently .weather__icon");
const currently = $(".currently");

if (media.matches) {
    weatherInfo.prependTo(currently);
} else {
    weatherIcon.prependTo(currently);
}





