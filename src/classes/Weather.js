import $ from "jquery";

class Weather {
    constructor (lat, lng){
        this.api = "https://api.open-meteo.com/v1/forecast";
        this.lng = lng;
        this.lat = lat;
    }

    getWeather(callback){
        const self = this;
        $.ajax({
            url: this.api,
            dataType: "json",
            data: {
                latitude: this.lat,
                longitude: this.lng,
                current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure",
                daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",
                timezone: "auto",
                forecast_days: 5
            }
        }).done(function(response){
            const transformed = self.transformResponse(response);
            callback(transformed);
        }).fail(function(error){
            console.log(error);
        })
    }

    transformResponse(data) {
        const weatherCodeToIcon = {
            0: "clear-day",      // Clear sky
            1: "partly-cloudy-day", // Mainly clear
            2: "partly-cloudy-day", // Partly cloudy
            3: "cloudy",         // Overcast
            45: "fog",           // Fog
            48: "fog",           // Depositing rime fog
            51: "rain",          // Drizzle: Light
            53: "rain",          // Drizzle: Moderate
            55: "rain",          // Drizzle: Dense
            61: "rain",          // Rain: Slight
            63: "rain",          // Rain: Moderate
            65: "rain",          // Rain: Heavy
            71: "snow",          // Snow fall: Slight
            73: "snow",          // Snow fall: Moderate
            75: "snow",          // Snow fall: Heavy
            77: "sleet",         // Snow grains
            80: "rain",          // Rain showers: Slight
            81: "rain",          // Rain showers: Moderate
            82: "rain",          // Rain showers: Violent
            85: "snow",          // Snow showers: Slight
            86: "snow",          // Snow showers: Heavy
            95: "thunderstorm",  // Thunderstorm
            96: "thunderstorm",  // Thunderstorm with slight hail
            99: "thunderstorm"   // Thunderstorm with heavy hail
        };

        const weatherCodeToDescription = {
            0: "Bezchmurnie",
            1: "Przeważnie bezchmurnie",
            2: "Częściowe zachmurzenie",
            3: "Pochmurno",
            45: "Mgła",
            48: "Mgła z szronem",
            51: "Lekka mżawka",
            53: "Umiarkowana mżawka",
            55: "Gęsta mżawka",
            61: "Słaby deszcz",
            63: "Umiarkowany deszcz",
            65: "Silny deszcz",
            71: "Słaby opad śniegu",
            73: "Umiarkowany opad śniegu",
            75: "Silny opad śniegu",
            77: "Ziarna śniegu",
            80: "Słabe opady deszczu",
            81: "Umiarkowane opady deszczu",
            82: "Gwałtowne opady deszczu",
            85: "Słabe opady śniegu",
            86: "Silne opady śniegu",
            95: "Burza",
            96: "Burza z gradem",
            99: "Burza z silnym gradem"
        };

        return {
            currently: {
                time: Math.floor(Date.now() / 1000),
                summary: weatherCodeToDescription[data.current.weather_code] || "Brak danych",
                icon: weatherCodeToIcon[data.current.weather_code] || "clear-day",
                apparentTemperature: data.current.apparent_temperature,
                temperature: data.current.temperature_2m,
                pressure: data.current.surface_pressure,
                windSpeed: data.current.wind_speed_10m,
                humidity: data.current.relative_humidity_2m
            },
            daily: {
                data: data.daily.time.map((time, index) => ({
                    time: new Date(time).getTime() / 1000,
                    icon: weatherCodeToIcon[data.daily.weather_code[index]] || "clear-day",
                    summary: weatherCodeToDescription[data.daily.weather_code[index]] || "Brak danych",
                    temperatureHigh: data.daily.temperature_2m_max[index],
                    temperatureLow: data.daily.temperature_2m_min[index],
                    apparentTemperatureHigh: data.daily.apparent_temperature_max[index],
                    apparentTemperatureLow: data.daily.apparent_temperature_min[index]
                }))
            },
            timezone: data.timezone
        };
    }
}

export default Weather;