<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config = {
    "show": true,
    "homePage": "activities",
    "powerPage": "system off",
    "quickAccess": {
      "darkMode": true,
      "popups": [
        {
          "id": 1,
          "name": "Audio",
          "page": "audio",
          "icon": "volume_up"
        },
        {
          "id": 2,
          "name": "Camera",
          "page": "camera",
          "icon": "videocam"
        }
      ],
      "toggles": [
        {
          "id": 2,
          "state": false,
          "onState": {
            "icon": "join_full",
            "name": "Combine"
          },
          "offState": {
            "icon": "join_right",
            "name": "Split"
          }
        },
        {
          "id": 1,
          "state": false,
          "onState": {
            "icon": "mic_off",
            "name": "Privacy",
            "color": "red"
          },
          "offState": {
            "icon": "mic",
            "name": "Privacy"
          }
        }
      ]
    }
  }

  // Components 
  import Icon from '../components/Icon.svelte'
  import QuickAccess from './QuickAccess.svelte'
  
  // Exports
  $: title = $configFile.pages[$router.page].name || $configFile.pages[$router.page].subpages
  $: file = $configFile.pages[$router.page].file || $configFile.pages[$router.page].subpages
  let editMode = $global.url.search.edit === "true"
  let timeout
  let show = config.show
  let homePage = config.homePage
  let powerPage = config.powerPage
  let quickAccessConfig = config.quickAccess

</script>

<!-- HTML -->
{#if show}
<header style={$$props.style}>
  <button 
    on:click={() => $router.page = homePage}
    on:pointerup={() => clearTimeout(timeout)}
    on:pointerdown={() => timeout = setTimeout(() => location.reload(), 1000)}
  >
    <Icon name="home"/>
  </button>
  <h4>{title} {editMode ? `- [${file}]` : ""}</h4>
  <div>
    <QuickAccess config={quickAccessConfig} editMode={editMode}/>
    <button on:click={() => $router.popup = powerPage}>
      <Icon name="power_rounded" />
    </button>
  </div>
</header>
{/if}

<!-- CSS -->
<style>
  header {
    z-index: 10;
    height: 4rem;
    min-height: 4rem;

    overflow-x: auto;
    overflow-y: hidden;
    
    display: flex;
    align-items: center;
    
    font-size: 2em;
    color: var(--color-text-bright);
    background-color: var(--color-header);
  }
  div {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }
  button {
    padding: var(--gap);
    display: grid;
    align-items: center;
  }
  h4 {
    white-space: nowrap;
  }
  @media (max-width: 550px) {
    h4 {
      display: none;
    }
  }
</style>
