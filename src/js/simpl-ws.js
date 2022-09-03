import { writable } from 'svelte/store'

// Debug
let debug = false;
function log(text) { if (debug) console.log(text) }

// Global variables
let websocket = { readyState: 3 }
let reconnectInterval

// Functions
function parseMessage(message) {
  /* Structure
  {
    "id":"pageName",
    "method":"get",
    "data": ""
  }
  {
    "id": "pageName",
    "method": "set",
    "data": {
      "index": 1,
      "value": true
    }
  }
  {
    "id": "pageName",
    "method": "set",
    "data": {
      "index": 1,
      "value": 420
    }
  }
  {
    "id": "pageName",
    "method": "set",
    "data": {
      "index": 1,
      "value": "Strings"
    }
  }
  */

  // Object
  const obj = JSON.parse(message)
  if      (typeof obj.data.value === 'boolean') obj.type = 'digital'
  else if (typeof obj.data.value === 'number')  obj.type = 'analog'
  else if (typeof obj.data.value === 'string')  obj.type = 'serial'

  // Return
  return obj
}
function wsConnect(options) {
  // Options
  const path = options.path || '';
  const port = options.port || 10000;
  const ip = options.ip || document.location.hostname;
  const reconnectTimeout_ms = options.reconnectTimeout_ms || 5000;
  const protocol = options.protocol || document.location.protocol === 'http:' ? 'ws' : 'wss';
  const host = options.protocol === 'wss' ? `${ip}` : `${ip}:${port}`
  // const url = `${protocol}://${ip}:${port}/${path}`
  const url = `${protocol}://${host}/${path}`

  // Failed to Connect, Start reconnect Timer
  reconnectInterval = setTimeout(() => {
    log(`WebSocket ${url}: FAILED TO CONNECT`)
    log(`WebSocket ${url}: PLEASE REFRESH`)
  }, reconnectTimeout_ms)

  // Connection request
  websocket = new WebSocket(url)
  log(`WebSocket: REQUESTED at ${url}`)

  // Events
  websocket.addEventListener('open', (event) => {
    log(`WebSocket: OPEN at ${url}`)
    // Connection active, Clear reconnect timer
    clearTimeout(reconnectInterval)
  })
  websocket.addEventListener('error', (event) => {
    log(`WebSocket: ERROR at ${url}`)
    log(event)
  })
  websocket.addEventListener('close', (event) => {
    log(`WebSocket: CLOSE at ${url}`)
    setTimeout(() => wsConnect(options), reconnectTimeout_ms)
  })
}
function createStore() {
  // Create Store
	const { subscribe, set, update } = writable({
    "status": "",
    "subscriptions": {
      "pageName": {
        "digital": [false],
        "analog": [0],
        "serial": [""]
      }
    }
  })
	
  // Return functions to listen to changes and send messages to the processor
  return {
		subscribe,
    // set,
    // update,
    connect: (options) => {
      // Connect to Websocket
      wsConnect(options)

      // Connected
      websocket.addEventListener('open', (event) => {
        // Update Status
        update(val => { val.status = "open"; return val })
        // Request all values
        const get = { "method": "get", "data": "" }
        websocket.send(JSON.stringify(get))
      })

      // Recive message
      websocket.addEventListener('message', (event) => {
        const obj = parseMessage(event.data)
        log(`RX[${obj.id}]: ${obj.type} ${obj.data.index} = ${obj.data.value}`)
        update(val => {
          // Create a object for the recived data if it doesn't exist
          if (!val[obj.id]) {
            val[obj.id] = {"digital": [false],"analog": [0],"serial": [""]}
          }
          // Update the ws store with the new value
          val[obj.id][obj.type][obj.data.index] = obj.data.value
          return val
        })
      })

      // Error / Close
      websocket.addEventListener('error', (event) => {
        update(val => { val.status = "error"; return val })
      })
      websocket.addEventListener('close', (event) => {
        update(val => { val.status = "closed"; return val })
      })

    },

    // Send data to SIMPL modules
    digital: (sub, join, value) => {
      if (websocket.readyState === 1) {        
        log(`TX[${sub}]: digital ${join} = ${value}`)
        const data = {
          "id": sub,
          "method": "set",
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data))
      }
      else log(`SEND FAILED. TX[${sub}]: digital ${join} = ${value}`)
    },
		digitalPulse: (sub, join, time_ms = 100) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: digital pulse ${join} for ${time_ms} ms`)
        const dataPress = {
          "id": sub,
          "method": "set",
          "data": {
            "index": join,
            "value": true
          }
        }
        const dataRelease = {
          "id": sub,
          "method": "set",
          "data": {
            "index": join,
            "value": false
          }
        }
        websocket.send(JSON.stringify(dataPress))
        setTimeout(() => websocket.send(JSON.stringify(dataRelease)), time_ms)
      }
      else log(`SEND FAILED. TX[${sub}]: digital pulse ${join} for ${time_ms} ms`)
    },
		analog: (sub, join, value) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: analog ${join} = ${value}`)
        const data = {
          "id": sub,
          "method": "set",
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data));
      }
      else log(`SEND FAILED. TX[${sub}]: analog ${join} = ${value}`)
    },
		serial: (sub, join, value) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: serial ${join} = ${value}`)
        const data = {
          "id": sub,
          "method": "set",
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data));
      }
      else log(`SEND FAILED. TX[${sub}]: serial ${join} = ${value}`)
    }
	}
}

// Exports
export const ws = createStore()
export function setDebug(bool) { debug = bool }
