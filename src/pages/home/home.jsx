import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';

export default function Home() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const fetchWeather = async (cityName) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_WEATHER_API_URL}`,
          {
            params: {
              q: cityName,
              appid: process.env.REACT_APP_WEATHER_API_KEY,
              units: "metric"
            }
          }
        );
        setWeather(response.data);
      } catch (error) {
        console.error(error.message);
        setWeather(null);
      }
    };

    const handleSearch = () => {
      if (city.trim() !== "") {
        fetchWeather(city);
      }
    };

    const renderWeatherIcon = (weatherMain) => {
      switch (weatherMain) {
        case "Clear":
          return <img src="/assets/sun.png" alt="Clear" className="imgs" />;
        case "Clouds":
          return <img src="/assets/cloud.png" alt="Clouds" className="imgs" />;
        case "Rain":
          return <img src="/assets/rain.png" alt="Rain" className="imgs" />;
        case "Snow":
          return <img src="/assets/snow.png" alt="Snow" className="imgs" />;
          case "Sun":
            return <img src="/assets/sun.png" alt="Sun" className="imgs" />;
            case "Haze":
                return <img src="/assets/haze.png" alt="haze" className="imgs" />;
        default:
          return <img src="/assets/mist.png" alt="Mist" className="imgs" />;
      }
    };

    const formatDate = (date) => {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return new Intl.DateTimeFormat('fr-FR', options).format(date);
    };

    const currentDate = formatDate(new Date());

    return (
      <div className="container min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
        <div className="content w-full max-w-md p-4 bg-white shadow-xl rounded-2xl">
          <h1 className="text-2xl font-bold text-center mb-4">Météo App( for ben arfa tarek )</h1>
          <div className="all-1">
            <div className="serash mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Entrez une ville"
                className="flex-grow p-2 form-control"
              />
              <button
                onClick={handleSearch}
                className="btn btn-outline-success"
              >
                Rechercher
              </button>
            </div>
            {weather && (
              <div className="text-center bgmeteo">
                <div className="mb-2 header">
                  <h2 className="text-xl font-semibold">{weather.name}</h2>
                  <span className='date'>{currentDate}</span>
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span>{weather.weather[0].main}</span>
                </div>

                <div className="degre">
                 <p>{Math.round(weather.main.temp)}°C</p>
                <span>{Math.round(weather.main.humidity)} / {Math.round(weather.main.temp_max)} </span>  
                
                </div>
              </div>
            )}
            {!weather && <p className="text-center text-gray-500">Aucune donnée disponible</p>}

            {/* Tabulation Bootstrap */}
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-hourly-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-hourly"
                  type="button"
                  role="tab"
                  aria-controls="nav-hourly"
                  aria-selected="true"
                >
                  Hourly
                </button>
                <button
                  className="nav-link"
                  id="nav-daily-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-daily"
                  type="button"
                  role="tab"
                  aria-controls="nav-daily"
                  aria-selected="false"
                >
                  Daily
                </button>
                <button
                  className="nav-link"
                  id="nav-details-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-details"
                  type="button"
                  role="tab"
                  aria-controls="nav-details"
                  aria-selected="false"
                >
                  Details
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-hourly"
                role="tabpanel"
                aria-labelledby="nav-hourly-tab"
                tabIndex="0"
              >
                <div className="hourly">
                    <div className="now">
                    {weather && (
              <div className="text-center bgmeteo">
                <div className="mb-2 header">
                    <span>Now</span>
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span> {Math.round(weather.main.temp)}°C</span>
                </div>
                <div className="mb-2 header">
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span> {Math.round(weather.main.temp)}°C</span>
                </div>
                <div className="mb-2 header">
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span> {Math.round(weather.main.temp)}°C</span>
                </div>
                <div className="mb-2 header">
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span> {Math.round(weather.main.temp)}°C</span>
                </div>
                <div className="mb-2 header">
                  {renderWeatherIcon(weather.weather[0].main)}
                  <span> {Math.round(weather.main.temp)}°C</span>
                </div>
              </div>
            )}
                    </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="nav-daily"
                role="tabpanel"
                aria-labelledby="nav-daily-tab"
                tabIndex="0"
              >
                Contenu Daily
              </div>
              <div
                className="tab-pane fade"
                id="nav-details"
                role="tabpanel"
                aria-labelledby="nav-details-tab"
                tabIndex="0"
              >
                Contenu Details
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}