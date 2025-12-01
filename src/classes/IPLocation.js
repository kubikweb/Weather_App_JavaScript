import $ from "jquery";

class LocationIP {
    constructor(){
        this.url = "https://ipapi.co/json/"
    }

    getIP(callback){
        $.ajax({
            url: this.url,
            dataType: "json",
        }).done(function(response){
            callback(response);
        }).fail(function(error){
            console.log(error);
        });
    }
}


export default LocationIP