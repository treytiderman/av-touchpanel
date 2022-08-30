<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config
  const exampleConfig = {
    "show": true,
    "homePage": "Activities",
    "powerPage": "",
    "quickAccess": {
      "privacy": false,
      "volumes": false,
      "record": false,
      "walls": false
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
    /* border-bottom: var(--border); */
  }
  div {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }
  button {
    padding: var(--gap);
    background-color: transparent;
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
