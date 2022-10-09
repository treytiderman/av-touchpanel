<!-- Javascript -->
<script>

  // Stores
  import { global, getJSON } from '../js/global.js'
 
  // Components
  import Icon from '../components/Icon.svelte'

  // Configuration
  export let config = {
    "name": "Room Combining",
    "file": "WallsPage",
    "roomName": "A",
    "walls": [ 1, 1 ],
    "wallSensor": false,
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
        "configFile": "configs/a.json",
        "walls": [ 1, 0 ],
        "roomNames": [ "A" ]
      },
      {
        "id": 2,
        "name": "A",
        "configFile": "configs/a.json",
        "walls": [ 1, 1 ],
        "roomNames": [ "A" ]
      },
      {
        "id": 3,
        "name": "A+B",
        "configFile": "configs/a-b.json",
        "walls": [ 0, 1 ],
        "roomNames": [ "A", "B" ]
      },
      {
        "id": 4,
        "name": "A+B+C",
        "configFile": "configs/a-b-c.json",
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
  let wallSensor = config.wallSensor

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

    // Remove "/" to the start of the file name if it isn't there already
    // Add ".json" to the end of the file name if it isn't there already
    let configFileName = currentState.configFile
    configFileName = configFileName[0] === "/" ? configFileName.substring(1) : configFileName
    configFileName = configFileName.endsWith(".json") ? configFileName : `${configFileName}.json`

    // GET the JSON and load it as the current config
    console.log("config file name", configFileName);
    confimButtonText = "Loading."
    let timeout = setInterval(() => {
      confimButtonText += "."
      if (confimButtonText.length > 12) confimButtonText = "Loading."
    }, 250);
    getJSON(configFileName).then(json => {
      setTimeout(() => {        
        clearInterval(timeout);
        $global.config = json
        $global.router.popup = ""
        $global.router.page = $global.config.client.startup.page
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
          {#if wallSensor}
            <button class:noWall={!walls[index]}></button>
          {:else}
            <button 
              class:noWall={!walls[index]}
              on:click={() => wallClick(index)}
            >
              {#if walls[index]}
                <span><Icon name="close"/></span>
              {:else}
                <span><Icon name="add"/></span>
              {/if}
            </button>
          {/if}

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
    margin-right: auto;
    color: var(--color-text-green);
    background-color: var(--color-bg-green);
  }
  .rooms {
    --wallWidth: .20rem;
    display: flex;
    gap: var(--wallWidth);
    border: var(--border);
    border-color: var(--color-text-dim);
    border-radius: var(--radius);
    border-width: var(--wallWidth);
    overflow: hidden;
    box-shadow: inset 1px 1px var(--color-text-dim), inset -1px -1px var(--color-text-dim);
  }
  div.rooms > div {
    position: relative;
    width: 16rem;
    min-height: 16rem;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    font-size: 2rem;
    border-radius: 0;
    color: var(--color-text);
    background-color: var(--color-bg);
    /* border: var(--border); border-color: red; */
  }
  div.rooms > div.connectedRoom {
    color: var(--color-text-bright);
    background-color: var(--color-header);
  }
  div.rooms > div.thisRoom {
    color: var(--color-text-bright);
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
    top: 0;
    bottom: 0;
    right: -2.1rem;
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
    background-color: var(--color-text-dim);
  }
  button > span {
    font-size: 1rem;
    display: grid;
    place-items: center;
    line-height: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.6rem;
    height: 1.6rem;
    border: var(--border);
    border-color: var(--color-text-dim);
    border-width: var(--wallWidth);
    border-radius: var(--radius);
    border-radius: 99px;
    box-shadow: var(--shadow);
    color: var(--color-bg);
    background-color: var(--color-text-dim);
  }
  button.noWall > span {
    font-size: 1rem;
    border-color: var(--color-bg-secondary);
    color: var(--color-text-dim);
    background-color: var(--color-bg-secondary);
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