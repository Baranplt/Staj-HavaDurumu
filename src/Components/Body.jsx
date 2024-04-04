import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
import data from '../Data.json';

function Body({ inputValue }) {
    const [time, setTime] = useState(new Date());
    const [userLocation, setUserLocation] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [error, setError] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    error => {
                        setError('Konum bilgisi alınamadı.');
                        console.error(error);
                    }
                );
            } else {
                setError('Tarayıcınız konum bilgisini desteklemiyor.');
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        const fetchCity = async () => {
            if (userLocation) {
                try {
                    const response = await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=AIzaSyD-19MxNAiwvsRGLUpdWje8rW4hNSe6wLQ`);
                    const city = response.data.results[0].address_components.find(component => component.types.includes('administrative_area_level_1')).long_name;
                    setUserCity(city.toLowerCase());
                } catch (error) {
                    setError('Şehir bilgisi alınamadı.');
                    console.error(error);
                }
            }
        };
        fetchCity();
    }, [userLocation]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue ? inputValue : userCity}&appid=fe4feefa8543e06d4f3c66d92c61b69c&units=metric&lang=tr`);
                setWeatherData(response.data);
            } catch (error) {
                console.log('Hava durumu verisi alınamadı:', error);
                setWeatherData(null);
            }
        };
        fetchData();
    }, [inputValue, userCity]);


    function WeatherIcon({ weatherType }) {
        switch (weatherType) {
            case 'Clear':
                return <WiDaySunny size={120} />;
            case 'Clouds':
                return <WiCloudy size={120} />;
            case 'Rain':
                return <WiRain size={120} />;
            case 'Snow':
                return <WiSnow size={120} />;
            default:
                return null;
        }
    }
    const cityData = data.find(item => item.il === inputValue);
    const cityDataUser = data.find(item => item.il === userCity);

    return (
        <div className='pt-5'>
            <div className="container mx-auto flex flex-col items-center justify-center">
                <div className="box bg-tertiary-color lg:w-7/12 rounded-2xl p-8 flex justify-between items-center">
                    <div className="text">
                        <div className="country my-2 text-primary-color lg:font-medium lg:text-4xl text-2xl font-bold">
                            {weatherData && weatherData.name}
                        </div>
                        <div className="date text-xl my-2 text-secondary-color">
                            {time.toLocaleString()}
                        </div>
                        <div className="degree font-bold my-2 lg:text-7xl text-4xl">
                            {weatherData && Math.round(weatherData.main.temp)}°C
                        </div>
                        <div className="description my-2 lg:text-3xl text-2xl  font-semibold">
                            {weatherData && weatherData.weather[0].description}
                        </div>
                        <div className="night flex font-bold flex-col mr-4 text-lg">
                            <span className='font-medium'>Hissedilen Sıcaklık</span>
                            {weatherData && weatherData.main.feels_like}°C
                        </div>
                        <div className='flex my-5'>
                            <div className="min flex font-bold flex-col mr-6 text-lg">
                                <span className='font-medium'>Min.</span>
                                {weatherData && Math.round(weatherData.main.temp_min)}°C
                            </div>
                            <div className="max flex font-bold flex-col mr-6 text-lg">
                                <span className='font-medium'>Max.</span>
                                {weatherData && Math.round(weatherData.main.temp_max)}°C
                            </div>
                            <div className="humidity flex font-bold flex-col mr-4 text-lg">
                                <span className='font-medium'>Nem</span>
                                {weatherData && weatherData.main.humidity}%
                            </div>
                        </div>
                    </div>
                    <div className="img lg:w-2/12">
                        {weatherData && <WeatherIcon weatherType={weatherData.weather[0].main} />}
                    </div>
                </div>
                <div className="gezi ">
                    <h2 className='text-center my-5'>{userCity && `Turistik Yerler (${inputValue ? inputValue : userCity})`}</h2>
                    <div className='flex  flex-wrap items-center justify-center'>
                        {inputValue ?
                            (cityData && cityData.PlacesToVisit ?
                                cityData.PlacesToVisit.map((item, index) => <div className='bg-tertiary-color shadow-2xl text-primary-color mx-2 lg:w-60 lg:h-60  w-40 h-40 flex justify-center items-center text-center  font-bold rounded-full my-2 '>{item.ad}</div>) :
                                <div>Gezilecek yerler bulunamadı.</div>
                            ) :
                            (cityDataUser && cityDataUser.PlacesToVisit ?
                                cityDataUser.PlacesToVisit.map((item, index) => <div className='bg-tertiary-color shadow-2xl text-primary-color mx-2 lg:w-60 lg:h-60  w-40 h-40 flex justify-center items-center text-center  font-bold rounded-full my-2 '>{item.ad}</div>) :
                                <div>Gezilecek yerler bulunamadı.</div>
                            )
                        }
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Body;
