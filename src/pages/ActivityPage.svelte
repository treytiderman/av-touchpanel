<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

  // Configuration
  export let config
  let exampleConfig = {
    "name": "Home",
    "file": "ActivityPage",
    "SIMPL": {
      "ip": "192.168.1.69",
      "port": 10000,
      "path": "ActivityPage"
    },
    "lowerLeftButton": {
      "show": true,
      "icon": "settings",
      "label": "Settings",
      "page": "Device Power"
    },
    "activities": [
      {
        "id": 1,
        "name": "Presentation",
        "page": "Presentation",
        "icon": "co_present",
        "color": "green"
      },
      {
        "id": 2,
        "name": "Video Call",
        "page": "Cameras",
        "icon": "videocam",
        "color": "yellow"
      },
      {
        "id": 3,
        "name": "Volumes",
        "page": "Audio",
        "icon": "volume_up"
      },
      {
        "id": 4,
        "name": "Phone",
        "page": "Phone",
        "icon": "phone",
        "color": "purple"
      }
    ]
  }

  // Components
  import Icon from '../components/Icon.svelte'
  import Activity from '../components/Activity.svelte'

  // Variables
  let activities = config.activities
  let show = config.lowerLeftButton.show
  let icon = config.lowerLeftButton.icon
  let label = config.lowerLeftButton.label
  let page = config.lowerLeftButton.page

  // Functions
  function pressActivity(activity) {
    $router.page = activity.page
  }
  function pressLowerLeftButton() {
    $router.page = page
  }

</script>

<!-- HTML -->
<section>
  <h2>Select an activity to get started...</h2>
  <div>
    {#each activities as activity}
      <Activity {...activity} on:click={() => pressActivity(activity) }/>
    {/each}
  </div>
  {#if show}
    <button class="lowerLeft" on:click={pressLowerLeftButton}>
      <Icon name={icon} size=2/>
      {label}
    </button>
  {/if}

</section>

<!-- CSS -->
<style>
  section {
    display: grid;
    gap: var(--gap);
  }
  div {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--gap)*2);
    justify-content: center;
  }
  h2 {
    font-weight: lighter;
    margin-bottom: var(--gap);
  }
  @media (max-width: 1000px) {
    div {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap);
      justify-content: center;
    }
    h2 {
      font-size: 1.4rem;
      text-align: center;
      font-weight: lighter;
    }
  }
</style>