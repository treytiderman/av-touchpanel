import { createStore, setDebug } from './simpl-ws'

// Uncomment to see all websocket info in the Chrome dev tools
// setDebug(true)

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

*/

// Websocket connections
export const store = createStore({ ip: '192.168.1.69', port: 10000, path: 'ws' })