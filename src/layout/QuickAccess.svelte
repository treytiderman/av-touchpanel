<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config
  const defaultConfig = {
    "privacy": true,
    "volumes": true,
    "walls": true,
    "record": true
  }

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  export let editMode = false
  let showWalls = config.walls
  let showRecord = config.record
  let showVolumes = config.volumes
  let showPrivacy = config.privacy
  let showdarkMode = config.darkMode

</script>

<!-- Walls -->
{#if showWalls}
  {#if $global.combined}
    <button on:click={() => router.set("popup", "WallsPage")}>
      <Icon name="join_full" />
      <small>Room Split</small>
    </button>
  {:else}
    <button on:click={() => router.set("popup", "WallsPage")}>
      <!-- <Icon name="join_left" /> -->
      <Icon name="join_right" />
      <small>Room Join</small>
    </button>
  {/if}
{/if}

<!-- Dark Mode -->
{#if showdarkMode}
  {#if $configFile.theme === "light"}
    <button on:click={() => $configFile.theme = 'dark'}>
      <Icon name="dark_mode" />
      <small>Dark Mode</small>
    </button>
  {:else}
    <button on:click={() => $configFile.theme = 'light'}>
      <Icon name="light_mode" />
      <small>Light Mode</small>
    </button>
  {/if}
{/if}

<!-- Record -->
{#if showRecord}
<button on:click={() => $router.popup = "Presentation"}>
  <Icon name="radio_button_unchecked"/>
  <small>Record</small>
</button>
{/if}

<!-- Volumes -->
{#if showVolumes}
<button on:click={() => $router.popup = "Audio"}>
  <Icon name="volume_up" />
  <small>Volumes</small>
</button>
{/if}

<!-- Privacy -->
{#if showPrivacy}
  {#if $global.privacyMute}
    <button class="privacy" on:click={() => $global.privacyMute = false}>
      <Icon name="mic_off" />
      <small>Privacy</small>
    </button>
  {:else}
    <button on:click={() => $global.privacyMute = true}>
      <Icon name="mic" />
      <small>Privacy</small>
    </button>
  {/if}
{/if}

<!-- Edit Mode -->
{#if editMode}
  <button on:click={() => $router.page = "ConfigPage"}>
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
  .privacy {
    color: var(--color-bg-red);
  }
</style>