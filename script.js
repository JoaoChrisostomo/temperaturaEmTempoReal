const api = {
  key: '60d3246f6f1c6d2c086d085b235c8cdc',
  base: 'https://api.openweathermap.org/data/2.5/',
  lang: 'pt_br',
  units: 'metric'
}

const city = document.querySelector('.city') // aqui esta pegando o elemento city
const time = document.querySelector('.time') // aqui esta pegando o elemento time
const date = document.querySelector('.date') // aqui esta pegando o elemento date
const container_img = document.querySelector('.container-img') // aqui esta pegando o elemento container_img
const container_temp = document.querySelector('.container-temp')
const temp_number = document.querySelector('.container-temp div')
const temp_unit = document.querySelector('.container-temp span')
const weather_t = document.querySelector('.weather')
const search_input = document.querySelector('.form-control')
const search_button = document.querySelector('.btn')
const low_high = document.querySelector('.low-high')

window.addEventListener('load', () => {
  //geolocation é para pegar a localização do usuario e pegar a latitude e longitude

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError) // o metodo navigator.geolocation do javascript pega a localização do usuario e passa para a função setPosition e showError caso não consiga pegar a localização do usuario
  } else {
    alert('navegador não suporta geolozalicação')
  }

  function setPosition(position) {
    // esta função pega a latitude e longitude
    console.log(position)
    let lat = position.coords.latitude // aqui esta sendo passado a latitude
    let long = position.coords.longitude // aqui esta sendo passado a longitude
    coordResults(lat, long) //este coordResults é para pegar a latitude e longitude
  }
  function showError(error) {
    alert(`erro: ${error.message}`)
  }
})


// MODAL
const modal = document.querySelector('.modal-container')

function openModal() {
  modal.classList.add('active')
}

function closeModal() {
  modal.classList.remove('active')
}

function coordResults(lat, long) {
  // aqui esta sendo passado a latitude e longitude
  fetch(
    // este fetch é para pegar a latitude e longitude
    `${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`) // se der erro, mostra o erro
      }
      return response.json()
    })
    .catch(error => {
      alert(error.message)
    })
    .then(response => {
      // esse then é para pegar a resposta do fetch
      displayResults(response)
    })
}

search_button.addEventListener('click', function () {
  searchResults(search_input.value) // aqui esta sendo passado o valor do input
})

search_input.addEventListener('keypress', enter)
function enter(event) {
  // esta função é para pegar o enter
  key = event.keyCode // aqui esta pegando o valor da tecla
  if (key === 13) {
    console.log('você apertou o enter')
    // se o usuario apertar enter
    searchResults(search_input.value)
  }
}

function searchResults(city) {
  // esta funcao searchResults é para pegar a cidade, e passar para a função displayResults
  fetch(
    `${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}` // aqui esta sendo passado a cidade e a chave da api para pegar a cidade e a temperatura da cidade pesquisada pelo usuario
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(`http error: status ${response.status}`)
      }
      return response.json()
    })
    .catch(error => {
      alert(error.message)
    })
    .then(response => {
      displayResults(response)
    })
}

function displayResults(weather) {
  // esta função é para mostrar os resultados da pesquisa do usuario no html e mostrar a temperatura em graus celsius e fahrenheit
  console.log(weather)

  city.innerText = `${weather.name}, ${weather.sys.country}`

  //aqui eu vou passar o horario atual de cada cidade
  let time = new Date() // aqui esta pegando o horario atual
  let hour = time.getHours()
  let minute = time.getMinutes() // aqui esta pegando o minuto atual
  let ampm = hour >= 12 ? 'PM' : 'AM' // aqui esta pegando o AM ou PM
  let time_now = `${hour}:${minute} ${ampm}`
  time.innerHTML = time_now

  let now = new Date()
  date.innerText = dateBuilder(now) // aqui esta sendo passado a data atual para mostrar no html

  let iconName = weather.weather[0].icon
  container_img.innerHTML = `<img src="./icons/${iconName}.png">`

  let temperature = `${Math.round(weather.main.temp)}` // aqui esta pegando a temperatura da cidade
  temp_number.innerHTML = temperature
  temp_unit.innerHTML = `°c`

  weather_tempo = weather.weather[0].description // aqui esta pegando o tempo da cidade pesquisada pelo usuario
  weather_t.innerText = capitalizeFirstLetter(weather_tempo) // aqui esta sendo passado o valor da temperatura para o weather_t e a função capitalizeFirstLetter é para deixar a primeira letra maiuscula

  low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    // aqui esta pegando a temperatura minima e maxima e mostrando no html
    weather.main.temp_max
  )}°c`

  // salvar os dados no localStorage
  const saveLocalStorage = []
  saveLocalStorage.push(weather)
  localStorage.setItem('weather', JSON.stringify(saveLocalStorage))
  localStorage.setItem('city', weather.name)
  localStorage.setItem('country', weather.sys.country)
  localStorage.setItem('temperature', temperature)
  localStorage.setItem('weather_tempo', weather_tempo)
  localStorage.setItem('low_high', low_high.innerText)
  localStorage.setItem('time_now', time_now)
  localStorage.setItem('date', date.innerText)
}

// const saveLocalStorage = [
//     {
//         name: weather.name,
//         country: weather.sys.country,
//         temp: weather.main.temp,
//         temp_min: weather.main.temp_min,
//         temp_max: weather.main.temp_max,
//         description: weather.weather[0].description,
//         icon: weather.weather[0].icon,
//         time: time_now
//     }
//   ]
//     localStorage.setItem('weather', JSON.stringify(saveLocalStorage))

function dateBuilder(d) {
  let days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ]
  let months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julio',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

  let day = days[d.getDay()] //getDay: 0-6
  let date = d.getDate()
  let month = months[d.getMonth()]
  let year = d.getFullYear()

  return `${day}, ${date} ${month} ${year}`
}

container_temp.addEventListener('click', changeTemp) // aqui esta adicionando o evento de
function changeTemp() {
  temp_number_now = temp_number.innerHTML

  if (temp_unit.innerHTML === '°c') {
    let f = temp_number_now * 1.8 + 32
    temp_unit.innerHTML = '°f'
    temp_number.innerHTML = Math.round(f)
  } else {
    let c = (temp_number_now - 32) / 1.8
    temp_unit.innerHTML = '°c'
    temp_number.innerHTML = Math.round(c)
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
