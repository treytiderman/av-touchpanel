<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile, getJSON } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "Passcode",
    "file": "PasscodePage",
    "heading": "Enter code to continue...",
    "passcodes": [
      {
        "code": "123",
        "page": "home",
      },
      {
        "code": "777",
        "configFile": "examples/small.json",
      }
    ]
  }

  // Components
  import Keypad from '../components/Keypad.svelte'

  // Variables
  let passcodes = config.passcodes
  $: textFeedback = ""

  // Functions
  function confirmRoomState(configFilePath) {

    // Add "/" to the start of the file name if it isn't there already
    // Add "/configs" to the start of the file name if it isn't there already
    // Add ".json" to the end of the file name if it isn't there already
    let configFileName = configFilePath
    configFileName = configFileName.startsWith("/") ? configFileName : `/${configFileName}`
    configFileName = configFileName.startsWith("/configs") ? configFileName : `/configs${configFileName}`
    configFileName = configFileName.endsWith(".json") ? configFileName : `${configFileName}.json`

    // GET the JSON and load it as the current config
    console.log("config file name", configFileName);
    textFeedback = "Loading."
    let timeout = setInterval(() => {
      textFeedback += "."
      if (textFeedback.length > 12) textFeedback = "Loading."
    }, 250);
    getJSON(configFileName).then(json => {
      setTimeout(() => {        
        clearInterval(timeout);
        $configFile = json
        $router.popup = ""
        $router.page = $configFile.startup.page
      }, 2000);
    })

  }
  function keypadEnter(event) {
    const codeEntered = event.detail
    console.log("codeEntered", codeEntered)
    passcodes.forEach(passcode => {      
      if (codeEntered === passcode.code) {
        if (passcode.configFile) {
          textFeedback = "Loading..."
          console.log(passcode.configFile)
          confirmRoomState(passcode.configFile)
        }
        else if (passcode.page) {
          textFeedback = "Sucess"
          console.log(passcode.page)
          $router.popup = ""
          $router.page = passcode.page
        }
      }
      else textFeedback = "Wrong code. Try again..."
    })
  }

  // Debug
  $: console.log("config", config)

</script>

<!-- HTML -->
<section>
  <Keypad
    on:enter={keypadEnter}
  />
  <p>{textFeedback}</p>
</section>

<!-- CSS -->
<style>
  section {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: var(--gap);
    align-items: flex-start;
    justify-content: center;
  }
</style>
