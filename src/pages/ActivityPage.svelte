<!-- Javascript -->
<script>

  // Imports
  import { global } from '../js/global.js';
  import { ws } from '../js/simpl-ws'

  // Import Components
  import Icon from '../components/Icon.svelte'
  import Loading from '../components/Loading.svelte'
  import Activity from '../components/Activity.svelte'

  // Configuration
  export let config = {
    "name": "Home",
    "file": "ActivityPage",
    "simplSubscriptionID": "ActivityPage",
    "heading": "Select an activity to get started...",
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
        "icon": "co_present-fill",
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
        "popup": "Phone",
        "icon": "phone",
        "color": "purple"
      }
    ]
  }

  // Variables
  let heading = config.heading
  let activities = config.activities
  let show = config.lowerLeftButton.show
  let icon = config.lowerLeftButton.icon
  let label = config.lowerLeftButton.label
  let page = config.lowerLeftButton.page

  // Websocket
  let wsSub = config.simplSubscriptionID ?? config.file
  ws.addSubscription(wsSub, rx => {
    // Handel recived data
  })

  // Functions
  function pressActivity(activity) {
    if (activity.page) $global.router.page = activity.page
    if (activity.popup) $global.router.popup = activity.popup
    ws.debug(`Activity id ${activity.id} "${activity.name}" was pressed`)
    ws.analog(wsSub, 1, activity.id)
    ws.digitalPulse(wsSub, activity.id)
  }
  function pressLowerLeftButton() {
    $global.router.page = page
  }

  // Debug
  $: console.log("ActivityPage activities", activities)

</script>

<!-- HTML -->
<!-- <Loading show={!$ws.subscriptions[wsSub]?.ready && $global.config?.server?.online}/> -->
<section>
  <h2>{heading}</h2>
  <div>
    {#each activities as activity}
      <Activity {...activity} on:click={() => pressActivity(activity) }/>
    {/each}
  </div>
  {#if show}
    <button class="extraButton" on:click={pressLowerLeftButton}>
      {label}
      <Icon name={icon} size=2/>
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