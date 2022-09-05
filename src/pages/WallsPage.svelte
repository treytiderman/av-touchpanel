<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile, getJSON } from '../js/global.js'

  // Configuration
  export let config = {
    "name": "Room Combining",
    "file": "WallsPage",
    "roomName": "A",
    "walls": [ 1, 1 ],
    "rooms": [
      {
        "id": 1,
        "name": "A"
      },
      {
        "id": 2,
        "name": "B"
      },
      {
        "id": 3,
        "name": "C"
      }
    ],
    "roomStates": [
      {
        "id": 1,
        "name": "A",
        "configFile": "a.json",
        "walls": [ 1, 0 ],
        "roomNames": [ "A" ]
      },
      {
        "id": 1,
        "name": "A",
        "configFile": "a.json",
        "walls": [ 1, 1 ],
        "roomNames": [ "A" ]
      },
      {
        "id": 2,
        "name": "A+B",
        "configFile": "a-b.json",
        "walls": [ 0, 1 ],
        "roomNames": [ "A", "B" ]
      },
      {
        "id": 3,
        "name": "A+B+C",
        "configFile": "a-b-c.json",
        "walls": [ 0, 0 ],
        "roomNames": [ "A", "B", "C" ]
      }
    ]
  }

  // Variables
  let roomName = config.roomName
  let rooms = config.rooms
  let roomStates = config.roomStates
  let walls = config.walls

  // Functions
  function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }
  function wallClick(index) {
    if (walls[index] === 0) walls[index] = 1
    else walls[index] = 0
    walls = walls
  }
  function confirmRoomState() {

    // Add "/" to the start of the file name if it isn't there already
    // Add ".json" to the end of the file name if it isn't there already
    let configFileName = currentState.configFile
    configFileName = configFileName.startsWith("/") ? configFileName : `/${configFileName}`
    configFileName = configFileName.endsWith(".json") ? configFileName : `${configFileName}.json`

    // GET the JSON and load it as the current config
    console.log("config file name", configFileName);
    confimButtonText = "Loading."
    let timeout = setInterval(() => {
      confimButtonText += "."
      if (confimButtonText.length > 12) confimButtonText = "Loading."
    }, 500);
    getJSON(configFileName).then(json => {
      setTimeout(() => {        
        clearInterval(timeout);
        $configFile = json
        $router.popup = ""
        $router.page = $configFile.startup.page
      }, 2000);
    })

  }
  function getCurrentState(walls) {
    let currentState
    roomStates.forEach(state => {
      if (arrayEquals(walls, state.walls)) {
        currentState = state
      }
    })
    return currentState
  }

  // Dynamic Variables
  $: currentState = getCurrentState(walls)
  $: confimButtonText = `Confirm room state is ${currentState.name}`
  $: connectedRoom = (room) => {
    let isConnectedRoom = false
    roomStates.forEach(state => {
      if (arrayEquals(walls, state.walls)) {
        state.roomNames.forEach(name => {
          if (room.name === name) isConnectedRoom = true
        })
      }
    })
    return isConnectedRoom
  }

  // Debug
  $: console.log("roomStates", roomStates)
  $: console.log("currentState", currentState)

</script>

<!-- HTML -->
<section>
  <h4>Tap the walls to add or remove...</h4>

  <!-- Rooms -->
  <div class="rooms">
    {#each rooms as room, index}

      <!-- If last room -->
      {#if index === rooms.length-1}

        <!-- Room -->
        <div 
          class:thisRoom={roomName === room.name}
          class:connectedRoom={connectedRoom(room)}
        > {room.name}
        </div>
      
      <!-- Not last room -->
      {:else}

        <!-- Room -->
        <div 
          class:thisRoom={roomName === room.name}
          class:connectedRoom={connectedRoom(room)}
        > {room.name}

          <!-- Wall -->
          <button 
            class:noWall={!walls[index]}
            on:click={() => wallClick(index)}
          ></button>

        </div>
      {/if}
    {/each}
  </div>
  <button 
    class="confirm"
    on:click={() => confirmRoomState()}
  >
    {confimButtonText}
  </button>
</section>

<!-- CSS -->
<style>
  section {
    display: grid;
    gap: var(--gap);
  }
  .confirm {
    /* margin-left: auto; */
    margin-right: auto;
    color: var(--color-text-green);
    background-color: var(--color-bg-green);
  }
  .rooms {
    --wallWidth: .5rem;
    display: flex;
    gap: var(--wallWidth);
    border: var(--border);
    border-color: var(--color-text);
    border-radius: var(--radius);
    overflow: hidden;
  }
  div > div {
    position: relative;
    width: 16rem;
    min-height: 8rem;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    font-size: 2rem;
    border-radius: 0;
    color: var(--color-text-dim);
    background-color: var(--color-bg);
    /* border: var(--border); border-color: red; */
  }
  div > div.connectedRoom {
    color: var(--color-text);
    background-color: var(--color-header);
  }
  div.rooms > div.thisRoom {
    color: var(--color-text);
    background-color: var(--color-header);
  }
  div.rooms > div.thisRoom::before {
    content: "you are here";
    font-size: .75rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 1rem);
    text-align: center;
    color: var(--color-text-dim);
  }
  div > button {
    z-index: 1;
    position: absolute;
    width: 4rem;
    height: 16rem;
    border-radius: 0;
    opacity: .8;
    top: 0;
    bottom: 0;
    right: -2.25rem;
    background-color: transparent;
  }
  div > button::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: var(--wallWidth);
    background-color: var(--color-text-bright);
  }
  div > button.noWall::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    width: var(--wallWidth);
    background-color: var(--color-header);
    background-size: 1rem 2.15rem;
    background-image: 
      linear-gradient(0deg, var(--color-bg-secondary), var(--color-bg-secondary) 50%, transparent 50%, transparent 100%);
  }
</style>