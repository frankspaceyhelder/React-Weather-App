import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import {
  OPEN_WEATHER_API_URL,
  OPEN_WEATHER_API_KEY,
} from "./components/search/api";
import { useState } from "react";
import Forecast from "./components/forecast/forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    let [lat, lon] = searchData.value.split(" ");
    lat = lat.trim();
    lon = lon.trim();

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid latitude or longitude");
      return;
    }

    const currentWeatherFetch = fetch(
      `${OPEN_WEATHER_API_URL}/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );

    const forecastFetch = fetch(
      `${OPEN_WEATHER_API_URL}/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  console.log(forecast);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
