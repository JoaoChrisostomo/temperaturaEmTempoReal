const api ={
    key: "60d3246f6f1c6d2c086d085b235c8cdc",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt br",
    units: "metric"
}

const city = document.querySelector('.city');
const date = document.querySelector('.date');
const containerIcon = document.querySelector('.container__icon');
const containerTemp = document.querySelector('.container__temp');
const tempNumber = document.querySelector('.container__temp div');
const tempUnit = document.querySelector('.container__temp i');
const weather = document.querySelector('.weather');
const searchInput = document.querySelector('.form_control');
const searchButton = document.querySelector('.btn');
const low_high = document.querySelector('.low__high');