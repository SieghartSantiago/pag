//! PANTALLA DE CARGA

window.addEventListener('load', () => {
  const loader = document.getElementById('loader')
  loader.classList.add('fade-out')

  setTimeout(() => {
    loader.style.display = 'none'
  }, 500) // Tiempo suficiente para que termine la transición
})

const tanqueHtml = document.getElementById('tanque')
const displaySpHtml = document.getElementById('display-sp')
const displayPvHtml = document.getElementById('display-pv')
const displayCvHtml = document.getElementById('display-cv')

const potenciometroHtml = document.getElementById('potenciometro')
const btnMarchaHtml = document.getElementById('btn-marcha')
const btnParadaHtml = document.getElementById('btn-parada')

//! WEBSOCKET

// Inicializa el objeto del WebSocket
const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://'
const socket = new WebSocket(protocol + location.host + ':81/')

// Cuando se detecta un mensaje del WebSocket
socket.onmessage = function (event) {
  const message = JSON.parse(event.data) // Agarra el JSON del WebSocket y lo transforma en un objeto normal de JavaScript

  if ('sp' in message) {
    displaySpHtml.innerText = message.sp
    potenciometroHtml.value = message.sp
  }
  if ('pv' in message) {
    displayPvHtml.innerText = message.pv
    let pvPorcentaje = message.pv / 3
    tanque.style.setProperty('--nivel', pvPorcentaje + '%')
  }
  if ('cv' in message){
    displayCvHtml.innerText = message.cv
  }
  if ('marcha' in message) {
    if (message.marcha) {
      btnMarchaHtml.style.backgroundColor = '#00ff00'
      btnParadaHtml.style.backgroundColor = '#910d0d'
    } else {
      btnMarchaHtml.style.backgroundColor = '#055205'
      btnParadaHtml.style.backgroundColor = '#ff0000'
    }
  }

  // Actualizar el estado visualmente en la página web
  // console.log(message.tanque)
  //   if ('puntosLocal' in message) {
  //     htmlPuntajeLocal.innerText = message.puntosLocal.toString().padStart(3, '0')
  //   }
  //   if ('puntosVisitante' in message) {
  //     htmlPuntajeVisitante.innerText = message.puntosVisitante
  //       .toString()
  //       .padStart(3, '0')
  //   }
}

// Cuando el WebSocket abre
socket.onopen = function (event) {
  console.log('Conexión WebSocket abierta')

  // Ahora que la conexión está abierta, puedes enviar mensajes
  socket.send(JSON.stringify({ request: 'getStatus' })) // Envía un mensaje al ESP8266
}

// Cuando el WebSocket detecta algun error
socket.onerror = function (error) {
  console.error('Error en WebSocket:', error)
}

// Cuando el WebSocket cierra
socket.onclose = function (event) {
  console.log('Conexión WebSocket cerrada', event)
}

potenciometroHtml.addEventListener('input', () => {
    socket.send(JSON.stringify({potenciometro: potenciometroHtml.value}))
})

btnMarchaHtml.addEventListener('click', () => {
    socket.send(JSON.stringify({btnMarcha: true}))
})

btnParadaHtml.addEventListener('click', () => {
    socket.send(JSON.stringify({btnParada: true}))
})
