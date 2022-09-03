import { createStore, setDebug } from './simpl-ws'

// Uncomment to see all websocket info in the Chrome dev tools
setDebug(true)

// Websocket connections
// export const ws = createStore({ ip: '192.168.1.69', port: 10001, path: 'ActivityPage' })

/* Examples

// Normal
export const example1 = createStore({ port: 10000, path: 'example1' })
export const example2 = createStore({ port: 10000, path: 'example2' })

// If web page is not served from the processor. Specify the IP of the processor
// If the websocket port is not 10000. Specify the Port of the websocket
export const example = createStore({
  ip: '192.168.1.9',
  port: 10000,
  path: 'path'
})

// In Page File
import { ActivityPage } from '../js/simpl-ws-connections.js';

const join = 1
const value = 4
const string = "hello"

ActivityPage.digital(join, true)
ActivityPage.digital(join, false)
ActivityPage.digitalPulse(join)
ActivityPage.analog(join, value)
ActivityPage.serial(join, string)

{
  "id":"ActivityPage",
  "method":"get",
  "data": ""
}
{
  "id":"ActivityPage",
  "method":"set",
  "data": {
    "index": 1,
    "value": true
  }
}

*/