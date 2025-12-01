import $ from "jquery";

class Weather {
    constructor (lat, lng){
        this.key = "b76e09b33e15ea2ac8465f86c29ecde1";
        this.api = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
        this.lng = lng;
        this.lat = lat;
    }

    getWeather(callback){
        $.ajax({
            url: this.api + this.key + "/" + this.lat + ","+ this.lng +"?lang=pl&units=si",
            dataType: "json"
        }).done(function(response){
            callback(response);
        }).fail(function(error){
            console.log(error);
        })
    }

}


export default Weather;