import { writable } from 'svelte/store'

// Config to load if can't pull config from server (processor)
let failedConfig = {
  "server": {
    "online": false,
  },
  "client": {
    "id": 1,
    "theme": "dark",
    "scale": 1,
    "scaleMobile": 1,
    "rotate": 0,
    "startup": {
      "page": "ConfigPage",
      "popup": ""
    }
  },
  "topBar": {
    "show": true,
    "homePage": "ConfigPage",
    "powerPage": "",
    "popups": [],
    "toggles": []
  },
  "pages": {
    "ConfigPage": {
      "name": `No config found`,
      "file": `ConfigPage`
    }
  }
}

// Make a GET request for a JSON
export async function getJSON(uri) {

  // Fetch options
  // console.log("document.location", document.location);
  const origin = document.location.origin
  let pathname = document.location.pathname
  pathname = pathname.replace('index.html','')
  const baseUrl = origin + pathname
  console.log("pathname", pathname);
  const url = `${baseUrl}${uri}`
  console.log("config file url", url);
  const options = { method: 'GET' }

  // Fetch JSON
  let response = await fetch(url, options)
  if (!response.ok) { 
    failedConfig.pages.ConfigPage.name = `No config found at ${url}`
    return failedConfig
  }
  try {
    let res = await response.json()
    console.log("config file", res)
    return res
  }
  catch (error) {
    failedConfig.pages.ConfigPage.name = `${url} is not a valid JSON`
    return failedConfig
  }

}

// Figure out the config file to use
export function getConfigFileName() {

  // Default file is "/config.json" in the same folder the web page is served from
  // If a search query is specified in the url, use that config file

  // Look if there is a "search" in the URL
  // Example: 192.168.1.1/html/index.html?config=tp1
  // where "config=tp1" is the key value pair we are looking for
  // If the key is "config" then use the value 
  // Else default to "config" for the file name
  let configFileName = getUrlSearchs().config || "/configs/config.json"
  
  // Remove "/" from the start of the file name if it isn't there already
  // Add ".json" to the end of the file name if it isn't there already
  configFileName = configFileName[0] === "/" ? configFileName.substring(1) : configFileName
  configFileName = configFileName.endsWith(".json") ? configFileName : `${configFileName}.json`

  // Return the file name to get from the server
  // console.log(configFileName)
  return configFileName
    
}

// Check URL for "...?edit=true" or "...?config=tp1.json&edit=true"
export function getUrlSearchs() {

  // Look if there is a "search" in the URL
  // Example: 192.168.1.1/html/index.html?config=tp1.json&edit=true
  // where "?config=tp1.json&edit=true" are the key value pairs we are looking for
  let searchObj = {}
  // const urlSearchs = document.location.search.toLowerCase().split('&')
  const urlSearchs = document.location.search.split('&')
  urlSearchs[0] = urlSearchs[0].substring(1) // remove first char
  urlSearchs.forEach(urlSearch => {
    let pair = urlSearch.split("=")
    let key = pair[0]
    let value = pair[1]
    searchObj[key] = value
  });

  // Return
  // console.log(searchObj)
  return searchObj

}

// Check URL for "...#edit" or "...#whatever"
export function getUrlHash() {

  // Look if there is a "hash" in the URL
  const urlHash = document.location.hash.toLowerCase().substring(1)

  // Return
  // console.log(urlHash)
  return urlHash
    
}

// Export Stores
export const config = writable({})
export const router = writable({})
export const global = writable({})
