import { writable } from 'svelte/store'
import { debounce } from '../js/helper.js';

// Debug
let debug = false;
function log(text) { if (debug) console.log(text) }

// Global variables
let websocket = { readyState: 3 }
let subs = []
let reconnectInterval

// Check if config says the server is online
import { global } from './global.js';
let serverOnline = false
let tpId = 1
let tpSub = "TouchPanel"
global.subscribe(g => {
  tpId = g.config?.client?.id ?? 1
  serverOnline = g.config?.server?.online ?? false
})

// Functions
function parseMessage(message) {
  /* Structure
  {
    "method": "set",
    "subscriptionID": "pageName",
    "data": {
      "index": 1,
      "value": true
    }
  }
  {
    "method": "set",
    "subscriptionID": "pageName",
    "data": {
      "index": 1,
      "value": 420
    }
  }
  {
    "method": "set",
    "subscriptionID": "pageName",
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
function wsConnect(options, restart = false) {
  // Options
  const path = options.path || '';
  const port = options.port || 10000;
  const ip = options.ip || document.location.hostname;
  const reconnectTimeout_ms = options.reconnectTimeout_ms || 5000;
  const protocol = options.protocol || document.location.protocol === 'http:' ? 'ws' : 'wss';
  const host = options.protocol === 'wss' ? `${ip}` : `${ip}:${port}`
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
    if (restart) location.reload(true)
  })
  websocket.addEventListener('error', (event) => {
    log(`WebSocket: ERROR at ${url}`)
  })
  websocket.addEventListener('close', (event) => {
    log(`WebSocket: CLOSE at ${url}`)
    setTimeout(() => wsConnect(options, true), reconnectTimeout_ms)
  })
}
function createStore() {

  // Create Store
	const { subscribe, set, update } = writable({
    "status": "",
    "subscriptions": {
      "example": {
        "ready": true,
        "digital": [false],
        "analog": [0],
        "serial": [""]
      }
    }
  })

  // Private Function
  const backToRealFeedback = debounce(sub => {
    update(val => {
      if (val.subscriptions[sub]?.analog) {
        val.subscriptions[sub].analog[0] += 1
      }
      return val
    })
  }, 2000)
	
  // Return functions to listen to changes and send messages to the processor
  return {
    set,
		update,
		subscribe,
    addSubscription: (sub, cb) => {
      // is not a blank name
      // config says the server is online
      // is not already subscribed
      if (sub !== "" && serverOnline && subs.every(alreadySub => alreadySub !== sub)) {
        const obj = { "method": "subscribe", "subscriptionID": sub }
        websocket.send(JSON.stringify(obj))
        subs.push(sub)
      }
      subscribe(obj => {
        let subscriptionsAreReady = true
        Object.values(obj.subscriptions).forEach(subscription => {
          if (subscription.ready !== true) subscriptionsAreReady = false
        })
        if (subscriptionsAreReady && obj.subscriptions[sub]?.ready === true) {
          // log({ [sub]: obj.subscriptions[sub]});
          cb(obj.subscriptions[sub])
        }
      })
    },
    connect: (options) => {
      // Connect to Websocket
      wsConnect(options)

      // Connected
      websocket.addEventListener('open', (event) => {
        // Update Status
        update(val => { 
          val.status = "open"
          // console.log(val)
          return val
        })
      })

      // Receive message
      websocket.addEventListener('message', (event) => {
        if (JSON.parse(event.data).method === "set") {
          const obj = parseMessage(event.data)
          log(`RX[${obj.subscriptionID}]: ${obj.type} ${obj.data.index} = ${obj.data.value}`)
          update(val => {
            // Create a object for the recived data if it doesn't exist
            if (!val.subscriptions[obj.subscriptionID]) {
              val.subscriptions[obj.subscriptionID] = {"digital": [false],"analog": [0],"serial": [""]}
            }
            // Update the ws store with the new value
            val.subscriptions[obj.subscriptionID][obj.type][obj.data.index] = obj.data.value
            return val
          })
        }
        else if (JSON.parse(event.data).subscribed === true) {
          // Example { "subscribed": true, "subscriptionID": "VideoPage"}	
          const obj = JSON.parse(event.data)
          log(`RX[${obj.subscriptionID}]: subscribed = ${obj.subscribed}`)
          update(val => {
            // console.log("val", val)
            val.subscriptions[obj.subscriptionID].ready = true
            return val
          })
        }
      })

      // Error / Close
      websocket.addEventListener('error', (event) => {
        update(val => { val.status = "error"; console.log(val); return val })
      })
      websocket.addEventListener('close', (event) => {
        update(val => { val.status = "closed"; console.log(val); return val })
      })

    },

    // Send data to SIMPL modules
    digital: (sub, join, value) => {
      if (websocket.readyState === 1) {        
        log(`TX[${sub}]: digital ${join} = ${value}`)
        const data = {
          "method": "set",
          "subscriptionID": sub,
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data))
        backToRealFeedback(sub)
      }
      else log(`SEND FAILED. TX[${sub}]: digital ${join} = ${value}`)
    },
		digitalPulse: (sub, join, time_ms = 100) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: digital pulse ${join} for ${time_ms} ms`)
        const dataPress = {
          "method": "set",
          "subscriptionID": sub,
          "data": {
            "index": join,
            "value": true
          }
        }
        const dataRelease = {
          "method": "set",
          "subscriptionID": sub,
          "data": {
            "index": join,
            "value": false
          }
        }
        websocket.send(JSON.stringify(dataPress))
        setTimeout(() => websocket.send(JSON.stringify(dataRelease)), time_ms)
        backToRealFeedback(sub)
      }
      else log(`SEND FAILED. TX[${sub}]: digital pulse ${join} for ${time_ms} ms`)
    },
		analog: (sub, join, value) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: analog ${join} = ${value}`)
        const data = {
          "method": "set",
          "subscriptionID": sub,
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data))
        backToRealFeedback(sub)
      }
      else log(`SEND FAILED. TX[${sub}]: analog ${join} = ${value}`)
    },
		serial: (sub, join, value) => {
      if (websocket.readyState === 1) {    
        log(`TX[${sub}]: serial ${join} = ${value}`)
        const data = {
          "method": "set",
          "subscriptionID": sub,
          "data": {
            "index": join,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data))
        backToRealFeedback(sub)
      }
      else log(`SEND FAILED. TX[${sub}]: serial ${join} = ${value}`)
    },
		debug: (value) => {
      if (websocket.readyState === 1) {    
        log(`TX[${tpSub}]: serial ${tpId} = ${value}`)
        const data = {
          "method": "set",
          "subscriptionID": tpSub,
          "data": {
            "index": tpId,
            "value": value
          }
        }
        websocket.send(JSON.stringify(data))
        backToRealFeedback(tpSub)
      }
      else log(`SEND FAILED. TX[${tpSub}]: serial ${tpId} = ${value}`)
    }
	}
}

// Exports
export const ws = createStore()
export function setDebug(bool) { debug = bool }
