import leafletStyles from './node_modules/leaflet/dist/leaflet.css'
import styles from './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import Footer from './src/components/Footer'

// Test proxy
window.fetch('http://35.196.121.180/mta/status/weekendboroughstatus.js')

// Proof of concept Leaflet map tiles
// Artificial wait because map might initialize while DOM layout is still doing stuff
var mymap = L.map('map', {
  attributionControl: false,
  zoomControl: false,
  center:  {lat: 40.800766363190576, lng: -73.92056884244084},
  zoom: 15
})

L.tileLayer('./images/tiles/{z}/{x}/{y}.png', {
  attribution: false,
  maxZoom: 16,
  minZoom: 14
}).addTo(mymap)

// Proof of concept React

const mountNode = document.getElementById('react-footer')
ReactDOM.render(<Footer />, mountNode)