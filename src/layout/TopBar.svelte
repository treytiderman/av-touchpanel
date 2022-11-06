<!-- Javascript -->
<script>

  // Stores
  import { global } from '../js/global.js';

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

  // Variables
  $: title = $global.config.pages[$global.router.page].name || $global.config.pages[$global.router.page].subpages
  $: file = $global.config.pages[$global.router.page].file || "..."
  let editMode = $global.url.search.edit === "true"
  let timeout
  let show = config.show
  let homePage = config.homePage
  let powerPage = config.powerPage
  let popups = config.popups ? config.popups : []
  let toggles = config.toggles ? config.toggles : []
  let showdarkMode = config.darkMode

  // Functions
  function togglePress(toggle) {
    toggle.state = !toggle.state
    toggles = toggles
    ws.digitalPulse(wsSub, toggle.id)
    ws.debug(`Toggle id ${toggle.id} "${toggle.state ? toggle.onState.name : toggle.offState.name}" from ${!toggle.state}`)
  }
  function popupPress(popup) {
    $global.router.popup = popup.page
    ws.debug(`Popup id ${popup.id} "${popup.name}" opened`)
  }

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? "TopBar"
  ws.addSubscription(wsSub, rx => {
    toggles.forEach(toggle => {
      toggle.state = rx.digital[toggle.id]
    })
    toggles = toggles
  })
  ws.addSubscription("TouchPanel", rx => {})

</script>

<!-- HTML -->
{#if show}
<header style={$$props.style}>

  <!-- Home -->
  <button
    style="padding: var(--gap);"
    on:click={() => $global.router.page = homePage}
    on:pointerup={() => clearTimeout(timeout)}
    on:pointerdown={() => timeout = setTimeout(() => location.reload(true), 1000)}
  >
    <Icon name="home"/>
  </button>

  <!-- Title -->
  <h4>{title} {editMode ? `[${file}]` : ""}</h4>
  <div>

    <!-- Dark Mode -->
    {#if showdarkMode}
      {#if $global.config.client.theme === "light"}
        <button on:click={() => $global.config.client.theme = 'dark'}>
          <Icon name="dark_mode" />
          <small>Dark Mode</small>
        </button>
      {:else}
        <button on:click={() => $global.config.client.theme = 'light'}>
          <Icon name="light_mode" />
          <small>Light Mode</small>
        </button>
      {/if}
    {/if}

    <!-- Popups -->
    {#each popups as popup}
      <button on:click={() => popupPress(popup)}>
        <Icon name={popup.icon} />
        <small>{popup.name} {editMode ? `[${popup.id}]` : ""}</small>
      </button>
    {/each}

    <!-- Toggles -->
    {#each toggles as toggle}
      {#if toggle.state}
        <button 
          style="color: var(--color-bg-{toggle.onState.color});"
          on:click={() => togglePress(toggle)}>
          <Icon name={toggle.onState.icon}/>
          <small>{toggle.onState.name} {editMode ? `[${toggle.id}]` : ""}</small>
        </button>
      {:else}
        <button 
          style="color: var(--color-bg-{toggle.offState.color});"
          on:click={() => togglePress(toggle)}>
          <Icon name={toggle.offState.icon}/>
          <small>{toggle.offState.name} {editMode ? `[${toggle.id}]` : ""}</small>
        </button>
      {/if}
    {/each}

    <!-- Edit Mode -->
    {#if editMode}
      <button on:click={() => {
        $global.config.pages["config"] = {
          "name": "Configuration Edit",
          "file": "ConfigPage"
        }
        $global.router.page = "config"
      }}>
        <Icon name="edit"/>
        <small>Edit Config</small>
      </button>
    {/if}

    <!-- Power Button -->
    <button on:click={() => $global.router.popup = powerPage} style="padding: var(--gap);">
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
    display: grid;
    align-items: center;
    justify-content: center;
    color: var(--color-text-bright);
  }
  h4 {
    white-space: nowrap;
  }
  @media (max-width: 550px) {
    /* Dont show the title on phones */
    h4 {
      display: none;
    }
  }
</style>
