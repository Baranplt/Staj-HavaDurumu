import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { CiSearch } from 'react-icons/ci';
import Axios from 'axios';

function Suggestions({ suggestions, onSuggestionClick }) {
    if (!suggestions.length) return null;

    return (
        <ul>
            {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => onSuggestionClick(suggestion)}>{suggestion}</li>
            ))}
        </ul>
    );
}

function Header({ onInputChange }) {
    const [time, setTime] = useState(new Date());
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = async (event) => {
        const value = event.target.value;
        setInputValue(value);
        onInputChange(value);
        try {
            const response = await Axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=fe4feefa8543e06d4f3c66d92c61b69c&units=metric&lang=tr`);
            const cities = response.data.list.map(city => city.name);
            setSuggestions(cities);
        } catch (error) {
            console.log('Veri alınamadı:', error);
        }
    };

    const handleSuggestionClick = (city) => {
        setInputValue(city);
        setSuggestions([]);
        onInputChange(city);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setSuggestions([]);
        }, 100);
    };

    return (
        <div className="w-full bg-[#F6F6F6]">
            <div className="container mx-auto">
                <div className="flex justify-between lg:justify-start items-center py-5 px-2 lg:px-0">
                    <div className="logo lg:w-16 w-12 lg:mr-7 mr-5">
                        <Logo />
                    </div>
                    <div className="search relative flex items-center bg-white rounded-full lg:w-9/12 px-2 py-2">
                        <div className="icon font-bold">
                            <CiSearch size={30} className="text-black" />
                        </div>
                        <div className="input text-secondary-color w-full">
                            <input
                                className="px-2 outline-none w-full max-w-full"
                                value={inputValue}
                                autoCapitalize='off'
                                onChange={handleChange}
                                onBlur={handleInputBlur}
                                type="text"
                                placeholder="Şehir veya Posta Kodu Ara"
                            />

                        </div>
                    </div>
                    <div className="time lg:w-1/12 text-center">{time.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}

export default Header;
