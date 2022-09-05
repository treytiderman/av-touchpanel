<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config = {
    "darkMode": true,
    "popups": [
      {
        "id": 1,
        "name": "Audio",
        "page": "Audio",
        "icon": "volume_up",
      },
      {
        "id": 2,
        "name": "Pres",
        "page": "Presentation",
        "icon": "co_present",
      }
    ],
    "toggles": [
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

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  export let editMode = false
  let popups = config.popups ? config.popups : []
  let toggles = config.toggles ? config.toggles : []
  let showdarkMode = config.darkMode

</script>

<!-- Dark Mode -->
{#if showdarkMode}
  {#if $configFile.view.theme === "light"}
    <button on:click={() => $configFile.view.theme = 'dark'}>
      <Icon name="dark_mode" />
      <small>Dark Mode</small>
    </button>
  {:else}
    <button on:click={() => $configFile.view.theme = 'light'}>
      <Icon name="light_mode" />
      <small>Light Mode</small>
    </button>
  {/if}
{/if}

<!-- Popups -->
{#each popups as popup}
  <button on:click={() => $router.popup = popup.page}>
    <Icon name={popup.icon} />
    <small>{popup.name}</small>
  </button>
{/each}

<!-- Toggles -->
{#each toggles as toggle}
  {#if toggle.state}
    <button 
      style="color: var(--color-bg-{toggle.onState.color});"
      on:click={() => toggle.state = false}>
      <Icon name={toggle.onState.icon}/>
      <small>{toggle.onState.name}</small>
    </button>
  {:else}
    <button 
      style="color: var(--color-bg-{toggle.offState.color});"
      on:click={() => toggle.state = true}>
      <Icon name={toggle.offState.icon}/>
      <small>{toggle.offState.name}</small>
    </button>
  {/if}
{/each}

<!-- Edit Mode -->
{#if editMode}
  <button on:click={() => {
    $configFile.pages["config"] = {
      "name": "Configuration Edit",
      "file": "ConfigPage",
      "SIMPL": {
        "subscription": "ConfigPage"
      }
    }
    $router.page = "config"
  }}>
    <Icon name="edit"/>
    <small>Edit Config</small>
  </button>
{/if}

<!-- CSS -->
<style>
  button {
    display: grid;
    align-items: center;
  }
</style>