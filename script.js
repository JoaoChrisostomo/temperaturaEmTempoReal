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
const modal = document.querySelector('.modal-container')

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
  } else {
    alert('navegador não suporta geolozalicação')
  }

  function setPosition(position) {
    console.log(position)
    let lat = position.coords.latitude
    let long = position.coords.longitude
    coordResults(lat, long)
  }
  function showError(error) {
    alert(`erro: ${error.message}`)
  }
})

// MODAL
function openModal() {
  modal.classList.add('active')
  document.querySelector('.modal-body').innerHTML = `
    <h2 class="modal-title">${capitalizeFirstLetter(city.innerHTML)}</h2>
    <div class="date">${capitalizeFirstLetter(date.innerText)}</div>
    <div class="modal-body">
      <p>${weather_t.innerHTML}</p>
      <p>${temp_number.innerHTML}°${temp_unit.innerHTML}</p>
      <p>${low_high.innerHTML}</p>
    </div>
  `
}
function closeModal() {
  modal.classList.remove('active')
}


// Esta funcao eu utilizo o fetch para pegar a cidade e a temperatura da cidade pesquisada pelo usuario e passar para a função displayResults
function coordResults(lat, long) {
  fetch(
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
      displayResults(response)
    })
}

// aqui eu estou adicionando o click pelo mouse e o click pela tecla enter e me retornando o resultado de cada cidade
search_button.addEventListener('click', function () {
  searchResults(search_input.value)
})
search_input.addEventListener('keypress', enter)
function enter(event) {
  key = event.keyCode
  if (key === 13) {
    console.log('você apertou o enter')
    searchResults(search_input.value)
  }
}

// A função searchResults é responsavel por pegar o valor do input e passar para a função coordResults
function searchResults(city) {
  fetch(
    `${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`
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
// Aqui eu estou pegando o resultado da função coordResults e passando para a função displayResults
function displayResults(weather) {
  console.log(weather)
  city.innerText = `${weather.name}, ${weather.sys.country}`

  let time = new Date()
  let hour = time.getHours()
  let minute = time.getMinutes()
  let ampm = hour >= 12 ? 'PM' : 'AM'
  let time_now = `${hour}:${minute} ${ampm}`
  time.innerHTML = time_now

  let now = new Date()
  date.innerText = dateBuilder(now)

  let iconName = weather.weather[0].icon
  container_img.innerHTML = `<img src="./icons/${iconName}.png">`

  let temperature = `${Math.round(weather.main.temp)}`
  temp_number.innerHTML = temperature
  temp_unit.innerHTML = `°c`

  weather_tempo = weather.weather[0].description
  weather_t.innerText = capitalizeFirstLetter(weather_tempo)

  low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    weather.main.temp_max
  )}°c`

    // Aqui eu estou salvando os dados da cidade pesquisada pelo usuario no localStorage
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

    const resgatar = localStorage.getItem('weather')
    if (resgatar) {
      const resgatar_json = JSON.parse(resgatar)
      console.log(resgatar_json)
    }

    sessionStorage.setItem('weather', JSON.stringify(saveLocalStorage))
    sessionStorage.setItem('city', weather.name)
}

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

  let day = days[d.getDay()]
  let date = d.getDate()
  let month = months[d.getMonth()]
  let year = d.getFullYear()

  return `${day}, ${date} ${month} ${year}`
}

// A ffunction changeTemp é responsavel por mudar a temperatura da cidade pesquisada pelo usuario
container_temp.addEventListener('click', changeTemp)
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

// A function capitalizeFirstLetter é responsavel por colocar a primeira letra da string em maiuscula
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
