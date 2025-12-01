import $ from "jquery";

    class GeoLocation {
        constructor(searchInput){
            this.search = searchInput;
            this.api = "https://graphhopper.com/api/1/geocode?";
            this.key = "6dfe1fd5-fe60-46fc-ae70-6949542e05c2"
        }

        getData(callback){
            $.ajax ({
                url: this.api + "q=" + this.search + "&key="+ this.key,
                dataType: "json",
            }).done(function(response){
                if (response.hits.length > 0) {
                    callback(response.hits[0].point, response.hits[0])
                } else {
                    alert("Nazwa miejscowości jest niewłaściwa");
                    $("#search").val("");
                    $("form").find("button").attr("disabled", false).removeClass("loading");
                }
            }).fail(function(error){
                console.log(error);
            })

        }


    }


export default GeoLocation;
