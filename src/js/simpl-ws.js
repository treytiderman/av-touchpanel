import { writable } from 'svelte/store'

// Debug
let debug = false;
function setDebug(bool) { debug = bool }
function log(text) { if (debug) console.log(text) }

// Global variables
let ws
let reconnectInterval

// Functions
function parseMessage(message) {
  /* Structure
  {
    "method": "set",
    "request": {
      "index": 1,
      "value": true
    }
  }
  {
    "method": "set",
    "request": {
      "index": 1,
      "value": 420
    }
  }
  {
    "method": "set",
    "request": {
      "index": 1,
      "value": "Strings"
    }
  }
  */
  
  // Object
  const data = JSON.parse(message)
  if      (typeof data.request.value === 'boolean') data.type = 'digital'
  else if (typeof data.request.value === 'number')  data.type = 'analog'
  else if (typeof data.request.value === 'string')  data.type = 'serial'
  
  // Return
  return data
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
    log('WebSocket: FAILED TO CONNECT');
    log('WebSocket: PLEASE REFRESH');
  }, reconnectTimeout_ms);

  // Connection request
  ws = new WebSocket(url);
  log('WebSocket: REQUESTED');

  // Events
  ws.addEventListener('open', (event) => {
    log('WebSocket: OPEN');
    // Connection active, Clear reconnect timer
    clearTimeout(reconnectInterval);
    // Request all values on OPEN
    const get = { "method": "get", "request": "" }
    ws.send(JSON.stringify(get))
  });
  ws.addEventListener('message', (event) => {
    const data = parseMessage(event.data);
    log(`RX: ${data.type} ${data.request.index} = ${data.request.value}`);
  });
  ws.addEventListener('error', (event) => {
    log('WebSocket: ERROR')
    log(event);
  });
  ws.addEventListener('close', (event) => {
    log('WebSocket: CLOSE');
    setTimeout(() => wsConnect(options), reconnectTimeout_ms);
  });
};
function createStore(wsOptions) {
  // Create Store
	const { subscribe, set, update } = writable({
    digital: [
      false,
    ],
    analog: [
      0,
    ],
    serial: [
      "not connected",
    ],
  });
  
  // Connect to Websocket and listen for updates
  wsConnect(wsOptions)
  ws.addEventListener('message', (event) => {
    const data = parseMessage(event.data);
    
    // Set value in store
    update(val => {
      val[data.type][data.request.index-1] = data.request.value
      return val
    })
  });
	
  // Return functions to listen to changes and send messages to the processor
  return {
		subscribe,
    digital: (join, value) => {
      log(`TX: digital ${join} = ${value}`)
      const data = {
        "method": "set",
        "request": {
          "index": join,
          "value": value
        }
      }
      ws.send(JSON.stringify(data))
    },
		digitalPulse: (join, time_ms = 10) => {
      log(`TX: digital pulse ${join} for ${time_ms} ms`)
      const dataPress = {
        "method": "set",
        "request": {
          "index": join,
          "value": true
        }
      }
      const dataRelease = {
        "method": "set",
        "request": {
          "index": join,
          "value": false
        }
      }
      ws.send(JSON.stringify(dataPress))
      setTimeout(() => ws.send(JSON.stringify(dataRelease)), time_ms)
    },
		analog: (join, value) => {
      log(`TX: analog ${join} = ${value}`)
      const data = {
        "method": "set",
        "request": {
          "index": join,
          "value": value
        }
      }
      ws.send(JSON.stringify(data));
    },
		serial: (join, value) => {
      log(`TX: serial ${join} = ${value}`)
      const data = {
        "method": "set",
        "request": {
          "index": join,
          "value": value
        }
      }
      ws.send(JSON.stringify(data));
    }
	};
}

// Exports
export { createStore, setDebug };